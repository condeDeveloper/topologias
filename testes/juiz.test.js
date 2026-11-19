import test from 'node:test'
import assert from 'node:assert/strict'

import { ordensComIdeais, topologias } from '../src/topologias.js'
import { pelaDefinicao, preOrdensNoBraco } from '../src/juiz.js'

test('a definicao literal acha 1, 4, 29, 355', () => {
  assert.deepEqual([1, 2, 3, 4].map((n) => pelaDefinicao(n).topologias), [1, 4, 29, 355])
  assert.equal(pelaDefinicao(4).familias, 16384)
})

test('a definicao se cala onde nao alcanca', () => {
  const r = pelaDefinicao(5)
  assert.equal(r.completa, false)
  assert.equal(r.precisaria, Math.pow(2, 30))
})

test('o histograma de abertos da definicao bate com Stirling em n=4', () => {
  const d = pelaDefinicao(4)
  const s = topologias(4, ordensComIdeais(4))
  for (const [m, q] of d.porAbertos) assert.equal(BigInt(q), s.histo.get(m), `${m} abertos`)
  assert.equal(d.porAbertos.size, s.histo.size)
})

test('as pre-ordens no braco batem com Stirling ate n=4', () => {
  const tab = ordensComIdeais(4)
  for (let n = 1; n <= 4; n++) {
    const b = preOrdensNoBraco(n)
    const s = topologias(n, tab)
    assert.equal(BigInt(b.preordens), s.total, `n=${n}`)
    assert.equal(BigInt(b.t0), s.t0, `T0 n=${n}`)
  }
})

test('uma relacao nao transitiva e recusada pelo juiz', () => {
  // Juiz que aprova tudo nao e juiz: em 3 pontos existem 64 relacoes reflexivas
  // e so 29 sao transitivas.
  const b = preOrdensNoBraco(3)
  assert.equal(b.relacoes, 64)
  assert.equal(b.preordens, 29)
})
