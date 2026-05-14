import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Splash from './pages/Splash'
import HomeInstrumento from './pages/HomeInstrumento'
import ListaAulas from './pages/ListaAulas'
import ConteudoAula from './pages/ConteudoAula'
import Ferramentas from './pages/Ferramentas'
import Metronomo from './pages/Metronomo'
import Afinador from './pages/Afinador'
import CampoHarmonico from './pages/CampoHarmonico'
import DiagramasAcordes from './pages/DiagramasAcordes'
import Quiz from './pages/Quiz'

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <Routes>
        <Route path="/" element={<Splash />} />

        {/* Violão */}
        <Route path="/violao" element={<HomeInstrumento instrumento="violao" />} />
        <Route path="/violao/aulas" element={<ListaAulas instrumento="violao" />} />
        <Route path="/violao/aulas/:id" element={<ConteudoAula instrumento="violao" />} />
        <Route path="/violao/ferramentas" element={<Ferramentas instrumento="violao" />} />
        <Route path="/violao/ferramentas/metronomo" element={<Metronomo />} />
        <Route path="/violao/ferramentas/afinador" element={<Afinador />} />
        <Route path="/violao/ferramentas/campo-harmonico" element={<CampoHarmonico instrumento="violao" />} />
        <Route path="/violao/ferramentas/acordes" element={<DiagramasAcordes instrumento="violao" />} />
        <Route path="/violao/quiz/:aulaId" element={<Quiz instrumento="violao" />} />

        {/* Teclado */}
        <Route path="/teclado" element={<HomeInstrumento instrumento="teclado" />} />
        <Route path="/teclado/aulas" element={<ListaAulas instrumento="teclado" />} />
        <Route path="/teclado/aulas/:id" element={<ConteudoAula instrumento="teclado" />} />
        <Route path="/teclado/ferramentas" element={<Ferramentas instrumento="teclado" />} />
        <Route path="/teclado/ferramentas/metronomo" element={<Metronomo />} />
        <Route path="/teclado/ferramentas/campo-harmonico" element={<CampoHarmonico instrumento="teclado" />} />
        <Route path="/teclado/ferramentas/acordes" element={<DiagramasAcordes instrumento="teclado" />} />
        <Route path="/teclado/quiz/:aulaId" element={<Quiz instrumento="teclado" />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
