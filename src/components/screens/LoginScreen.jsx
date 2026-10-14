import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import StaffAvatar from '../StaffAvatar'

const ROLE_LABELS = {
  RECEPTIONIST: 'Receptionist',
  SERVER: 'Server',
  CHEF: 'Chef',
  MANAGER: 'Manager',
  OPERATOR: 'Operator',
  OWNER: 'Owner',
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫']

export default function LoginScreen() {
  const { roster, rosterError, loadRoster, login } = useAuth()
  const [selected, setSelected] = useState(null)
  const [pin, setPin] = useState('')
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    loadRoster()
  }, [loadRoster])

  const pressKey = (key) => {
    setError(null)
    if (key === '⌫') {
      setPin((p) => p.slice(0, -1))
    } else if (key && pin.length < 6) {
      setPin((p) => p + key)
    }
  }

  const submit = async (pinValue) => {
    setBusy(true)
    setError(null)
    try {
      await login(selected.id, pinValue)
    } catch (err) {
      setError(err.message)
      setPin('')
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => {
    if (selected && pin.length === 4 && !busy) {
      submit(pin)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin])

  if (selected) {
    return (
      <div className="page narrow centered">
        <div className="page-header">
          <div>
            <h2>Enter PIN</h2>
            <p>Signing in as {selected.name} · {ROLE_LABELS[selected.role] ?? selected.role}</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          <StaffAvatar name={selected.name} photoUrl={selected.photoUrl} size={72} />

          <div style={{ display: 'flex', gap: 10 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: i < pin.length ? 'var(--accent)' : 'var(--bg-elevated)',
                  border: '1px solid var(--border-strong)',
                }}
              />
            ))}
          </div>

          {error && <div style={{ color: 'var(--red)', fontSize: 13 }}>{error}</div>}
          {busy && <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Checking…</div>}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, width: '100%', maxWidth: 280 }}>
            {KEYS.map((key, i) => (
              <button
                key={i}
                className="btn"
                disabled={!key || busy}
                style={{ fontSize: 18, padding: '16px 0', visibility: key ? 'visible' : 'hidden' }}
                onClick={() => pressKey(key)}
              >
                {key}
              </button>
            ))}
          </div>

          <button
            className="btn"
            style={{ fontSize: 12 }}
            onClick={() => { setSelected(null); setPin(''); setError(null) }}
          >
            ← Not you? Choose someone else
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Staff Sign In</h2>
          <p>Tap your name to continue.</p>
        </div>
      </div>

      {rosterError && (
        <div className="card" style={{ marginBottom: 20, color: 'var(--red)', fontSize: 13 }}>
          Couldn't load staff list: {rosterError}
        </div>
      )}

      <div className="tile-grid">
        {roster.map((s) => (
          <div key={s.id} className="quick-tile" onClick={() => setSelected(s)}>
            <StaffAvatar name={s.name} photoUrl={s.photoUrl} size={56} />
            <div className="quick-tile-label">{s.name}</div>
            <div className="quick-tile-sub">{ROLE_LABELS[s.role] ?? s.role}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
