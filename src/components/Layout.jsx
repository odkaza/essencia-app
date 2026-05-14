import Header from './Header'
import BottomNav from './BottomNav'

export default function Layout({ instrumento, children }) {
  return (
    <div className="flex flex-col min-h-svh bg-surface">
      <Header instrumento={instrumento} />
      <main className="flex-1 max-w-2xl w-full mx-auto px-5 pt-4 pb-20">
        {children}
      </main>
      <BottomNav instrumento={instrumento} />
    </div>
  )
}
