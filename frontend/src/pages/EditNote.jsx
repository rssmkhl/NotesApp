import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import axios from 'axios'

function EditNote() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [pinned, setPinned] = useState(false)
  const [favorite, setFavorite] = useState(false)
  const [archived, setArchived] = useState(false)
  const [loading, setLoading] = useState(true)
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/notes/${id}`)
        const note = response.data
        setTitle(note.title)
        setContent(note.content)
        setPinned(Boolean(note.pinned))
        setFavorite(Boolean(note.favorite))
        setArchived(Boolean(note.archived))
      } catch (error) {
        console.error('Error fetching note:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchNote()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.put(`http://localhost:8080/api/notes/${id}`, { title, content })
      await axios.patch(`http://localhost:8080/api/notes/${id}`, { pinned, favorite, archived })
      navigate('/')
    } catch (error) {
      console.error('Error updating note:', error)
    }
  }

  if (loading) {
    return (
      <div className="page-shell">
        <div className="empty-state">
          <h2>Loading note…</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="page-shell">
      <div className="form-header">
        <div>
          <p className="eyebrow">Edit</p>
          <h1>Edit Note</h1>
        </div>
        <Link to="/" className="btn btn-secondary">Back</Link>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Update the note title"
              required
            />
          </div>
          <div className="form-group">
            <label>Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Update the note content"
              required
            />
          </div>

          <div className="status-grid">
            <label className="toggle-row">
              <input type="checkbox" checked={pinned} onChange={(e) => setPinned(e.target.checked)} />
              <span>Pin note</span>
            </label>
            <label className="toggle-row">
              <input type="checkbox" checked={favorite} onChange={(e) => setFavorite(e.target.checked)} />
              <span>Mark favorite</span>
            </label>
            <label className="toggle-row">
              <input type="checkbox" checked={archived} onChange={(e) => setArchived(e.target.checked)} />
              <span>Archive note</span>
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Update Note</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditNote
