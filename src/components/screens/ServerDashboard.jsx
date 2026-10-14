import { useCallback, useEffect, useState } from 'react'
import { api } from '../../api/client'
import { useAuth } from '../../context/AuthContext'

const TABLE_STATUS_META = {
  EMPTY: { label: 'Empty', badge: 'gray' },
  SEATED: { label: 'Dining', badge: 'blue' },
  UNPAID: { label: 'No Pay', badge: 'red' },
  CALL: { label: 'Call', badge: 'amber' },
  READY: { label: 'Ready', badge: 'green' },
}

const ORDER_STAGE_LABELS = {
  IN_QUEUE: 'In Queue',
  PREPARING: 'Preparing',
  READY: 'Ready',
  SERVED: 'Served',
}

const POLL_MS = 4000

export default function ServerDashboard() {
  const { staff } = useAuth()
  const [tables, setTables] = useState([])
  const [orders, setOrders] = useState([])
  const [requests, setRequests] = useState([])
  const [error, setError] = useState(null)
  const [savingTable, setSavingTable] = useState(null)

  const refresh = useCallback(async () => {
    try {
      const [tableData, orderData, requestData] = await Promise.all([
        api.get('/api/tables'),
        api.get('/api/orders/active'),
        api.get('/api/requests/pending'),
      ])
      setTables(tableData)
      setOrders(orderData)
      setRequests(requestData)
      setError(null)
    } catch (err) {
      setError(err.message)
    }
  }, [])

  useEffect(() => {
    refresh()
    const interval = setInterval(refresh, POLL_MS)
    return () => clearInterval(interval)
  }, [refresh])

  const changeTableStatus = async (number, status) => {
    setSavingTable(number)
    try {
      await api.patch(`/api/tables/${number}/status`, { status })
      await refresh()
    } catch (err) {
      setError(err.message)
    } finally {
      setSavingTable(null)
    }
  }

  const resolveRequest = async (id) => {
    try {
      await api.patch(`/api/requests/${id}/resolve`)
      await refresh()
    } catch (err) {
      setError(err.message)
    }
  }

  const alertCount = tables.filter((t) => t.status === 'UNPAID' || t.status === 'CALL').length

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Server Dashboard</h2>
          <p>Live view across every table in the room, {staff.name}.</p>
        </div>
        <span className="badge badge-green">● Online</span>
      </div>

      {error && (
        <div className="card" style={{ marginBottom: 20, color: 'var(--red)', fontSize: 13 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 24 }}>
        <div className="stat-tile">
          <div className="stat-value">{tables.length}</div>
          <div className="stat-label">Tables</div>
        </div>
        <div className="stat-tile">
          <div className="stat-value" style={{ color: 'var(--red)' }}>{alertCount}</div>
          <div className="stat-label">Alerts</div>
        </div>
        <div className="stat-tile">
          <div className="stat-value" style={{ color: 'var(--blue)' }}>{orders.length}</div>
          <div className="stat-label">Active Orders</div>
        </div>
      </div>

      <div className="staff-grid">
        <div>
          <div className="section-title">Live alerts</div>
          {requests.length === 0 ? (
            <div className="card" style={{ fontSize: 12, color: 'var(--text-secondary)', textAlign: 'center' }}>
              No pending requests.
            </div>
          ) : (
            requests.map((r) => (
              <div className="notif urgent" key={r.id}>
                <div className="notif-title">Table {r.tableNumber} — Call staff request</div>
                <div className="notif-body">Guest requests: {r.message}</div>
                <div style={{ marginTop: 8 }}>
                  <button
                    className="btn"
                    style={{ fontSize: 12, padding: '5px 12px' }}
                    onClick={() => resolveRequest(r.id)}
                  >
                    Resolve
                  </button>
                </div>
              </div>
            ))
          )}

          {tables.filter((t) => t.status === 'UNPAID').map((t) => (
            <div className="notif urgent" key={`unpaid-${t.number}`}>
              <div className="notif-title">Table {t.number} — Awaiting payment</div>
              <div className="notif-body">Guests haven't paid yet.</div>
            </div>
          ))}
        </div>

        <div>
          <div className="section-title">Table status</div>
          <div className="table-grid">
            {tables.map((t) => {
              const meta = TABLE_STATUS_META[t.status] ?? TABLE_STATUS_META.EMPTY
              return (
                <div key={t.number} className="table-tile">
                  <div style={{ fontSize: 14, fontWeight: 600 }}>T{t.number}</div>
                  <span className={`badge badge-${meta.badge}`} style={{ fontSize: 10, padding: '2px 6px' }}>
                    {meta.label}
                  </span>
                  <select
                    value={t.status}
                    disabled={savingTable === t.number}
                    onChange={(e) => changeTableStatus(t.number, e.target.value)}
                    style={{
                      marginTop: 4,
                      fontSize: 10,
                      background: 'var(--bg-elevated)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border)',
                      borderRadius: 6,
                      padding: '2px 4px',
                    }}
                  >
                    {Object.keys(TABLE_STATUS_META).map((s) => (
                      <option key={s} value={s}>{TABLE_STATUS_META[s].label}</option>
                    ))}
                  </select>
                </div>
              )
            })}
          </div>

          <div className="section-title">Kitchen orders</div>
          {orders.length === 0 ? (
            <div className="card" style={{ fontSize: 12, color: 'var(--text-secondary)', textAlign: 'center' }}>
              No active kitchen orders.
            </div>
          ) : (
            orders.map((order) => (
              <div className="card" key={order.id} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontWeight: 600 }}>Table {order.tableNumber} · #{order.orderNumber}</span>
                  <span className="badge badge-amber">{order.items.length} item{order.items.length === 1 ? '' : 's'}</span>
                </div>
                {order.items.map((line) => (
                  <div className="row" key={line.lineId}>
                    <span>{line.name}</span>
                    <span>{ORDER_STAGE_LABELS[line.stage] ?? line.stage}</span>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
