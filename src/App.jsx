import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
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
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import MinhasTurmas from './pages/MinhasTurmas'
import PainelProfessor from './pages/professor/PainelProfessor'
import GerenciarTurma from './pages/professor/GerenciarTurma'
import NovaTurma from './pages/professor/NovaTurma'
import EnviarAviso from './pages/professor/EnviarAviso'

function LoadingScreen() {
  return (
    <div className="min-h-svh flex items-center justify-center bg-mint-light">
      <div className="w-8 h-8 border-4 border-mint border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function RotaProtegida({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/login" replace />
  return children
}

function RotaPublica({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (user) return <Navigate to="/" replace />
  return children
}

function RotaProfessor({ children }) {
  const { user, profile, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/login" replace />
  if (profile?.papel !== 'professor') return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login"    element={<RotaPublica><Login /></RotaPublica>} />
        <Route path="/cadastro" element={<RotaPublica><Cadastro /></RotaPublica>} />

        {/* Seleção de instrumento */}
        <Route path="/" element={<RotaProtegida><Splash /></RotaProtegida>} />

        {/* Violão */}
        <Route path="/violao"                              element={<RotaProtegida><HomeInstrumento instrumento="violao" /></RotaProtegida>} />
        <Route path="/violao/aulas"                        element={<RotaProtegida><ListaAulas instrumento="violao" /></RotaProtegida>} />
        <Route path="/violao/aulas/:id"                    element={<RotaProtegida><ConteudoAula instrumento="violao" /></RotaProtegida>} />
        <Route path="/violao/ferramentas"                  element={<RotaProtegida><Ferramentas instrumento="violao" /></RotaProtegida>} />
        <Route path="/violao/ferramentas/metronomo"        element={<RotaProtegida><Metronomo /></RotaProtegida>} />
        <Route path="/violao/ferramentas/afinador"         element={<RotaProtegida><Afinador /></RotaProtegida>} />
        <Route path="/violao/ferramentas/campo-harmonico"  element={<RotaProtegida><CampoHarmonico instrumento="violao" /></RotaProtegida>} />
        <Route path="/violao/ferramentas/acordes"          element={<RotaProtegida><DiagramasAcordes instrumento="violao" /></RotaProtegida>} />
        <Route path="/violao/quiz/:aulaId"                 element={<RotaProtegida><Quiz instrumento="violao" /></RotaProtegida>} />
        <Route path="/violao/turmas"                       element={<RotaProtegida><MinhasTurmas instrumento="violao" /></RotaProtegida>} />

        {/* Teclado */}
        <Route path="/teclado"                             element={<RotaProtegida><HomeInstrumento instrumento="teclado" /></RotaProtegida>} />
        <Route path="/teclado/aulas"                       element={<RotaProtegida><ListaAulas instrumento="teclado" /></RotaProtegida>} />
        <Route path="/teclado/aulas/:id"                   element={<RotaProtegida><ConteudoAula instrumento="teclado" /></RotaProtegida>} />
        <Route path="/teclado/ferramentas"                 element={<RotaProtegida><Ferramentas instrumento="teclado" /></RotaProtegida>} />
        <Route path="/teclado/ferramentas/metronomo"       element={<RotaProtegida><Metronomo /></RotaProtegida>} />
        <Route path="/teclado/ferramentas/campo-harmonico" element={<RotaProtegida><CampoHarmonico instrumento="teclado" /></RotaProtegida>} />
        <Route path="/teclado/ferramentas/acordes"         element={<RotaProtegida><DiagramasAcordes instrumento="teclado" /></RotaProtegida>} />
        <Route path="/teclado/quiz/:aulaId"                element={<RotaProtegida><Quiz instrumento="teclado" /></RotaProtegida>} />
        <Route path="/teclado/turmas"                      element={<RotaProtegida><MinhasTurmas instrumento="teclado" /></RotaProtegida>} />

        {/* Painel do professor */}
        <Route path="/professor"                element={<RotaProfessor><PainelProfessor /></RotaProfessor>} />
        <Route path="/professor/turma/:turmaId" element={<RotaProfessor><GerenciarTurma /></RotaProfessor>} />
        <Route path="/professor/nova-turma"     element={<RotaProfessor><NovaTurma /></RotaProfessor>} />
        <Route path="/professor/aviso"          element={<RotaProfessor><EnviarAviso /></RotaProfessor>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
