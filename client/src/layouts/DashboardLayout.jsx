import Navbar from '../components/Navbar.jsx'

export default function DashboardLayout({ children, ticketCount }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar ticketCount={ticketCount} />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {children}
      </main>
    </div>
  )
}
