import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { MENU_ITEMS, ORDER_STAGES, SERVICE_CHARGE_RATE, TABLE_DATA } from '../data/menuData'

const RestaurantContext = createContext(null)

let orderCounter = 42
let requestCounter = 0

export function RestaurantProvider({ children }) {
  const [screen, setScreen] = useState('home')
  const [view, setView] = useState('customer') // 'customer' | 'staff'
  const [orderItems, setOrderItems] = useState([]) // { lineId, itemId, addedAt, stage }
  const [servedNotifs, setServedNotifs] = useState([])
  const [requestHistory, setRequestHistory] = useState([])
  const [tables, setTables] = useState(TABLE_DATA)
  const [payMethod, setPayMethod] = useState(null)
  const [paid, setPaid] = useState(false)
  const [toast, setToast] = useState(null)
  const [finishedEating, setFinishedEating] = useState(false)
  const toastTimer = useRef(null)

  const showToast = useCallback((icon, msg) => {
    setToast({ icon, msg, key: Date.now() })
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 3200)
  }, [])

  const goto = useCallback((id) => setScreen(id), [])

  const addToOrder = useCallback(
    (itemId) => {
      const item = MENU_ITEMS.find((m) => m.id === itemId)
      if (!item) return
      const lineId = `${itemId}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
      setOrderItems((prev) => [...prev, { lineId, itemId, addedAt: Date.now(), stage: 0 }])
      showToast('🛒', `${item.name} added to order!`)
    },
    [showToast]
  )

  // Live progression: each order line advances through ORDER_STAGES over time.
  useEffect(() => {
    const interval = setInterval(() => {
      setOrderItems((prev) => {
        let changed = false
        const next = prev.map((line) => {
          if (line.stage >= ORDER_STAGES.length - 1) return line
          const elapsed = Date.now() - line.addedAt
          const targetStage = Math.min(
            ORDER_STAGES.length - 1,
            Math.floor(elapsed / 7000)
          )
          if (targetStage !== line.stage) {
            changed = true
            const item = MENU_ITEMS.find((m) => m.id === line.itemId)
            if (targetStage === ORDER_STAGES.length - 1) {
              setServedNotifs((n) => [
                { id: line.lineId, name: item.name, type: 'success', title: `${item.name} — Ready to serve!`, body: `Heading to your table now`, time: Date.now() },
                ...n,
              ])
            }
            return { ...line, stage: targetStage }
          }
          return line
        })
        return changed ? next : prev
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const callStaff = useCallback(
    (msg) => {
      requestCounter += 1
      setRequestHistory((prev) => [
        { id: requestCounter, msg, status: 'pending', time: Date.now() },
        ...prev,
      ])
      showToast('🔔', `Staff notified: ${msg}`)
      const id = requestCounter
      setTimeout(() => {
        setRequestHistory((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: 'done' } : r))
        )
      }, 6000)
    },
    [showToast]
  )

  const markFinished = useCallback(() => {
    setFinishedEating(true)
    showToast('✅', 'Staff notified — thank you for dining with us!')
    setTimeout(() => showToast('🍽️', 'Table turnover alert sent to staff'), 2600)
  }, [showToast])

  const confirmPayment = useCallback(() => {
    if (!payMethod) {
      showToast('⚠️', 'Choose a payment method first')
      return
    }
    setPaid(true)
    showToast('💳', 'Payment confirmed! Receipt sent to your email.')
  }, [payMethod, showToast])

  const orderNumber = `T7-${orderCounter}`

  const subtotal = orderItems.reduce((sum, line) => {
    const item = MENU_ITEMS.find((m) => m.id === line.itemId)
    return sum + (item ? item.price : 0)
  }, 0)
  const serviceCharge = subtotal * SERVICE_CHARGE_RATE
  const total = subtotal + serviceCharge

  const acknowledgeTable = useCallback(
    (n, message) => {
      showToast('🪑', message)
    },
    [showToast]
  )

  const setTableStatus = useCallback((n, status) => {
    setTables((prev) => prev.map((t) => (t.n === n ? { ...t, status } : t)))
  }, [])

  const value = {
    screen,
    goto,
    view,
    setView,
    orderItems,
    addToOrder,
    servedNotifs,
    requestHistory,
    callStaff,
    tables,
    setTableStatus,
    acknowledgeTable,
    payMethod,
    setPayMethod,
    paid,
    confirmPayment,
    toast,
    showToast,
    finishedEating,
    markFinished,
    orderNumber,
    subtotal,
    serviceCharge,
    total,
  }

  return <RestaurantContext.Provider value={value}>{children}</RestaurantContext.Provider>
}

export function useRestaurant() {
  const ctx = useContext(RestaurantContext)
  if (!ctx) throw new Error('useRestaurant must be used within RestaurantProvider')
  return ctx
}
