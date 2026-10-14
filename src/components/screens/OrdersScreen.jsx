import { useRestaurant } from '../../context/RestaurantContext'
import { MENU_ITEMS, ORDER_STAGES } from '../../data/menuData'

const STAGE_BADGE = ['badge-blue', 'badge-amber', 'badge-green', 'badge-gray']

export default function OrdersScreen() {
  const { goto, orderItems, orderNumber, subtotal, serviceCharge, total, markFinished, finishedEating } =
    useRestaurant()

  const overallStage = orderItems.length
    ? Math.min(...orderItems.map((l) => l.stage))
    : 0
  const progressPct = orderItems.length
    ? ((overallStage + 1) / ORDER_STAGES.length) * 100
    : 0

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>My Orders</h2>
          <p>Live status for everything on its way to Table 7.</p>
        </div>
      </div>

      <div className="narrow centered">
        {orderItems.length === 0 ? (
          <div className="card empty-state">
            <div className="icon">🧾</div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>No orders yet</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16 }}>
              Head to the menu to add something delicious.
            </div>
            <button className="btn btn-primary" onClick={() => goto('menu')}>Browse Menu</button>
          </div>
        ) : (
          <>
            <div className="card" style={{ marginBottom: 16 }}>
              <div className="section-title" style={{ marginBottom: 12 }}>Order #{orderNumber}</div>
              {orderItems.map((line) => {
                const item = MENU_ITEMS.find((m) => m.id === line.itemId)
                return (
                  <div className="order-item" key={line.lineId}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{item.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>£{item.price.toFixed(2)}</div>
                    </div>
                    <span className={`badge ${STAGE_BADGE[line.stage]}`}>{ORDER_STAGES[line.stage]}</span>
                  </div>
                )
              })}
              <div style={{ borderTop: '1px solid var(--border)', marginTop: 10, paddingTop: 10 }}>
                <div className="progress-row">
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)', minWidth: 90 }}>Overall status</span>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progressPct}%` }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{ORDER_STAGES[overallStage]}</span>
                </div>
              </div>
            </div>

            <div className="order-total">
              <div className="row"><span>Subtotal</span><span>£{subtotal.toFixed(2)}</span></div>
              <div className="row"><span>Service charge (12.5%)</span><span>£{serviceCharge.toFixed(2)}</span></div>
              <div className="row" style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 15, marginTop: 6 }}>
                <span>Total</span><span>£{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              className="btn btn-success btn-full"
              style={{ marginBottom: 10 }}
              onClick={markFinished}
              disabled={finishedEating}
            >
              {finishedEating ? 'Staff notified ✓' : 'Mark as Finished Eating'}
            </button>
            <button className="btn btn-primary btn-full" onClick={() => goto('payment')}>
              Proceed to Payment
            </button>
          </>
        )}
      </div>
    </div>
  )
}
