import { useMemo, useState } from 'react'
import { useRestaurant } from '../../context/RestaurantContext'
import { CATEGORIES, MENU_ITEMS } from '../../data/menuData'
import ItemModal from '../ItemModal'

export default function MenuScreen() {
  const { goto, orderItems } = useRestaurant()
  const [activeCategory, setActiveCategory] = useState('All')
  const [selected, setSelected] = useState(null)

  const grouped = useMemo(() => {
    const cats = activeCategory === 'All' ? CATEGORIES : [activeCategory]
    return cats.map((cat) => ({
      cat,
      items: MENU_ITEMS.filter((i) => i.category === cat),
    }))
  }, [activeCategory])

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Today's Menu</h2>
          <p>Freshly prepared, table-side in minutes.</p>
        </div>
        <span className="badge badge-accent" style={{ cursor: 'pointer' }} onClick={() => goto('orders')}>
          Cart {orderItems.length}
        </span>
      </div>

      <div className="category-tabs">
        {['All', ...CATEGORIES].map((c) => (
          <button
            key={c}
            className={`category-tab ${activeCategory === c ? 'active' : ''}`}
            onClick={() => setActiveCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {grouped.map(({ cat, items }) => (
        <div className="menu-section" key={cat}>
          <div className="section-title">{cat}</div>
          <div className="card-grid">
            {items.map((item) => (
              <div
                key={item.id}
                className={`menu-item ${!item.available ? 'disabled' : ''}`}
                onClick={() => item.available && setSelected(item)}
              >
                <div className="item-emoji">{item.emoji}</div>
                <div className="item-info">
                  <div className="item-name">{item.name}</div>
                  <div className="item-desc">{item.desc}</div>
                  <div className="item-badges">
                    <span className={`badge ${item.available ? 'badge-green' : 'badge-red'}`} style={{ fontSize: 10 }}>
                      {item.available ? 'Available' : 'Sold Out'}
                    </span>
                    {item.tags.slice(0, 1).map((t) => (
                      <span key={t} className="badge badge-amber" style={{ fontSize: 10 }}>{t}</span>
                    ))}
                  </div>
                </div>
                <div className="item-price">£{item.price.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <ItemModal item={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
