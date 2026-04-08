import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { DashboardLayout } from './components/DashboardLayout'
import { LoginPage } from './pages/LoginPage'
import { DashboardHome } from './pages/DashboardHome'
import { AnalyzePage } from './pages/AnalyzePage'
import { ResultsPage } from './pages/ResultsPage'
import { CreateResumePage } from './pages/CreateResumePage'
import { CreateResumeResultPage } from './pages/CreateResumeResultPage'
import { CreatePostPage } from './pages/CreatePostPage'
import { PostResultPage } from './pages/PostResultPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="analyze" element={<AnalyzePage />} />
            <Route path="results" element={<ResultsPage />} />
            <Route path="create" element={<CreateResumePage />} />
            <Route path="create-result" element={<CreateResumeResultPage />} />
            <Route path="post" element={<CreatePostPage />} />
            <Route path="post-result" element={<PostResultPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
