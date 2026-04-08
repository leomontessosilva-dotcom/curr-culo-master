import { useLocation, useNavigate } from 'react-router-dom'
import { Home, Search, FileText, PenLine } from 'lucide-react'

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Início', icon: Home, exact: true },
  { path: '/dashboard/analyze', label: 'Análise', icon: Search },
  { path: '/dashboard/create', label: 'Currículo', icon: FileText },
  { path: '/dashboard/post', label: 'Post', icon: PenLine },
]

export function MobileBottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path
    return location.pathname.startsWith(path)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 sm:hidden z-50">
      <div className="flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.path, item.exact)
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full cursor-pointer transition-colors ${
                active ? 'text-slate-900' : 'text-slate-400'
              }`}
            >
              <item.icon className={`w-5 h-5 ${active ? 'stroke-[2.5]' : ''}`} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
