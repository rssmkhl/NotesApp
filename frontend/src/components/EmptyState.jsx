import { Link } from 'react-router-dom'

function EmptyState({ title, description, actionLabel, actionUrl }) {
  return (
    <div className="empty-state empty-large">
      <div className="empty-graphic">📌</div>
      <h2>{title}</h2>
      <p>{description}</p>
      <Link to={actionUrl} className="btn btn-primary">{actionLabel}</Link>
    </div>
  )
}

export default EmptyState
