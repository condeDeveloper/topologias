// Topologias em conjuntos finitos.
//
// Uma TOPOLOGIA num conjunto X e uma familia de subconjuntos (os ABERTOS) que
// contem o vazio e o X e e fechada por uniao e por intersecao. Num conjunto
// finito isso basta: uniao infinita nao existe.
//
// O atalho que torna a contagem possivel: toda topologia finita e o mesmo que
// uma PRE-ORDEM (reflexiva e transitiva) nos pontos — "x <= y quando todo aberto
// que contem y contem x". Os abertos sao exatamente os conjuntos fechados para
// baixo nessa pre-ordem.
//
// E toda pre-ordem e uma particao dos pontos em BLOCOS (os pontos que a
// topologia nao separa) mais uma ORDEM PARCIAL entre os blocos. Entao:
//
//   T(n) = soma sobre k de S(n,k) * P(k)
//
// onde S(n,k) e Stirling de segunda especie (quantas particoes em k blocos) e
// P(k) e o numero de ordens parciais rotuladas em k pontos. A topologia e T0
// exatamente quando todo bloco tem um ponto so — T0(n) = P(n).
//
// O numero de ABERTOS da topologia e o numero de conjuntos fechados para baixo
// (os "ideais") da ordem parcial nos blocos.

/**
 * Gera todas as ordens parciais rotuladas em k pontos, ponto a ponto.
 *
 * O ponto novo v entra com um conjunto D de pontos abaixo dele e um conjunto U
 * acima. Para a ordem continuar parcial: D fechado para baixo, U fechado para
 * cima, D e U disjuntos, e todo ponto de D abaixo de todo ponto de U (a
 * transitividade passando por v). `abaixo[i]` e a mascara dos pontos <= i.
 *
 * `visita` recebe a mascara `abaixo` pronta — uma COPIA.
 */
export function ordensParciais (k, visita) {
  const abaixo = new Array(k).fill(0)
  let quantas = 0
  const anda = (v) => {
    if (v === k) {
      quantas++
      if (visita) visita([...abaixo])
      return
    }
    const anteriores = (1 << v) - 1
    for (let D = 0; D <= anteriores; D++) {
      if (!fechadoParaBaixo(D, abaixo, v)) continue
      for (let U = 0; U <= anteriores; U++) {
        if (U & D) continue
        if (!fechadoParaCima(U, abaixo, v)) continue
        // Todo ponto de D tem de estar abaixo de todo ponto de U.
        let ok = true
        let u = U
        while (u && ok) {
          const b = u & -u
          const j = 31 - Math.clz32(b)
          if ((abaixo[j] & D) !== D) ok = false
          u ^= b
        }
        if (!ok) continue
        // Aplica: v fica acima de D, e todo ponto de U fica acima de v (e de D).
        const salvo = [...abaixo]
        abaixo[v] = D | (1 << v)
        u = U
        while (u) {
          const b = u & -u
          const j = 31 - Math.clz32(b)
          abaixo[j] |= abaixo[v]
          u ^= b
        }
        // Os pontos acima de algum ponto de U tambem herdam.
        for (let i = 0; i < v; i++) {
          if (U & (1 << i)) continue
          if (abaixo[i] & U) abaixo[i] |= abaixo[v]
        }
        anda(v + 1)
        for (let i = 0; i < k; i++) abaixo[i] = salvo[i]
      }
    }
  }
  anda(0)
  return quantas
}

function fechadoParaBaixo (D, abaixo, v) {
  let d = D
  while (d) {
    const b = d & -d
    const j = 31 - Math.clz32(b)
    if ((abaixo[j] & ~(1 << j) & ~D) !== 0) return false
    d ^= b
  }
  return true
}

function fechadoParaCima (U, abaixo, v) {
  for (let i = 0; i < v; i++) {
    if (U & (1 << i)) continue
    // i fora de U: nenhum ponto de U pode estar abaixo de i.
    if (abaixo[i] & U) return false
  }
  return true
}

/** Quantos conjuntos fechados para baixo a ordem tem: os abertos. */
export function ideais (abaixo) {
  const k = abaixo.length
  let total = 0
  for (let S = 0; S < (1 << k); S++) {
    let ok = true
    let s = S
    while (s) {
      const b = s & -s
      const j = 31 - Math.clz32(b)
      if ((abaixo[j] & S) !== abaixo[j]) { ok = false; break }
      s ^= b
    }
    if (ok) total++
  }
  return total
}

/** Stirling de segunda especie S(n, k), em BigInt. */
export function stirling (n, k) {
  const t = Array.from({ length: n + 1 }, () => new Array(n + 1).fill(0n))
  t[0][0] = 1n
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= i; j++) t[i][j] = BigInt(j) * t[i - 1][j] + t[i - 1][j - 1]
  }
  return t[n][k]
}

/**
 * Para cada k ate `ate`: quantas ordens parciais em k pontos, e quantas delas
 * tem cada numero de ideais.
 */
export function ordensComIdeais (ate) {
  const saida = []
  for (let k = 0; k <= ate; k++) {
    const histo = new Map()
    const total = ordensParciais(k, (ab) => {
      const m = ideais(ab)
      histo.set(m, (histo.get(m) || 0) + 1)
    })
    saida.push({ k, total, histo })
  }
  return saida
}

/**
 * Topologias em n pontos, pela soma de Stirling sobre as ordens parciais:
 * o total, as T0 e o histograma do numero de abertos.
 */
export function topologias (n, tabela) {
  const ordens = tabela || ordensComIdeais(n)
  let total = 0n
  const histo = new Map()
  for (let k = 1; k <= n; k++) {
    const s = stirling(n, k)
    total += s * BigInt(ordens[k].total)
    for (const [m, q] of ordens[k].histo) histo.set(m, (histo.get(m) || 0n) + s * BigInt(q))
  }
  const t0 = n === 0 ? 1n : BigInt(ordens[n].total)
  return { n, total, t0, histo }
}
