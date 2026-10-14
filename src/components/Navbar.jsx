import { useRestaurant } from '../context/RestaurantContext'
import { useAuth } from '../context/AuthContext'
import StaffAvatar from './StaffAvatar'

const NAV_ITEMS = [
  { id: 'home', icon: '🏠', label: 'Home' },
  { id: 'menu', icon: '🍽️', label: 'Menu' },
  { id: 'orders', icon: '📋', label: 'Orders' },
  { id: 'call', icon: '🔔', label: 'Call Staff' },
  { id: 'payment', icon: '💳', label: 'Payment' },
]

export default function Navbar() {
  const { screen, goto, view, setView, orderItems } = useRestaurant()
  const { staff, isAuthenticated, logout } = useAuth()

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand" onClick={() => { setView('customer'); goto('home') }}>
          <span className="brand-mark">🍷</span>
          <span>Tavola</span>
        </div>

        {view === 'customer' && (
          <nav className="nav-links">
            {NAV_ITEMS.map((n) => (
              <button
                key={n.id}
                className={`nav-link ${screen === n.id ? 'active' : ''}`}
                onClick={() => goto(n.id)}
              >
                <span>{n.icon}</span>
                <span>{n.label}</span>
                {n.id === 'orders' && orderItems.length > 0 && (
                  <span className="nav-badge">{orderItems.length}</span>
                )}
              </button>
            ))}
          </nav>
        )}

        <div className="navbar-actions">
          <button
            className={`pill-toggle ${view === 'customer' ? 'active' : ''}`}
            onClick={() => setView('customer')}
          >
            Customer
          </button>
          <button
            className={`pill-toggle ${view === 'staff' ? 'active' : ''}`}
            onClick={() => setView('staff')}
          >
            Staff
          </button>
          {view === 'staff' && isAuthenticated && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 4 }}>
              <StaffAvatar name={staff.name} photoUrl={staff.photoUrl} size={28} />
              <button className="pill-toggle" onClick={logout}>Sign Out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
