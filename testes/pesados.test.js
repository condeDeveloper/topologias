// O caro: n = 7, sobre as 6.129.859 ordens parciais em 7 pontos, e o juiz das
// pre-ordens no braco em n = 5 (1.048.576 relacoes).

import test from 'node:test'
import assert from 'node:assert/strict'

import { tabela } from '../src/medidas.js'
import { preOrdensNoBraco } from '../src/juiz.js'

test('n=7: 9.535.241 topologias, 6.129.859 T0', { timeout: 600000 }, () => {
  const l = tabela(7)[6]
  assert.equal(l.total, 9535241n)
  assert.equal(l.t0, 6129859n)
  assert.equal(l.fracaoT0, 64.2863)
  assert.equal(l.maiorNaoDiscreta, 96)
  assert.equal(l.buracos.length, 66)
  assert.equal(l.buracosAbaixo.length, 35)
  assert.equal(l.moda, 18)
})

test('n=5 no braco: 6.942 pre-ordens em 1.048.576 relacoes', { timeout: 600000 }, () => {
  const b = preOrdensNoBraco(5)
  assert.equal(b.relacoes, 1048576)
  assert.equal(b.preordens, 6942)
  assert.equal(b.t0, 4231)
  const s = tabela(5)[4]
  for (const [m, q] of b.porAbertos) assert.ok(s.buracos.indexOf(m) === -1, `${m} abertos aparece no braco`)
})
