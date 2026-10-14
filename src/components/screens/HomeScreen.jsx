import { useRestaurant } from '../../context/RestaurantContext'
import { MENU_ITEMS, ORDER_STAGES } from '../../data/menuData'

const TILES = [
  { id: 'menu', icon: '🍽️', label: 'Menu', sub: 'Order food' },
  { id: 'orders', icon: '📋', label: 'My Orders', sub: 'View status' },
  { id: 'call', icon: '🔔', label: 'Call Staff', sub: 'Request help' },
  { id: 'payment', icon: '💳', label: 'Payment', sub: 'Pay bill' },
]

export default function HomeScreen() {
  const { goto, orderItems, servedNotifs } = useRestaurant()

  const active = orderItems.filter((l) => l.stage < ORDER_STAGES.length - 1)

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Table 7 — Dine In</h2>
          <p>Everything you need for tonight, in one place.</p>
        </div>
        <span className="badge badge-green">Seated</span>
      </div>

      <div className="hero-banner">
        <div>
          <div className="hero-label">Your table</div>
          <div className="hero-table">Table 7</div>
        </div>
        <div className="hero-meta">
          <div>2 guests · Seated 7:12 PM</div>
          <div>Server: Alex</div>
        </div>
      </div>

      <div className="tile-grid">
        {TILES.map((t) => (
          <div key={t.id} className="quick-tile" onClick={() => goto(t.id)}>
            <span className="quick-tile-icon">{t.icon}</span>
            <span className="quick-tile-label">{t.label}</span>
            <span className="quick-tile-sub">{t.sub}</span>
          </div>
        ))}
      </div>

      <div className="section-title">Order status</div>
      {active.length === 0 && servedNotifs.length === 0 && (
        <div className="card" style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13 }}>
          No active orders yet — browse the menu to get started.
        </div>
      )}
      {active.map((line) => {
        const item = MENU_ITEMS.find((m) => m.id === line.itemId)
        return (
          <div key={line.lineId} className={`notif ${line.stage === 0 ? '' : 'warning'}`}>
            <div className="notif-title">{item?.name} — {ORDER_STAGES[line.stage]}</div>
            <div className="notif-body">Your order is being prepared</div>
          </div>
        )
      })}
      {servedNotifs.slice(0, 3).map((n) => (
        <div key={n.id} className="notif success">
          <div className="notif-title">{n.title}</div>
          <div className="notif-body">{n.body}</div>
          <div className="notif-time">Just now</div>
        </div>
      ))}
    </div>
  )
}
