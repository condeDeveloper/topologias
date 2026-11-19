import test from 'node:test'
import assert from 'node:assert/strict'

import { ordensParciais, ideais, stirling, topologias, ordensComIdeais } from '../src/topologias.js'

test('ordens parciais rotuladas: 1, 1, 3, 19, 219, 4231', () => {
  assert.deepEqual([0, 1, 2, 3, 4, 5].map((k) => ordensParciais(k)), [1, 1, 3, 19, 219, 4231])
})

test('toda ordem gerada e reflexiva, antissimetrica e transitiva', () => {
  ordensParciais(4, (ab) => {
    const k = ab.length
    const le = (x, y) => (ab[y] & (1 << x)) !== 0
    for (let i = 0; i < k; i++) assert.ok(le(i, i))
    for (let i = 0; i < k; i++) for (let j = 0; j < k; j++) if (i !== j) assert.ok(!(le(i, j) && le(j, i)))
    for (let i = 0; i < k; i++) for (let j = 0; j < k; j++) for (let l = 0; l < k; l++) if (le(i, j) && le(j, l)) assert.ok(le(i, l))
  })
})

test('as ordens geradas sao distintas', () => {
  const vistas = new Set()
  ordensParciais(4, (ab) => vistas.add(ab.join(',')))
  assert.equal(vistas.size, 219)
})

test('a antiordem (nada comparavel) tem 2^k ideais; a cadeia tem k+1', () => {
  assert.equal(ideais([0b001, 0b010, 0b100]), 8)
  assert.equal(ideais([0b001, 0b011, 0b111]), 4)
})

test('Stirling: S(4,2) = 7, S(5,3) = 25, S(n,n) = 1', () => {
  assert.equal(stirling(4, 2), 7n)
  assert.equal(stirling(5, 3), 25n)
  assert.equal(stirling(6, 6), 1n)
})

test('topologias: 1, 4, 29, 355, 6942', () => {
  const tab = ordensComIdeais(5)
  assert.deepEqual([1, 2, 3, 4, 5].map((n) => topologias(n, tab).total), [1n, 4n, 29n, 355n, 6942n])
})

test('o histograma de abertos soma o total', () => {
  const tab = ordensComIdeais(5)
  for (let n = 1; n <= 5; n++) {
    const r = topologias(n, tab)
    let s = 0n
    for (const q of r.histo.values()) s += q
    assert.equal(s, r.total)
  }
})

test('uma topologia discreta e uma indiscreta em cada n', () => {
  const tab = ordensComIdeais(5)
  for (let n = 1; n <= 5; n++) {
    const r = topologias(n, tab)
    assert.equal(r.histo.get(Math.pow(2, n)), 1n, `discreta n=${n}`)
    if (n >= 2) assert.equal(r.histo.get(2), 1n, `indiscreta n=${n}`)
  }
})
