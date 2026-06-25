import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import axios from 'axios'

function EditNote() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/notes/${id}`)
        setTitle(response.data.title)
        setContent(response.data.content)
      } catch (error) {
        console.error('Error fetching note:', error)
      }
    }
    fetchNote()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.put(`http://localhost:8080/api/notes/${id}`, { title, content })
      navigate('/')
    } catch (error) {
      console.error('Error updating note:', error)
    }
  }

  return (
    <div>
      <div className="header">
        <h1>Edit Note</h1>
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
              required
            />
          </div>
          <div className="form-group">
            <label>Content</label>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Update</button>
        </form>
      </div>
    </div>
  )
}

export default EditNote
