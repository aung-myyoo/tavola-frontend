import { AnimatePresence, motion } from 'framer-motion'
import { useRestaurant } from '../context/RestaurantContext'

export default function Toast() {
  const { toast } = useRestaurant()
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.key}
          className="toast"
          initial={{ opacity: 0, y: -16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
          <span>{toast.icon}</span>
          <span>{toast.msg}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
