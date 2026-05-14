import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import TecladoVisual from '../components/TecladoVisual'
import { getCampoHarmonico, TONICS, GRAUS_MAIOR, GRAUS_MENOR } from '../data/campos-harmonicos'
import { getAcordeTeclado } from '../data/acordes-teclado'
import { useQuiz } from '../hooks/useQuiz'

// ─── Static data ──────────────────────────────────────────────────────────────

const ACORDES = [
  { cifra: 'C',    nome: 'Dó maior' },
  { cifra: 'D',    nome: 'Ré maior' },
  { cifra: 'E',    nome: 'Mi maior' },
  { cifra: 'F',    nome: 'Fá maior' },
  { cifra: 'G',    nome: 'Sol maior' },
  { cifra: 'A',    nome: 'Lá maior' },
  { cifra: 'B',    nome: 'Si maior' },
  { cifra: 'Bb',   nome: 'Si bemol maior' },
  { cifra: 'Eb',   nome: 'Mi bemol maior' },
  { cifra: 'F#',   nome: 'Fá sustenido maior' },
  { cifra: 'Am',   nome: 'Lá menor' },
  { cifra: 'Dm',   nome: 'Ré menor' },
  { cifra: 'Em',   nome: 'Mi menor' },
  { cifra: 'Bm',   nome: 'Si menor' },
  { cifra: 'F#m',  nome: 'Fá sustenido menor' },
  { cifra: 'Gm',   nome: 'Sol menor' },
  { cifra: 'Cm',   nome: 'Dó menor' },
  { cifra: 'Bdim', nome: 'Si diminuto' },
  { cifra: 'Edim', nome: 'Mi diminuto' },
  { cifra: 'Adim', nome: 'Lá diminuto' },
]

// Curated interval pairs — only natural notes, no enharmonic confusion
const PARES_INTERVALO = [
  { notas: ['Dó',  'Ré' ], intervalo: 'Segunda maior'  },
  { notas: ['Dó',  'Mi' ], intervalo: 'Terça maior'    },
  { notas: ['Ré',  'Fá' ], intervalo: 'Terça menor'    },
  { notas: ['Mi',  'Sol'], intervalo: 'Terça menor'    },
  { notas: ['Fá',  'Lá' ], intervalo: 'Terça maior'    },
  { notas: ['Sol', 'Si' ], intervalo: 'Terça maior'    },
  { notas: ['Lá',  'Dó' ], intervalo: 'Terça menor'    },
  { notas: ['Dó',  'Fá' ], intervalo: 'Quarta justa'   },
  { notas: ['Ré',  'Sol'], intervalo: 'Quarta justa'   },
  { notas: ['Dó',  'Sol'], intervalo: 'Quinta justa'   },
  { notas: ['Ré',  'Lá' ], intervalo: 'Quinta justa'   },
  { notas: ['Mi',  'Si' ], intervalo: 'Quinta justa'   },
  { notas: ['Dó',  'Lá' ], intervalo: 'Sexta maior'    },
  { notas: ['Dó',  'Si' ], intervalo: 'Sétima maior'   },
]

const TODOS_INTERVALOS = [
  'Segunda maior', 'Terça menor', 'Terça maior',
  'Quarta justa', 'Quinta justa', 'Sexta maior', 'Sétima maior',
]

const TONICS_QUIZ = ['C', 'D', 'E', 'F', 'G', 'A', 'Bb', 'Eb']

const TOTAL_PERGUNTAS = 5

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickDistinct(pool, n, exclude = []) {
  return shuffle(pool.filter(x => !exclude.includes(x))).slice(0, n)
}

// ─── Question generators ──────────────────────────────────────────────────────

function tipo1() {
  const acorde = pick(ACORDES)
  const distracts = pickDistinct(ACORDES.map(a => a.nome), 3, [acorde.nome])
  return {
    tipo: 1,
    rotulo: 'Cifra → Nome',
    pergunta: `Qual é o nome completo do acorde ${acorde.cifra}?`,
    opcoes: shuffle([acorde.nome, ...distracts]),
    resposta: acorde.nome,
  }
}

function tipo2() {
  const acorde = pick(ACORDES)
  const distracts = pickDistinct(ACORDES.map(a => a.cifra), 3, [acorde.cifra])
  return {
    tipo: 2,
    rotulo: 'Nome → Cifra',
    pergunta: `Qual é a cifra de "${acorde.nome}"?`,
    opcoes: shuffle([acorde.cifra, ...distracts]),
    resposta: acorde.cifra,
  }
}

