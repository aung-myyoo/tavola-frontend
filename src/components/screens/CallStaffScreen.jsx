import { useRestaurant } from '../../context/RestaurantContext'

const OPTIONS = [
  { icon: '🧹', label: 'Clear Table' },
  { icon: '💧', label: 'Refill Water' },
  { icon: '🍽️', label: 'Set Main Plates' },
  { icon: '🧻', label: 'Extra Napkins' },
  { icon: '❓', label: 'Ask a Question' },
  { icon: '⭐', label: 'Special Request' },
]

export default function CallStaffScreen() {
  const { callStaff, requestHistory } = useRestaurant()

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Call Staff</h2>
          <p>What do you need help with?</p>
        </div>
      </div>

      <div className="call-grid">
        {OPTIONS.map((o) => (
          <div key={o.label} className="call-btn" onClick={() => callStaff(o.label)}>
            <span className="call-btn-icon">{o.icon}</span>
            {o.label}
          </div>
        ))}
      </div>

      <div className="narrow">
        <div className="section-title">Request history</div>
        {requestHistory.length === 0 && (
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>No requests yet.</div>
        )}
        {requestHistory.map((r) => (
          <div key={r.id} className={`notif ${r.status === 'done' ? 'success' : 'warning'}`}>
            <div className="notif-title">
              {r.msg} — {r.status === 'done' ? 'Completed' : 'On the way'}
            </div>
            <div className="notif-body">
              {r.status === 'done' ? 'Staff member Alex attended to your table' : 'A staff member has been notified'}
            </div>
            <div className="notif-time">Just now</div>
          </div>
        ))}
      </div>
    </div>
  )
}
