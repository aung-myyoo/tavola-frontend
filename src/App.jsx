import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { RestaurantProvider, useRestaurant } from './context/RestaurantContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import BottomNav from './components/BottomNav'
import Toast from './components/Toast'
import HomeScreen from './components/screens/HomeScreen'
import MenuScreen from './components/screens/MenuScreen'
import OrdersScreen from './components/screens/OrdersScreen'
import CallStaffScreen from './components/screens/CallStaffScreen'
import PaymentScreen from './components/screens/PaymentScreen'
import LoginScreen from './components/screens/LoginScreen'
import ProfileScreen from './components/screens/ProfileScreen'
import ServerDashboard from './components/screens/ServerDashboard'
import ComingSoonDashboard from './components/screens/ComingSoonDashboard'
import './App.css'

const SCREENS = {
  home: HomeScreen,
  menu: MenuScreen,
  orders: OrdersScreen,
  call: CallStaffScreen,
  payment: PaymentScreen,
}

const ROLE_DASHBOARDS = {
  SERVER: ServerDashboard,
}

function CustomerApp() {
  const { screen } = useRestaurant()
  const ScreenComponent = SCREENS[screen] ?? HomeScreen

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={screen}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
      >
        <ScreenComponent />
      </motion.div>
    </AnimatePresence>
  )
}

function StaffApp() {
  const { isAuthenticated, staff, ready } = useAuth()
  const [staffScreen, setStaffScreen] = useState('dashboard')

  if (!ready) return null
  if (!isAuthenticated) return <LoginScreen />

  const Dashboard = ROLE_DASHBOARDS[staff.role] ?? ComingSoonDashboard

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '12px 20px 0', maxWidth: 'var(--container-max)', margin: '0 auto' }}>
        <button
          className={`pill-toggle ${staffScreen === 'dashboard' ? 'active' : ''}`}
          onClick={() => setStaffScreen('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`pill-toggle ${staffScreen === 'profile' ? 'active' : ''}`}
          onClick={() => setStaffScreen('profile')}
        >
          Profile
        </button>
      </div>
      {staffScreen === 'dashboard' ? <Dashboard /> : <ProfileScreen />}
    </div>
  )
}

function AppShell() {
  const { view } = useRestaurant()

  return (
    <>
      <Navbar />
      <Toast />
      <main className="site-main">
        {view === 'customer' ? <CustomerApp /> : <StaffApp />}
      </main>
      {view === 'customer' && <BottomNav />}
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <RestaurantProvider>
        <AppShell />
      </RestaurantProvider>
    </AuthProvider>
  )
}
