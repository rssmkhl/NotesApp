import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

function AddNote() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [pinned, setPinned] = useState(false)
  const [favorite, setFavorite] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:8080/api/notes', { title, content, pinned, favorite })
      navigate('/')
    } catch (error) {
      console.error('Error creating note:', error)
    }
  }

  return (
    <div className="page-shell">
      <div className="form-header">
        <div>
          <p className="eyebrow">Create</p>
          <h1>New Note</h1>
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
              placeholder="Write a title for your note"
              required
            />
          </div>
          <div className="form-group">
            <label>Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note content"
              required
            />
          </div>

          <div className="status-grid">
            <label className="toggle-row">
              <input type="checkbox" checked={pinned} onChange={(e) => setPinned(e.target.checked)} />
              <span>Pin this note</span>
            </label>
            <label className="toggle-row">
              <input type="checkbox" checked={favorite} onChange={(e) => setFavorite(e.target.checked)} />
              <span>Mark as favorite</span>
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Save Note</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddNote
