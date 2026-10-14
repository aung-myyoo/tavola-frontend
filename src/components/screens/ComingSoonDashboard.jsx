import { useAuth } from '../../context/AuthContext'

const ROLE_LABELS = {
  RECEPTIONIST: 'Receptionist',
  CHEF: 'Chef',
  MANAGER: 'Manager',
  OPERATOR: 'Operator',
  OWNER: 'Owner',
}

const ROLE_BLURB = {
  RECEPTIONIST: 'Reservations, walk-ins and table assignment are coming next.',
  CHEF: "The kitchen display — live ticket queue and 'mark ready' — is coming next.",
  MANAGER: 'Staff management, reporting and floor overview are coming next.',
  OPERATOR: 'Inventory and operations tools are coming next.',
  OWNER: 'Business-wide analytics and controls are coming next.',
}

export default function ComingSoonDashboard() {
  const { staff } = useAuth()

  return (
    <div className="page narrow centered">
      <div className="empty-state">
        <div className="icon">🚧</div>
        <h2 style={{ marginBottom: 8 }}>{ROLE_LABELS[staff.role] ?? staff.role} Dashboard</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
          You're signed in as {staff.name}. {ROLE_BLURB[staff.role] ?? 'This dashboard is coming soon.'}
        </p>
      </div>
    </div>
  )
}
