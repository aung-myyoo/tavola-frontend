import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { api, setAuthToken } from '../api/client'

const AuthContext = createContext(null)

const STORAGE_KEY = 'tavola.staffSession'

export function AuthProvider({ children }) {
  const [staff, setStaff] = useState(null)
  const [token, setToken] = useState(null)
  const [roster, setRoster] = useState([])
  const [rosterError, setRosterError] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')
      if (saved?.token && saved?.staff) {
        setAuthToken(saved.token)
        setToken(saved.token)
        setStaff(saved.staff)
      }
    } catch {
      // ignore corrupted session
    }
    setReady(true)
  }, [])

  const loadRoster = useCallback(async () => {
    try {
      const data = await api.get('/api/auth/roster')
      setRoster(data)
      setRosterError(null)
    } catch (err) {
      setRosterError(err.message)
    }
  }, [])

  const login = useCallback(async (staffId, pin) => {
    const res = await api.post('/api/auth/login', { staffId, pin })
    setAuthToken(res.token)
    setToken(res.token)
    setStaff(res.staff)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(res))
    return res.staff
  }, [])

  const logout = useCallback(() => {
    setAuthToken(null)
    setToken(null)
    setStaff(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const updateStaff = useCallback((next) => {
    setStaff(next)
    setToken((currentToken) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: currentToken, staff: next }))
      return currentToken
    })
  }, [])

  const value = {
    staff,
    token,
    isAuthenticated: Boolean(staff && token),
    ready,
    roster,
    rosterError,
    loadRoster,
    login,
    logout,
    updateStaff,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
