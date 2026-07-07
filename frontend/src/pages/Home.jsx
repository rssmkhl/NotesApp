import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Sidebar from '../components/Sidebar'
import NoteCard from '../components/NoteCard'
import SummaryCard from '../components/SummaryCard'
import EmptyState from '../components/EmptyState'

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
]

function Home() {
  const [notes, setNotes] = useState([])
  const [summary, setSummary] = useState({ total: 0, pinned: 0, favorites: 0, archived: 0, trashed: 0 })
  const [searchTerm, setSearchTerm] = useState('')
  const [view, setView] = useState('dashboard')
  const [sort, setSort] = useState('newest')
  const [loading, setLoading] = useState(false)

  const fetchSummary = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/notes/summary')
      setSummary(response.data)
    } catch (error) {
      console.error('Error fetching summary:', error)
    }
  }

  const fetchNotes = async () => {
    setLoading(true)
    try {
      const response = await axios.get('http://localhost:8080/api/notes', {
        params: {
          view: view === 'dashboard' ? undefined : view,
          search: searchTerm,
          sort,
        },
      })
      setNotes(response.data)
    } catch (error) {
      console.error('Error fetching notes:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSummary()
  }, [])

  useEffect(() => {
    fetchNotes()
  }, [view, searchTerm, sort])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleDelete = async (note) => {
    const message = note.trashed
      ? 'Permanently delete this note?'
      : 'Move this note to trash?'

    if (!window.confirm(message)) {
      return
    }

    try {
      await axios.delete(`http://localhost:8080/api/notes/${note.id}`)
      await fetchSummary()
      fetchNotes()
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }

  const handleStatusUpdate = async (note, statusUpdate) => {
    try {
      await axios.patch(`http://localhost:8080/api/notes/${note.id}`, statusUpdate)
      await fetchSummary()
      fetchNotes()
    } catch (error) {
      console.error('Error updating note status:', error)
    }
  }

  const pageTitle = view === 'dashboard' ? 'Dashboard' : view.charAt(0).toUpperCase() + view.slice(1)
  const emptyMessage = view === 'trash' ? 'Your trash is empty.' : 'Create your first note to get started.'

  return (
    <div className="app-shell">
      <Sidebar view={view} onViewChange={setView} summary={summary} />

      <main className="main-content">
        <div className="content-heading">
          <div>
            <p className="eyebrow">{pageTitle}</p>
            <h1>{pageTitle}</h1>
          </div>
          <div className="top-actions">
            <button className="btn btn-secondary" onClick={() => { fetchSummary(); fetchNotes() }}>
              Refresh
            </button>
            <Link to="/add" className="btn btn-primary">New Note</Link>
          </div>
        </div>

        <div className="action-bar">
          <div className="search-wrapper">
            <input
              type="text"
              className="search-bar"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div className="sort-wrapper">
            <label htmlFor="sort">Sort</label>
            <select id="sort" value={sort} onChange={(e) => setSort(e.target.value)}>
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="summary-grid">
          <SummaryCard title="Total Notes" value={summary.total} />
          <SummaryCard title="Pinned" value={summary.pinned} />
          <SummaryCard title="Favorites" value={summary.favorites} />
          <SummaryCard title="Archived" value={summary.archived} />
        </div>

        {loading ? (
          <EmptyState title="Loading notes…" description="Please wait while we load your notes." actionLabel="Refresh" actionUrl="/" />
        ) : notes.length === 0 ? (
          <EmptyState title="No notes here" description={emptyMessage} actionLabel="Create Note" actionUrl="/add" />
        ) : (
          <div className="notes-grid">
            {notes.map((note) => (
              <NoteCard key={note.id} note={note} view={view} onDelete={handleDelete} onToggleStatus={handleStatusUpdate} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default Home
