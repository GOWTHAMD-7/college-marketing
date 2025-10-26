import { motion } from 'framer-motion'
import './Sidebar.css'

type Props = {
  competitors: string[]
  selected: string
  onSelect: (name: string) => void
}

export default function Sidebar({ competitors, selected, onSelect }: Props) {
  return (
    <aside className="sidebar-container">
      <motion.h2
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="sidebar-title"
      >
        Competitor Selector
      </motion.h2>

      <div className="sidebar-selector">
        {competitors.map((c) => (
          <motion.button
            key={c}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(c)}
            className={`sidebar-button ${c === selected ? 'active' : ''}`}
          >
            {c}
          </motion.button>
        ))}
      </div>

      <div className="sidebar-footer">
        <p>Theme: Minimal AI Professional</p>
      </div>
    </aside>
  )
}
