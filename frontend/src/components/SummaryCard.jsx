function SummaryCard({ title, value }) {
  return (
    <div className="summary-card">
      <span className="summary-title">{title}</span>
      <strong>{value}</strong>
    </div>
  )
}

export default SummaryCard
