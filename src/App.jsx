import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import AddWord from './pages/AddWord'
import Favorites from './pages/Favorites'
import Import from './pages/Import'

export default function App() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-800">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddWord />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/import" element={<Import />} />
        </Routes>
      </main>
    </div>
  )
}