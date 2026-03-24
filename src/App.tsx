import { Routes, Route, NavLink } from 'react-router-dom'
import { LibraryPage } from '@/pages/LibraryPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { ForgePage } from '@/pages/ForgePage'

function App() {
  return (
    <div>
      <nav className="flex gap-4 p-4 border-b">
        <NavLink to="/">Library</NavLink>
        <NavLink to="/forge">Forge</NavLink>
        <NavLink to="/settings">Settings</NavLink>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<LibraryPage />} />
          <Route path="/forge" element={<ForgePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
