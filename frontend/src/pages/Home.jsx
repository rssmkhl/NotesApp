import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

function Home() {
  const [notes, setNotes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  const fetchNotes = async (search = '') => {
    try {
      const url = search 
        ? `http://localhost:8080/api/notes/search?title=${encodeURIComponent(search)}`
        : 'http://localhost:8080/api/notes'
      const response = await axios.get(url)
      setNotes(response.data)
    } catch (error) {
      console.error('Error fetching notes:', error)
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  const handleSearch = (e) => {
    const term = e.target.value
    setSearchTerm(term)
    fetchNotes(term)
  }

  const deleteNote = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await axios.delete(`http://localhost:8080/api/notes/${id}`)
        fetchNotes(searchTerm)
      } catch (error) {
        console.error('Error deleting note:', error)
      }
    }
  }

  return (
    <div>
      <div className="header">
        <h1>Notes</h1>
        <Link to="/add" className="btn btn-primary">New Note</Link>
      </div>
      
      <input 
        type="text" 
        className="search-bar"
        placeholder="Search notes..."
        value={searchTerm}
        onChange={handleSearch}
      />

      {notes.length === 0 ? (
        <div className="empty-state">
          <h2>No notes yet</h2>
          <p>Create your first note to get started</p>
        </div>
      ) : (
        <div className="notes-grid">
          {notes.map(note => (
            <div key={note.id} className="note-card">
              <h3>{note.title}</h3>
              <p>{note.content}</p>
              <small>{new Date(note.createdAt).toLocaleString()}</small>
              <div className="note-actions">
                <Link to={`/edit/${note.id}`} className="btn btn-secondary">Edit</Link>
                <button className="btn btn-danger" onClick={() => deleteNote(note.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Home
