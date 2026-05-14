import Header from './Header'

export default function ProfessorLayout({ children }) {
  return (
    <div className="flex flex-col min-h-svh bg-surface">
      <Header />
      <main className="flex-1 max-w-2xl w-full mx-auto px-5 pt-4 pb-10">
        {children}
      </main>
    </div>
  )
}
