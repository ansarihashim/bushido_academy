import { useEffect } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  useLocation,
} from 'react-router-dom'
import {
  SiteSettingsProvider,
  useSiteSettings,
} from './context/SiteSettingsContext'
import { ContentProvider } from './context/ContentContext'
import ManageSiteSettings from './pages/admin/ManageSiteSettings'
import ManageContent from './pages/admin/ManageContent'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import ScrollToTop from './components/ScrollToTop'
import CustomCursor from './components/CustomCursor'
import AdminFloatingButton from './components/AdminFloatingButton'
import Home from './pages/Home'
import About from './pages/About'
import KarateDetails from './pages/KarateDetails'
import KickboxingDetails from './pages/KickboxingDetails'
import Trainers from './pages/Trainers'
import Events from './pages/Events'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminOverview from './pages/admin/AdminOverview'
import AdminLogin from './pages/admin/AdminLogin'
import ManageEvents from './pages/admin/ManageEvents'
import ManageGallery from './pages/admin/ManageGallery'
import ManageSlides from './pages/admin/ManageSlides'
import ManageTrainerBio from './pages/admin/ManageTrainerBio'

function PublicLayout() {
  const { pathname } = useLocation()
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main key={pathname} className="flex-1 page-fade">
        <Outlet />
      </main>
    </div>
  )
}

function ThemedApp() {
  const { settings } = useSiteSettings()

  // Apply the chosen color theme + cursor mode to the document root so the
  // CSS variables (and the native-cursor restore for "none") take effect.
  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      settings.colorTheme || 'gold'
    )
  }, [settings.colorTheme])

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-cursor',
      settings.cursorTheme || 'crosshair'
    )
  }, [settings.cursorTheme])

  return (
    <BrowserRouter>
      <CustomCursor />
      <ScrollToTop />
      <AdminFloatingButton />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/karate" element={<KarateDetails />} />
          <Route path="/kickboxing" element={<KickboxingDetails />} />
          <Route path="/trainers" element={<Trainers />} />
          <Route path="/events" element={<Events />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminOverview />} />
          <Route path="events" element={<ManageEvents />} />
          <Route path="gallery" element={<ManageGallery />} />
          <Route path="slides" element={<ManageSlides />} />
          <Route path="trainer-bio" element={<ManageTrainerBio />} />
          <Route path="settings" element={<ManageSiteSettings />} />
          <Route path="content" element={<ManageContent />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

function App() {
  return (
    <SiteSettingsProvider>
      <ContentProvider>
        <ThemedApp />
      </ContentProvider>
    </SiteSettingsProvider>
  )
}

export default App
