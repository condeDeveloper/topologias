// As tabelas do README. Calculadas aqui, e em lugar nenhum mais.

import { ordensComIdeais, topologias } from './topologias.js'
import { pelaDefinicao, preOrdensNoBraco } from './juiz.js'

const guardadas = new Map()
function umaVez (k, fn) {
  if (!guardadas.has(k)) guardadas.set(k, fn())
  return guardadas.get(k)
}

export function ordens (ate) {
  return umaVez(`ordens:${ate}`, () => ordensComIdeais(ate))
}

/** T(n), T0(n), a fracao T0, os buracos e a moda, de 1 a `ate`. */
export function tabela (ate = 6) {
  return umaVez(`tabela:${ate}`, () => {
    const tab = ordens(ate)
    const linhas = []
    for (let n = 1; n <= ate; n++) {
      const r = topologias(n, tab)
      const teto = Math.pow(2, n)
      const abertos = [...r.histo.keys()].sort((a, b) => a - b)
      const naoDiscreta = abertos.filter((m) => m < teto).pop() ?? null
      const buracos = []
      for (let m = 2; m <= teto; m++) if (!r.histo.has(m)) buracos.push(m)
      let moda = 0
      let modaQ = 0n
      for (const [m, q] of r.histo) if (q > modaQ) { modaQ = q; moda = m }
      linhas.push({
        n,
        total: r.total,
        t0: r.t0,
        // Fracao T0 em decimos de milesimo de porcento, truncada, em BigInt.
        fracaoT0: Number((r.t0 * 1000000n) / r.total) / 10000,
        maiorNaoDiscreta: naoDiscreta,
        buracos,
        buracosAbaixo: n >= 2 ? buracos.filter((m) => m < 3 * Math.pow(2, n - 2)) : [],
        moda,
        modaQuantas: modaQ,
        discretas: r.histo.get(teto) || 0n,
        indiscretas: r.histo.get(2) || 0n
      })
    }
    return linhas
  })
}

/** Os dois juizes, onde eles alcancam. */
export function juizes () {
  return umaVez('juizes', () => {
    const def = []
    for (let n = 1; n <= 4; n++) def.push(pelaDefinicao(n))
    const braco = []
    for (let n = 1; n <= 5; n++) braco.push(preOrdensNoBraco(n))
    return { def, braco }
  })
}
