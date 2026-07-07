import { Link } from 'react-router-dom'

const views = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'favorites', label: 'Favorites' },
  { id: 'archive', label: 'Archive' },
  { id: 'trash', label: 'Trash' },
]

function Sidebar({ view, onViewChange, summary }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">📝</div>
        <div>
          <p className="brand-label">NotesApp</p>
          <p className="brand-subtitle">Organize your ideas</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {views.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className={`nav-item ${view === id ? 'active' : ''}`}
            onClick={() => onViewChange(id)}
          >
            <span>{label}</span>
            <span>
              {id === 'dashboard' && summary.total}
              {id === 'favorites' && summary.favorites}
              {id === 'archive' && summary.archived}
              {id === 'trash' && summary.trashed}
            </span>
          </button>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
