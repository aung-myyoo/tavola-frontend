import { AnimatePresence, motion } from 'framer-motion'
import { useRestaurant } from '../context/RestaurantContext'

export default function ItemModal({ item, onClose }) {
  const { addToOrder } = useRestaurant()

  const handleAdd = () => {
    addToOrder(item.id)
    onClose()
  }

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="modal"
            onClick={(e) => e.stopPropagation()}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          >
            <div className="modal-handle" />
            <div style={{ fontSize: 60, textAlign: 'center', marginBottom: 12 }}>{item.emoji}</div>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{item.name}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent)', marginBottom: 10 }}>
              £{item.price.toFixed(2)}
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 14 }}>
              {item.desc}
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
              {item.tags.map((t) => (
                <span key={t} className="chip">{t}</span>
              ))}
            </div>
            <div className="card" style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Allergens</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {item.allergens}
              </div>
            </div>
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Spice level</div>
              <div style={{ fontSize: 20 }}>
                {[0, 1, 2].map((i) => (
                  <span key={i} style={{ opacity: i < item.spice ? 1 : 0.2 }}>🌶️</span>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-full" onClick={onClose}>Cancel</button>
              <button className="btn btn-primary btn-full" onClick={handleAdd}>Add to Order</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
