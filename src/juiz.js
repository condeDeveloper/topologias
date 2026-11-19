// O juiz. Dois caminhos que nao passam por ordem parcial nem por Stirling.
//
// 1. `pelaDefinicao` — a definicao literal de topologia: varre TODAS as familias
//    de subconjuntos que contem o vazio e o conjunto todo, e fica com as
//    fechadas por uniao e intersecao. Sao 2^(2^n - 2) familias: 16.384 para
//    n = 4, e mais de um bilhao para n = 5. Para no 4, e a tabela diz isso.
//
// 2. `preOrdensNoBraco` — varre todas as relacoes reflexivas em n pontos
//    (2^(n^2 - n) delas) e fica com as transitivas. Conta os abertos de cada uma
//    como os conjuntos fechados para baixo, testados um a um. Vai ate n = 5
//    (1.048.576 relacoes). Nao usa particao nem bloco nem Stirling.

/** Varre as familias de subconjuntos de {0..n-1} pela definicao. */
export function pelaDefinicao (n) {
  const conjuntos = 1 << n
  const cheio = conjuntos - 1
  const meio = []                      // os subconjuntos que nao sao vazio nem cheio
  for (let s = 1; s < cheio; s++) meio.push(s)
  const total = Math.pow(2, meio.length)
  if (total > 20_000_000) return { n, completa: false, precisaria: total }
  let topologias = 0
  const porAbertos = new Map()
  for (let f = 0; f < total; f++) {
    const familia = [0, cheio]
    for (let i = 0; i < meio.length; i++) if (f & (1 << i)) familia.push(meio[i])
    const tem = new Set(familia)
    let ok = true
    for (let a = 0; a < familia.length && ok; a++) {
      for (let b = a + 1; b < familia.length; b++) {
        if (!tem.has(familia[a] | familia[b]) || !tem.has(familia[a] & familia[b])) { ok = false; break }
      }
    }
    if (ok) {
      topologias++
      porAbertos.set(familia.length, (porAbertos.get(familia.length) || 0) + 1)
    }
  }
  return { n, completa: true, familias: total, topologias, porAbertos }
}

/** Todas as pre-ordens no braco: relacoes reflexivas e transitivas. */
export function preOrdensNoBraco (n) {
  const pares = []
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (i !== j) pares.push([i, j])
  const total = Math.pow(2, pares.length)
  if (total > 20_000_000) return { n, completa: false, precisaria: total }
  let preordens = 0
  let t0 = 0
  const porAbertos = new Map()
  const rel = Array.from({ length: n }, () => new Array(n).fill(false))
  for (let r = 0; r < total; r++) {
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) rel[i][j] = i === j
    for (let p = 0; p < pares.length; p++) if (r & (1 << p)) rel[pares[p][0]][pares[p][1]] = true
    let transitiva = true
    for (let i = 0; i < n && transitiva; i++) {
      for (let j = 0; j < n && transitiva; j++) {
        if (!rel[i][j]) continue
        for (let k = 0; k < n; k++) if (rel[j][k] && !rel[i][k]) { transitiva = false; break }
      }
    }
    if (!transitiva) continue
    preordens++
    let antissimetrica = true
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (rel[i][j] && rel[j][i]) antissimetrica = false
    if (antissimetrica) t0++
    // Abertos: conjuntos S tais que y em S e x <= y implica x em S.
    let abertos = 0
    for (let S = 0; S < (1 << n); S++) {
      let ok = true
      for (let y = 0; y < n && ok; y++) {
        if (!(S & (1 << y))) continue
        for (let x = 0; x < n; x++) if (rel[x][y] && !(S & (1 << x))) { ok = false; break }
      }
      if (ok) abertos++
    }
    porAbertos.set(abertos, (porAbertos.get(abertos) || 0) + 1)
  }
  return { n, completa: true, relacoes: total, preordens, t0, porAbertos }
}
