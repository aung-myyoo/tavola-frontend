import { useRestaurant } from '../context/RestaurantContext'

const NAV_ITEMS = [
  { id: 'home', icon: '🏠', label: 'Home' },
  { id: 'menu', icon: '🍽️', label: 'Menu' },
  { id: 'orders', icon: '📋', label: 'Orders' },
  { id: 'call', icon: '🔔', label: 'Call' },
  { id: 'payment', icon: '💳', label: 'Pay' },
]

export default function BottomNav() {
  const { screen, goto, orderItems } = useRestaurant()
  return (
    <div className="bottom-nav">
      {NAV_ITEMS.map((n) => (
        <button
          key={n.id}
          className={`bn-item ${screen === n.id ? 'active' : ''}`}
          onClick={() => goto(n.id)}
          style={{ position: 'relative' }}
        >
          <span className="bn-icon" style={{ position: 'relative' }}>
            {n.icon}
            {n.id === 'orders' && orderItems.length > 0 && (
              <span className="qty-badge">{orderItems.length}</span>
            )}
          </span>
          <span className="bn-label">{n.label}</span>
        </button>
      ))}
    </div>
  )
}
