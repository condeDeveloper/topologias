# Topologias finitas

Topologias em conjuntos de n pontos, contadas por pré-ordens e conferidas pela definição literal, em Node puro, sem dependência nenhuma.

Uma **topologia** num conjunto X é uma família de subconjuntos — os **abertos** — que contém o vazio e o X e é fechada por união e por interseção. Num conjunto finito é só isso. A pergunta é quantas existem, e quantos abertos cada uma pode ter.

---

## Os quatro achados

**1. Em 7 pontos são 9.535.241 topologias.** Contadas sobre as **6.129.859** ordens parciais em 7 pontos, que é exatamente o número das T0 — as topologias que separam todo par de pontos. A sequência de 1 a 7: 1, 4, 29, 355, 6.942, 209.527, 9.535.241.

**2. A maior topologia que não é a discreta tem 3·2^(n−2) abertos — e nenhuma fica no meio.** De n=2 a 7, a segunda maior contagem de abertos é sempre 3·2^(n−2): 3, 6, 12, 24, 48, 96. Entre ela e 2^n (a discreta, com todos os subconjuntos) não existe topologia nenhuma. Em 7 pontos, nenhuma tem de 97 a 127 abertos.

**3. Há buracos também abaixo desse teto.** Em 4 pontos, nenhuma topologia tem **11** abertos, apesar de existirem com 10 e com 12. Em 5 pontos faltam 19, 21, 22 e 23. Contando todos, as contagens impossíveis são 0, 0, 1, 4, 11, 28, 66 para n de 1 a 7.

**4. A fração de T0 cai e depois sobe.** 75% em 2 pontos, 65,52% em 3, 61,69% em 4, **60,95% em 5** — e aí volta: 62,06% em 6, 64,29% em 7.

---

## Como a contagem funciona

Toda topologia finita é o mesmo que uma **pré-ordem** nos pontos — reflexiva e transitiva: `x ≤ y` quando todo aberto que contém y contém x. Os abertos são exatamente os conjuntos fechados para baixo nessa pré-ordem.

E toda pré-ordem é uma partição dos pontos em **blocos** (os pontos que a topologia não separa) mais uma **ordem parcial** entre os blocos. Então

```
T(n) = Σ  S(n,k) · P(k)
```

onde `S(n,k)` é Stirling de segunda espécie e `P(k)` é o número de ordens parciais rotuladas em k pontos. O número de abertos de cada topologia é o número de ideais (conjuntos fechados para baixo) da ordem nos blocos — então o histograma de abertos sai da mesma soma.

As ordens parciais são geradas ponto a ponto: o ponto novo entra com um conjunto fechado para baixo abaixo dele e um fechado para cima acima dele, disjuntos, com tudo de baixo menor que tudo de cima.

---

## As tabelas

Todos os números saem de `node ferramentas/medidor.js` e estão presos em `testes/`.

| n | topologias | T0 | T0/T | maior não discreta | buracos (abaixo do teto) | moda de abertos |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 1 | 1 | 100% | – | 0 | – |
| 2 | 4 | 3 | 75,0000% | 3 | 0 (0) | 3 |
| 3 | 29 | 19 | 65,5172% | 6 | 1 (0) | 4 |
| 4 | 355 | 219 | 61,6901% | 12 | 4 (1) | 6 |
| 5 | 6.942 | 4.231 | 60,9478% | 24 | 11 (4) | 8 |
| 6 | 209.527 | 130.023 | 62,0554% | 48 | 28 (13) | 12 |
| 7 | 9.535.241 | 6.129.859 | 64,2863% | 96 | 66 (35) | 18 |

As frações são truncadas na quarta casa, calculadas em `BigInt`.

Os buracos abaixo do teto: `[11]` em 4 pontos; `[19, 21, 22, 23]` em 5; treze em 6, começando por 29, 31, 35.

---

## Os juízes

**A definição literal.** Varre todas as famílias de subconjuntos que contêm o vazio e o conjunto todo e fica com as fechadas por união e interseção. Sem pré-ordem, sem bloco, sem Stirling. São 16.384 famílias em 4 pontos — e mais de um bilhão em 5, então ela para no 4 e a tabela diz isso. Até onde vai, bate no total **e no histograma inteiro** de abertos.

**As pré-ordens no braço.** Varre todas as relações reflexivas — 2^(n²−n) delas, 1.048.576 em 5 pontos — e fica com as transitivas. Conta os abertos de cada uma testando todo subconjunto. Bate com Stirling no total, nas T0 e em quais contagens de abertos aparecem. E reprova: das 64 relações reflexivas em 3 pontos, só 29 passam.

---

## O que as medidas me corrigiram

Nada quebrou neste projeto: Stirling, a definição literal e as pré-ordens no braço concordaram de primeira, e não vou inventar um erro para preencher a seção.

O que eu não esperava: buraco **abaixo** do teto. A primeira tabela olhava só a lacuna entre 3·2^(n−2) e 2^n, e a lista completa de contagens ausentes mostrou o 11 de 4 pontos — que não está na lacuna. A fração de T0 voltar a subir depois de n=5 também não era o que eu supunha; não escrevi previsão antes, então registro como surpresa, não como acerto ou erro.

---

## Como usar

Node 20 ou mais novo. Sem dependência.

```bash
npm test
npm run medir
node ferramentas/medidor.js sete     # o mesmo para 7 pontos (uns 15 s)
node exemplos/uso.js 4
```

```js
import { ordensComIdeais, topologias } from 'topologias'

topologias(6, ordensComIdeais(6)).total   // 209527n
```

## Os arquivos

- `src/topologias.js` — ordens parciais ponto a ponto, ideais, Stirling e a soma.
- `src/juiz.js` — a definição literal e as pré-ordens no braço.
- `src/medidas.js` — as tabelas do README, cada uma calculada uma vez só.
- `src/index.js` — a porta de entrada do pacote.
- `exemplos/uso.js` — o pacote em uso.
- `ferramentas/medidor.js` — imprime as tabelas.
- `testes/` — 22 testes, com os números do README presos.

## Licença

MIT.
