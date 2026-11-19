#!/usr/bin/env node
// Exemplo de uso da biblioteca pela porta de entrada do pacote.
//
//   node exemplos/uso.js 5
//
// Conta as topologias em n pontos e mostra quantas tem cada numero de abertos.

import { ordensComIdeais, topologias } from '../src/index.js'

const n = Number(process.argv[2] || 5)
const r = topologias(n, ordensComIdeais(n))

console.log(`${n} pontos: ${r.total} topologias, ${r.t0} delas T0`)
console.log('abertos  topologias')
for (const m of [...r.histo.keys()].sort((a, b) => a - b)) console.log(`${String(m).padStart(7)}  ${r.histo.get(m)}`)
