import { Link } from 'react-router-dom'

function NoteCard({ note, view, onDelete, onToggleStatus }) {
  return (
    <article className={`note-card ${note.pinned ? 'note-pinned' : ''}`}>
      <div className="note-meta">
        <h3>{note.title}</h3>
        <div className="note-tags">
          {note.pinned && <span className="tag tag-accent">Pinned</span>}
          {note.favorite && <span className="tag tag-primary">Favorite</span>}
          {note.archived && <span className="tag tag-muted">Archived</span>}
          {note.trashed && <span className="tag tag-muted">Trash</span>}
        </div>
      </div>
      <p>{note.content || 'No description added.'}</p>
      <div className="note-footer">
        <small>Updated {new Date(note.updatedAt || note.createdAt).toLocaleString()}</small>
      </div>
      <div className="note-actions">
        {view === 'trash' ? (
          <>
            <button className="btn btn-secondary" onClick={() => onToggleStatus(note, { trashed: false, archived: false })}>
              Restore
            </button>
            <button className="btn btn-danger" onClick={() => onDelete(note)}>
              Delete
            </button>
          </>
        ) : (
          <> 
            <button className={`btn ${note.pinned ? 'btn-highlight' : 'btn-secondary'}`} onClick={() => onToggleStatus(note, { pinned: !note.pinned })}>
              {note.pinned ? 'Pinned' : 'Pin'}
            </button>
            <button className={`btn ${note.favorite ? 'btn-highlight' : 'btn-secondary'}`} onClick={() => onToggleStatus(note, { favorite: !note.favorite })}>
              Favorite
            </button>
            {view !== 'archive' && (
              <button className={`btn ${note.archived ? 'btn-highlight' : 'btn-secondary'}`} onClick={() => onToggleStatus(note, { archived: !note.archived })}>
                {note.archived ? 'Archived' : 'Archive'}
              </button>
            )}
            <Link to={`/edit/${note.id}`} className="btn btn-secondary">Edit</Link>
            <button className="btn btn-danger" onClick={() => onDelete(note)}>
              {note.trashed ? 'Delete' : 'Trash'}
            </button>
          </>
        )}
      </div>
    </article>
  )
}

export default NoteCard
