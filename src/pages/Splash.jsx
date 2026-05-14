import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Splash() {
  const navigate = useNavigate()

  useEffect(() => {
    const salvo = localStorage.getItem('essencia_instrumento')
    if (salvo === 'violao' || salvo === 'teclado') {
      navigate(`/${salvo}`, { replace: true })
    }
  }, [navigate])

  function escolher(instrumento) {
    localStorage.setItem('essencia_instrumento', instrumento)
    navigate(`/${instrumento}`)
  }

  return (
    <div className="min-h-svh bg-mint-light flex flex-col items-center justify-center px-6 py-16 text-center">

      {/* Logo */}
      <div className="flex flex-col items-center mb-10">
        <img
          src={`${import.meta.env.BASE_URL}icons/logo-essencia.png`}
          alt="ESSÊNCIA"
          style={{ maxWidth: '220px', width: '100%' }}
          className="mb-6"
        />
        <p className="text-mint-dark font-medium text-base">
          Adoração e Iniciação Musical
        </p>
        <p className="text-xs font-semibold tracking-widest text-mint-dark/50 mt-2 uppercase">
          MEVAM ALPHAVILLE
        </p>
      </div>

      {/* Versículo */}
      <blockquote className="mb-14 max-w-xs">
        <p className="text-mint-dark/80 italic text-sm leading-relaxed">
          "Tudo quanto tem fôlego louve ao Senhor."
        </p>
        <cite className="text-mint-dark/50 text-xs not-italic mt-2 block">
          — Salmos 150:6
        </cite>
      </blockquote>

      {/* Prompt de seleção */}
      <p className="text-mint-dark font-semibold text-base mb-6">
        Escolha seu instrumento:
      </p>

      {/* Cards grandes */}
      <div className="flex flex-col sm:flex-row gap-5 w-full max-w-lg">
        <button
          onClick={() => escolher('violao')}
          className="
            flex-1 bg-white rounded-3xl shadow-md p-8
            flex flex-col items-center gap-3
            border-2 border-transparent
            hover:border-mint hover:shadow-xl hover:-translate-y-1
            active:scale-95
            transition-all duration-200
            cursor-pointer
          "
          aria-label="Selecionar Violão"
        >
          <span className="text-6xl" role="img" aria-hidden="true">🎸</span>
          <span className="text-xl font-bold text-mint-dark">Violão</span>
          <span className="text-xs text-text-light">Cordas e cifras</span>
        </button>

        <button
          onClick={() => escolher('teclado')}
          className="
            flex-1 bg-white rounded-3xl shadow-md p-8
            flex flex-col items-center gap-3
            border-2 border-transparent
            hover:border-mint hover:shadow-xl hover:-translate-y-1
            active:scale-95
            transition-all duration-200
            cursor-pointer
          "
          aria-label="Selecionar Teclado"
        >
          <span className="text-6xl" role="img" aria-hidden="true">🎹</span>
          <span className="text-xl font-bold text-mint-dark">Teclado</span>
          <span className="text-xs text-text-light">Teclas e acordes</span>
        </button>
      </div>

      {/* Rodapé motivacional */}
      <p className="mt-16 text-xs text-mint-dark/40 max-w-xs leading-relaxed">
        Todo músico começou do zero um dia.{' '}
        <br className="hidden sm:block" />
        O mais importante é a constância. Vamos juntos!
      </p>
    </div>
  )
}
