import { Routes, Route } from 'react-router-dom'
import ProtectedRoutes from './protected-routes/ProtectedRoutes'
import Home from './pages/Home'
import Sidebar from './components/Sidebar'
import LoginDialog from './components/LoginDialog'
import UploadMedia from './pages/UploadMedia'
import YourDocs from './pages/YourDocs'
import YourImages from './pages/YourImages'
import YourVideos from './pages/YourVideos'
import AccountInfo from './components/AccountInfo'
import AccountEditDialog from './components/AccountInfoEdit'
import SearchPage from './pages/SearchPage'
import VoiceSearchDialog from './components/VoiceSearchDialog'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/search' element={<SearchPage />} />
        <Route path='/' element={<ProtectedRoutes />} >
          <Route path='/upload' element={<UploadMedia />} />
          <Route path='/your-docs' element={<YourDocs />} />
          <Route path='/your-images' element={<YourImages />} />
          <Route path='/your-videos' element={<YourVideos />} />
        </Route>
      </Routes>
      <Sidebar />
      <VoiceSearchDialog />
      <LoginDialog />
      <AccountInfo />
      <AccountEditDialog />
    </>
  )
}

export default App
