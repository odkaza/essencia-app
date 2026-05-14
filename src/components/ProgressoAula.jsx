export default function ProgressoAula({ total, numConcluidas }) {
  const pct = total > 0 ? (numConcluidas / total) * 100 : 0

  return (
    <div>
      <div className="flex justify-between text-xs text-text-light mb-2">
        <span>Progresso</span>
        <span>{numConcluidas} de {total} concluídas</span>
      </div>
      <div className="h-2.5 bg-mint-light rounded-full overflow-hidden">
        <div
          className="h-full bg-mint rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
