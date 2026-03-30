import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Support from './pages/Support'
import HealthTips from './pages/HealthTips'
import Blogs from './pages/Blogs'
import Research from './pages/Research'
import PatientStories from './pages/PatientStories'
import FindHospitals from './pages/FindHospitals'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import { ProtectedRoute, PublicOnlyRoute } from './components/AuthGuard'

function App() {
  return (
    <div className="flex w-full min-h-screen flex-col bg-[#020617] text-slate-100">
      <Navbar />
      <main className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/support" element={<Support />} />
          <Route path="/health-tips" element={<HealthTips />} />
          <Route path="/find-hospitals" element={<FindHospitals />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/research" element={<Research />} />
          <Route path="/patient-stories" element={<PatientStories />} />
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicOnlyRoute>
                <Signup />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
export default App
