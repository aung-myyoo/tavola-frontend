import { motion } from 'framer-motion'
import { useRestaurant } from '../../context/RestaurantContext'
import { MENU_ITEMS } from '../../data/menuData'

const METHODS = [
  { id: 'card', icon: '💳', label: 'Card — Tap to Pay', sub: 'Contactless via terminal' },
  { id: 'wallet', icon: '📱', label: 'Apple / Google Pay', sub: 'Mobile wallet' },
  { id: 'cash', icon: '💵', label: 'Cash', sub: 'Pay at counter' },
]

export default function PaymentScreen() {
  const { goto, orderItems, subtotal, serviceCharge, total, payMethod, setPayMethod, confirmPayment, paid } =
    useRestaurant()

  if (paid) {
    return (
      <div className="page">
        <div className="narrow centered" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, paddingTop: 40 }}>
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            style={{ fontSize: 64 }}
          >
            ✅
          </motion.div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>Payment Confirmed</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center' }}>
            £{total.toFixed(2)} paid via {METHODS.find((m) => m.id === payMethod)?.label}.<br />
            Receipt sent to your email — thanks for dining with us!
          </div>
          <button className="btn btn-primary" style={{ marginTop: 10 }} onClick={() => goto('home')}>
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Payment</h2>
          <p>Settle up whenever you're ready.</p>
        </div>
      </div>

      <div className="narrow centered">
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10, fontWeight: 600 }}>
            Bill Summary — Table 7
          </div>
          {orderItems.length === 0 && (
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>No items ordered yet.</div>
          )}
          {orderItems.map((line) => {
            const item = MENU_ITEMS.find((m) => m.id === line.itemId)
            return (
              <div className="row" key={line.lineId}>
                <span>{item.name}</span>
                <span>£{item.price.toFixed(2)}</span>
              </div>
            )
          })}
          <div style={{ borderTop: '1px solid var(--border)', margin: '10px 0' }} />
          <div className="row"><span>Subtotal</span><span>£{subtotal.toFixed(2)}</span></div>
          <div className="row"><span>Service charge (12.5%)</span><span>£{serviceCharge.toFixed(2)}</span></div>
          <div className="row" style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginTop: 8 }}>
            <span>Total</span><span>£{total.toFixed(2)}</span>
          </div>
        </div>

        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Payment method</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
          {METHODS.map((m) => (
            <div key={m.id} className="menu-item" style={{ padding: 12 }} onClick={() => setPayMethod(m.id)}>
              <span style={{ fontSize: 22 }}>{m.icon}</span>
              <div className="item-info">
                <div className="item-name">{m.label}</div>
                <div className="item-desc" style={{ marginBottom: 0 }}>{m.sub}</div>
              </div>
              <div style={{ fontSize: 18 }}>{payMethod === m.id ? '✅' : '⬜'}</div>
            </div>
          ))}
        </div>

        <button
          className="btn btn-primary btn-full"
          onClick={confirmPayment}
          disabled={orderItems.length === 0}
        >
          Confirm Payment · £{total.toFixed(2)}
        </button>
      </div>
    </div>
  )
}
