import { motion } from 'framer-motion'
import './SegmentCard.css'

type Props = {
  title: string
  details: Record<string, string | number | string[]>
}

export default function SegmentCard({ title, details }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="segment-card"
    >
      <h3 className="segment-card-title">{title}</h3>
      <div className="segment-card-details">
        {Object.entries(details).map(([k, v]) => (
          <div key={k} className="segment-detail-row">
            <span className="segment-detail-label">{k}</span>
            <span className="segment-detail-value">{Array.isArray(v) ? v.join(', ') : v}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