function tipo3() {
  const tonica = pick(TONICS_QUIZ)
  const modo   = pick(['maior', 'menor'])
  const campo  = getCampoHarmonico(tonica, modo)
  const grauObj = pick(campo)
  const subformato = pick([1, 2])

  if (subformato === 1) {
    // "Qual acorde é o grau V de G maior?" → chord name options
    const outrasCifras = pickDistinct(campo.map(g => g.nome), 3, [grauObj.nome])
    return {
      tipo: 3,
      rotulo: 'Campo Harmônico',
      pergunta: `No campo de ${tonica} ${modo}, qual acorde é o grau ${grauObj.grau}?`,
      opcoes: shuffle([grauObj.nome, ...outrasCifras]),
      resposta: grauObj.nome,
    }
  } else {
    // "O acorde Am é o grau ___ de C maior?" → grau options
    const grausBase = modo === 'maior' ? GRAUS_MAIOR : GRAUS_MENOR
    const outrosGraus = pickDistinct(grausBase, 3, [grauObj.grau])
    return {
      tipo: 3,
      rotulo: 'Campo Harmônico',
      pergunta: `No campo de ${tonica} ${modo}, o acorde ${grauObj.nome} é o grau:`,
      opcoes: shuffle([grauObj.grau, ...outrosGraus]),
      resposta: grauObj.grau,
    }
  }
}

function tipo4() {
  const par = pick(PARES_INTERVALO)
  const distracts = pickDistinct(TODOS_INTERVALOS, 3, [par.intervalo])
  return {
    tipo: 4,
    rotulo: 'Intervalo',
    pergunta: `Qual é o intervalo entre ${par.notas[0]} e ${par.notas[1]}?`,
    opcoes: shuffle([par.intervalo, ...distracts]),
    resposta: par.intervalo,
  }
}

function tipo5() {
  // Only use chords without dim (simpler triads for tapping)
  const candidatos = ACORDES.filter(a => !a.cifra.includes('dim'))
  const acorde = pick(candidatos)
  const info   = getAcordeTeclado(acorde.cifra)
  const notasCorretas = info ? info.notas.map(n => n.replace(/\d+$/, '')) : ['C', 'E', 'G']
  return {
    tipo: 5,
    rotulo: 'Notas no Teclado',
    pergunta: `Toque as notas do acorde ${acorde.nome} no teclado:`,
    resposta: notasCorretas,           // ['C','E','G']  — names without octave
    notasTeclado: info ? info.notas : ['C3', 'E3', 'G3'], // with octave for display
    opcoes: [],
  }
}

function gerarPerguntas(instrumento) {
  const tipos = instrumento === 'teclado'
    ? shuffle([1, 2, 3, 4, 5])
    : shuffle([1, 2, 3, 4, 1])  // no type 5 for guitar
  return tipos.map(t => {
    if (t === 1) return tipo1()
    if (t === 2) return tipo2()
    if (t === 3) return tipo3()
    if (t === 4) return tipo4()
    return tipo5()
  })
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProgressoDots({ total, atual, respondidas }) {
  return (
    <div className="flex justify-center gap-2 mb-5">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`w-2.5 h-2.5 rounded-full transition-colors ${
            i < respondidas   ? 'bg-mint' :
            i === atual       ? 'bg-mint-light border-2 border-mint' :
                                'bg-gray-200'
          }`}
        />
      ))}
    </div>
  )
}

