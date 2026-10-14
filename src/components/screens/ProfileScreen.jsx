import { useRef, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../api/client'
import StaffAvatar from '../StaffAvatar'

const ROLE_LABELS = {
  RECEPTIONIST: 'Receptionist',
  SERVER: 'Server',
  CHEF: 'Chef',
  MANAGER: 'Manager',
  OPERATOR: 'Operator',
  OWNER: 'Owner',
}

export default function ProfileScreen() {
  const { staff, updateStaff, logout } = useAuth()
  const fileInput = useRef(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  const pickPhoto = () => fileInput.current?.click()

  const onFileChosen = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setBusy(true)
    setError(null)
    try {
      const updated = await api.upload(`/api/staff/${staff.id}/photo`, file)
      updateStaff(updated)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const removePhoto = async () => {
    setBusy(true)
    setError(null)
    try {
      const updated = await api.del(`/api/staff/${staff.id}/photo`)
      updateStaff(updated)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page narrow centered">
      <div className="page-header">
        <div>
          <h2>My Profile</h2>
          <p>Update your photo and see your account details.</p>
        </div>
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: 28 }}>
        <StaffAvatar name={staff.name} photoUrl={staff.photoUrl} size={96} />

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{staff.name}</div>
          <span className="badge badge-accent" style={{ marginTop: 6 }}>
            {ROLE_LABELS[staff.role] ?? staff.role}
          </span>
        </div>

        {error && <div style={{ color: 'var(--red)', fontSize: 13 }}>{error}</div>}

        <input
          ref={fileInput}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          style={{ display: 'none' }}
          onChange={onFileChosen}
        />

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button className="btn btn-primary" disabled={busy} onClick={pickPhoto}>
            {staff.photoUrl ? 'Change Photo' : 'Upload Photo'}
          </button>
          {staff.photoUrl && (
            <button className="btn btn-danger" disabled={busy} onClick={removePhoto}>
              Remove Photo
            </button>
          )}
        </div>
      </div>

      <button className="btn btn-full" style={{ marginTop: 20 }} onClick={logout}>
        Sign Out
      </button>
    </div>
  )
}
