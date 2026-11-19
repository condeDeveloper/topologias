#!/usr/bin/env node
// O medidor. Roda as tabelas e cospe os numeros que vao para o README.
//
//   node ferramentas/medidor.js            todas (ate n = 6)
//   node ferramentas/medidor.js contagem   T(n), T0(n) e a fracao T0
//   node ferramentas/medidor.js abertos    o teto, os buracos e a moda
//   node ferramentas/medidor.js juizes     a definicao literal e as pre-ordens no braco
//   node ferramentas/medidor.js sete       o mesmo para n = 7 (cerca de 15 s)

import { tabela, juizes } from '../src/medidas.js'

const n = (x) => (typeof x === 'bigint' ? x : BigInt(x)).toLocaleString('pt-BR')
const pad = (s, w) => String(s).padStart(w)

function tContagem (ate = 6) {
  console.log('\n== topologias em n pontos ==')
  for (const l of tabela(ate)) {
    console.log(`   n=${l.n}  T ${pad(n(l.total), 10)}   T0 ${pad(n(l.t0), 10)}   T0/T ${l.fracaoT0.toFixed(4)}%`)
  }
}

function tAbertos (ate = 6) {
  console.log('\n== quantos abertos uma topologia pode ter ==')
  for (const l of tabela(ate)) {
    if (l.n < 2) continue
    console.log(`   n=${l.n}  maior nao discreta: ${pad(l.maiorNaoDiscreta, 3)} = 3*2^(n-2)? ${l.maiorNaoDiscreta === 3 * Math.pow(2, l.n - 2)}   buracos ${pad(l.buracos.length, 2)}, abaixo desse teto ${pad(l.buracosAbaixo.length, 2)}: ${l.buracosAbaixo.slice(0, 8).join(', ')}${l.buracosAbaixo.length > 8 ? ', ...' : ''}   moda ${l.moda} abertos (${n(l.modaQuantas)})`)
  }
}

function tJuizes () {
  const r = juizes()
  console.log('\n== a definicao literal: familias fechadas por uniao e intersecao ==')
  for (const d of r.def) console.log(`   n=${d.n}  ${pad(n(d.familias), 6)} familias, ${pad(d.topologias, 3)} topologias`)
  console.log('\n== as pre-ordens no braco: relacoes reflexivas e transitivas ==')
  for (const b of r.braco) console.log(`   n=${b.n}  ${pad(n(b.relacoes), 9)} relacoes, ${pad(n(b.preordens), 5)} pre-ordens, ${pad(n(b.t0), 5)} T0`)
}

const partes = {
  contagem: () => tContagem(6),
  abertos: () => tAbertos(6),
  juizes: tJuizes,
  sete: () => { tContagem(7); tAbertos(7) }
}
const pedido = process.argv[2]
if (!pedido) { partes.contagem(); partes.abertos(); partes.juizes() } else if (partes[pedido]) partes[pedido]()
else { console.error(`nao conheco "${pedido}". conheco: ${Object.keys(partes).join(', ')}`); process.exit(1) }
