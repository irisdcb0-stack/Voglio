const BOOKINGS_KEY = 'voglio-local-bookings'
const ORDERS_KEY = 'voglio-local-orders'
const LEADS_KEY = 'voglio-local-leads'

function readList(key) {
  try {
    const raw = localStorage.getItem(key) || '[]'
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export function saveLocalBooking(payload) {
  const list = readList(BOOKINGS_KEY)
  const record = { ...payload, id: `local-${Date.now()}`, created_at: new Date().toISOString() }
  list.push(record)
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(list))
  return record
}

export function saveLocalOrder(payload) {
  const list = readList(ORDERS_KEY)
  const record = { ...payload, id: `local-${Date.now()}`, created_at: new Date().toISOString() }
  list.push(record)
  localStorage.setItem(ORDERS_KEY, JSON.stringify(list))
  return record
}

export function saveLocalLead(payload) {
  const list = readList(LEADS_KEY)
  const record = { ...payload, id: `local-${Date.now()}`, created_at: new Date().toISOString() }
  list.push(record)
  localStorage.setItem(LEADS_KEY, JSON.stringify(list))
  return record
}

export function readLocalBookings() {
  return readList(BOOKINGS_KEY)
}
