// Os numeros do README, presos.

import test from 'node:test'
import assert from 'node:assert/strict'

import { tabela } from '../src/medidas.js'

test('T(n) e T0(n) de 1 a 6', () => {
  const t = tabela(6)
  assert.deepEqual(t.map((l) => l.total), [1n, 4n, 29n, 355n, 6942n, 209527n])
  assert.deepEqual(t.map((l) => l.t0), [1n, 3n, 19n, 219n, 4231n, 130023n])
})

test('a fracao T0 cai ate n=5 e volta a subir', () => {
  const f = tabela(6).map((l) => l.fracaoT0)
  assert.deepEqual(f.slice(1), [75, 65.5172, 61.6901, 60.9478, 62.0554])
  assert.ok(f[4] < f[3] && f[5] > f[4])
})

test('a maior topologia nao discreta tem 3*2^(n-2) abertos, de 2 a 6', () => {
  for (const l of tabela(6)) {
    if (l.n < 2) continue
    assert.equal(l.maiorNaoDiscreta, 3 * Math.pow(2, l.n - 2), `n=${l.n}`)
  }
})

test('nenhuma topologia fica entre 3*2^(n-2) e 2^n abertos', () => {
  for (const l of tabela(6)) {
    if (l.n < 2) continue
    for (let m = 3 * Math.pow(2, l.n - 2) + 1; m < Math.pow(2, l.n); m++) assert.ok(l.buracos.includes(m), `n=${l.n}, ${m}`)
  }
})

test('os buracos abaixo do teto comecam em n=4, com 11 abertos', () => {
  const t = tabela(6)
  assert.deepEqual(t.map((l) => l.buracosAbaixo.length), [0, 0, 0, 1, 4, 13])
  assert.deepEqual(t[3].buracosAbaixo, [11])
  assert.deepEqual(t[4].buracosAbaixo, [19, 21, 22, 23])
})

test('o total de buracos: 0, 0, 1, 4, 11, 28', () => {
  assert.deepEqual(tabela(6).map((l) => l.buracos.length), [0, 0, 1, 4, 11, 28])
})

test('a moda do numero de abertos', () => {
  assert.deepEqual(tabela(6).slice(1).map((l) => l.moda), [3, 4, 6, 8, 12])
})
