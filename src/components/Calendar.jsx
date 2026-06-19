import { useMemo, useState } from 'react'

function getMonthGrid(year, month) {
  const first = new Date(year, month, 1)
  const startDay = first.getDay() // 0..6 (Sun..Sat)
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const weeks = []
  let week = new Array(startDay).fill(null)
  for (let d = 1; d <= daysInMonth; d++) {
    week.push(new Date(year, month, d))
    if (week.length === 7) {
      weeks.push(week)
      week = []
    }
  }
  if (week.length) {
    while (week.length < 7) week.push(null)
    weeks.push(week)
  }
  return weeks
}

export default function Calendar({ groupedSlots = {}, selectedDate, onSelectDate }) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const weeks = useMemo(() => getMonthGrid(viewYear, viewMonth), [viewYear, viewMonth])

  function formatIso(d) {
    if (!d) return null
    return d.toISOString().slice(0, 10)
  }

  function prevMonth() {
    setViewMonth((m) => {
      if (m === 0) {
        setViewYear((y) => y - 1)
        return 11
      }
      return m - 1
    })
  }

  function nextMonth() {
    setViewMonth((m) => {
      if (m === 11) {
        setViewYear((y) => y + 1)
        return 0
      }
      return m + 1
    })
  }

  const weekdays = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa']

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button type="button" onClick={prevMonth} aria-label="Mes anterior">‹</button>
        <strong>
          {new Date(viewYear, viewMonth).toLocaleString(undefined, { month: 'long' })} {viewYear}
        </strong>
        <button type="button" onClick={nextMonth} aria-label="Mes siguiente">›</button>
      </div>
      <table className="calendar-table">
        <thead>
          <tr>
            {weekdays.map((w) => (
              <th key={w}>{w}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, wi) => (
            <tr key={wi}>
              {week.map((day, di) => {
                const iso = formatIso(day)
                const slots = iso ? groupedSlots[iso] || [] : []
                const available = slots.reduce((acc, s) => acc + (s.remaining_spots || 0), 0)
                const isSelected = iso === selectedDate
                const isToday = day && day.toDateString() === today.toDateString()
                const classes = ['calendar-day']
                if (isSelected) classes.push('selected')
                if (isToday) classes.push('today')

                return (
                  <td
                    key={di}
                    className={classes.join(' ')}
                    onClick={() => iso && onSelectDate(iso)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') iso && onSelectDate(iso)
                    }}
                  >
                    <div className="day-number">{day ? day.getDate() : ''}</div>
                    {iso && (
                      <div className="day-meta">
                        {available > 0 ? (
                          <span className="spots">{available} cupos</span>
                        ) : (
                          <span className="no-spots">—</span>
                        )}
                      </div>
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