function Estrelas({ acertos, total }) {
  const pct = acertos / total
  const n   = pct >= 1 ? 5 : pct >= 0.8 ? 4 : pct >= 0.6 ? 3 : pct >= 0.4 ? 2 : 1
  return <span className="text-3xl">{'⭐'.repeat(n)}{'☆'.repeat(5 - n)}</span>
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Quiz({ instrumento }) {
  const { aulaId } = useParams()
  const navigate   = useNavigate()
  const { scores, salvarScore } = useQuiz(instrumento)

  // Quiz state machine: inicio → pergunta → feedback → resultado
  const [fase,          setFase]         = useState('inicio')
  const [perguntas,     setPerguntas]    = useState([])
  const [idx,           setIdx]          = useState(0)
  const [respostaSel,   setRespostaSel]  = useState(null)  // string | null
  const [notasSel,      setNotasSel]     = useState([])    // for tipo5
  const [acertos,       setAcertos]      = useState(0)

  const prevScore = scores[aulaId] ?? null

  // ── Derived ──
  const pergunta  = perguntas[idx] ?? null
  const correto   = pergunta
    ? (pergunta.tipo === 5
        ? respostaSel === 'correto'
        : respostaSel === pergunta.resposta)
    : false

  // ── Actions ──
  function iniciarQuiz() {
    setPerguntas(gerarPerguntas(instrumento))
    setIdx(0)
    setRespostaSel(null)
    setNotasSel([])
    setAcertos(0)
    setFase('pergunta')
  }

  function responder(opcao) {
    if (fase !== 'pergunta') return
    const certo = opcao === pergunta.resposta
    if (certo) setAcertos(a => a + 1)
    setRespostaSel(opcao)
    setFase('feedback')
  }

  function verificarTeclado() {
    const selecionadas = [...new Set(notasSel.map(n => n.replace(/\d+$/, '')))]
    const corretas     = pergunta.resposta
    const certo = selecionadas.length === corretas.length &&
      corretas.every(n => selecionadas.includes(n))
    if (certo) setAcertos(a => a + 1)
    setRespostaSel(certo ? 'correto' : 'errado')
    setFase('feedback')
  }

  async function proxima() {
    const ultimo = idx >= TOTAL_PERGUNTAS - 1
    if (ultimo) {
      await salvarScore(aulaId, acertos, TOTAL_PERGUNTAS)
      setFase('resultado')
    } else {
      setIdx(i => i + 1)
      setRespostaSel(null)
      setNotasSel([])
      setFase('pergunta')
    }
  }

  function onTeclaClick(noteId) {
    if (fase !== 'pergunta') return
    setNotasSel(prev => {
      const noteName = noteId.replace(/\d+$/, '')
      const jaTemEssaNota = prev.some(n => n.replace(/\d+$/, '') === noteName)
      if (jaTemEssaNota) return prev.filter(n => n.replace(/\d+$/, '') !== noteName)
      if (prev.length >= 3) return prev
      return [...prev, noteId]
    })
  }

  // ── Option button style ──
  function getOpcaoCls(opcao) {
    const base = 'w-full text-left px-4 py-3.5 rounded-2xl border-2 text-sm font-semibold transition-colors'
    if (fase === 'pergunta') {
      return `${base} ${
        respostaSel === opcao
          ? 'bg-mint-light border-mint text-mint-dark'
          : 'bg-white border-gray-200 text-gray-800 hover:border-mint active:bg-mint-light'
      }`
    }
    // Feedback mode
    const eCorreta   = opcao === pergunta.resposta
    const foiSelecionada = opcao === respostaSel
    if (eCorreta)       return `${base} bg-green-50 border-green-500 text-green-800`
    if (foiSelecionada) return `${base} bg-red-50 border-red-500 text-red-800`
    return `${base} bg-gray-50 border-gray-100 text-gray-400`
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // ── Render ──
  // ─────────────────────────────────────────────────────────────────────────────

  if (fase === 'inicio') {
    return (
      <Layout instrumento={instrumento}>
        <div className="py-4 flex flex-col gap-5">
          <h1 className="text-2xl font-bold text-mint-dark">Quiz</h1>
          <div className="bg-white rounded-2xl shadow-sm p-6 text-center flex flex-col items-center gap-3">
            <div className="text-5xl">🎵</div>
            <div>
              <h2 className="text-xl font-bold text-mint-dark">Teste seus conhecimentos</h2>
              <p className="text-sm text-text-light mt-1">
                {TOTAL_PERGUNTAS} perguntas sobre teoria musical e acordes
              </p>
            </div>
            {prevScore && (
              <div className="text-xs text-text-light bg-mint-light rounded-xl px-4 py-2">
                Melhor pontuação: <strong>{prevScore.melhor}/{TOTAL_PERGUNTAS}</strong>
                {' '}· {prevScore.tentativas} tentativa{prevScore.tentativas !== 1 ? 's' : ''}
              </div>
            )}
            <div className="flex flex-col gap-2 w-full text-xs text-text-light text-left mt-1">
              {['Cifra → Nome por extenso', 'Nome → Cifra', 'Grau no campo harmônico', 'Identificar intervalo',
                instrumento === 'teclado' ? 'Selecionar notas no teclado' : 'Prática de acordes'].map(t => (
                <div key={t} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-mint shrink-0" />
                  {t}
                </div>
              ))}
            </div>
            <button
              onClick={iniciarQuiz}
              className="w-full py-4 mt-2 bg-mint text-white rounded-2xl text-base font-bold shadow-sm hover:bg-mint-dark active:scale-95 transition-all"
            >
              Começar Quiz
            </button>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-text-light text-center"
          >
            ← Voltar
          </button>
        </div>
      </Layout>
    )
  }

  if (fase === 'resultado') {
    const pct = acertos / TOTAL_PERGUNTAS
    const msg = pct >= 1    ? 'Perfeito! Você domina o conteúdo! 🎉'
              : pct >= 0.8  ? 'Excelente! Quase perfeito!'
              : pct >= 0.6  ? 'Muito bem! Continue praticando.'
              : pct >= 0.4  ? 'Bom esforço! Revise o conteúdo e tente de novo.'
              :               'Continue estudando — você vai melhorar!'
    return (
      <Layout instrumento={instrumento}>
        <div className="py-4 flex flex-col gap-5">
          <h1 className="text-2xl font-bold text-mint-dark">Resultado</h1>
          <div className="bg-white rounded-2xl shadow-sm p-6 text-center flex flex-col items-center gap-4">
            <Estrelas acertos={acertos} total={TOTAL_PERGUNTAS} />
            <div>
              <p className="text-5xl font-bold text-mint-dark">{acertos}/{TOTAL_PERGUNTAS}</p>
              <p className="text-sm text-text-light mt-1">acertos</p>
            </div>
            <p className="text-sm text-gray-700">{msg}</p>
            {prevScore?.melhor > 0 && (
              <p className="text-xs text-text-light">
                Melhor pontuação anterior: {prevScore.melhor}/{TOTAL_PERGUNTAS}
              </p>
            )}
            <div className="flex gap-3 w-full mt-2">
              <button
                onClick={iniciarQuiz}
                className="flex-1 py-3 rounded-2xl text-sm font-bold border-2 border-mint-light text-mint-dark hover:border-mint transition-colors"
              >
                Tentar novamente
              </button>
              <button
                onClick={() => navigate(-1)}
                className="flex-1 py-3 rounded-2xl text-sm font-bold bg-mint text-white shadow-sm hover:bg-mint-dark transition-colors"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  // fase === 'pergunta' | 'feedback'
  if (!pergunta) return null

  const mostrarTeclado = pergunta.tipo === 5
  const notasExibir    = fase === 'feedback' ? pergunta.notasTeclado : []
  const selectedExibir = fase === 'pergunta'  ? notasSel             : []

  return (
    <Layout instrumento={instrumento}>
      <div className="py-4 flex flex-col gap-4">

        {/* Progress dots */}
        <ProgressoDots total={TOTAL_PERGUNTAS} atual={idx} respondidas={idx} />

        {/* Question card */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-mint-dark bg-mint-light px-2 py-1 rounded-full">
              {pergunta.rotulo}
            </span>
            <span className="text-xs text-text-light">{idx + 1} / {TOTAL_PERGUNTAS}</span>
          </div>
          <p className="text-base font-semibold text-gray-800 leading-snug">{pergunta.pergunta}</p>
        </div>

        {/* Multiple-choice options (tipos 1-4) */}
        {!mostrarTeclado && (
          <div className="flex flex-col gap-2">
            {pergunta.opcoes.map(opcao => (
              <button
                key={opcao}
                onClick={() => responder(opcao)}
                disabled={fase === 'feedback'}
                className={getOpcaoCls(opcao)}
              >
                {opcao}
              </button>
            ))}
          </div>
        )}

        {/* Interactive keyboard (tipo 5) */}
        {mostrarTeclado && (
          <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-3">
            <TecladoVisual
              notas={notasExibir}
              selectedNotas={selectedExibir}
              oitavas={2}
              startOctave={3}
              onKeyClick={fase === 'pergunta' ? onTeclaClick : null}
            />
            <p className="text-xs text-text-light text-center">
              {fase === 'pergunta'
                ? `${notasSel.length}/3 notas selecionadas — toque para (des)marcar`
                : correto
                  ? '✓ Correto! Notas certas em verde.'
                  : `✗ As notas corretas estão em verde.`}
            </p>
            {fase === 'pergunta' && (
              <button
                onClick={verificarTeclado}
                disabled={notasSel.length === 0}
                className={`w-full py-3 rounded-2xl text-sm font-bold transition-all ${
                  notasSel.length > 0
                    ? 'bg-mint text-white shadow-sm hover:bg-mint-dark active:scale-95'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                Verificar
              </button>
            )}
          </div>
        )}

        {/* Feedback banner */}
        {fase === 'feedback' && (
          <div className={`rounded-2xl p-4 ${correto ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <p className={`text-sm font-bold ${correto ? 'text-green-800' : 'text-red-800'}`}>
              {correto ? '✓ Correto!' : '✗ Resposta errada'}
            </p>
            {!correto && pergunta.tipo < 5 && (
              <p className="text-sm text-gray-700 mt-1">
                Resposta certa: <strong>{pergunta.resposta}</strong>
              </p>
            )}
          </div>
        )}

        {/* Next button */}
        {fase === 'feedback' && (
          <button
            onClick={proxima}
            className="w-full py-4 bg-mint text-white rounded-2xl text-base font-bold shadow-sm hover:bg-mint-dark active:scale-95 transition-all"
          >
            {idx < TOTAL_PERGUNTAS - 1 ? 'Próxima →' : 'Ver resultado'}
          </button>
        )}

      </div>
    </Layout>
  )
}
