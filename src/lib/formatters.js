export const cartStorageKey = 'voglio-cart'

export function formatMoney(value) {
  return new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatDateLabel(value) {
  return new Intl.DateTimeFormat('es-BO', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(new Date(`${value}T00:00:00`))
}

export function formatTimeRange(slot) {
  const [hours, minutes] = slot.slot_time.split(':').map(Number)
  const total = hours * 60 + minutes + slot.duration_minutes
  const endHours = `${Math.floor(total / 60)}`.padStart(2, '0')
  const endMinutes = `${total % 60}`.padStart(2, '0')

  return `${slot.slot_time} - ${endHours}:${endMinutes}`
}

export function resolveProductImage(product) {
  if (product.origin === 'MHW-3BOMBER') {
    return new URL('../assets/web-captures/bomber-tamper-live.png', import.meta.url).href
  }

  if (product.category === 'equipment') {
    return new URL('../assets/web-captures/bomber-espresso-tools-live.png', import.meta.url).href
  }

  return new URL('../assets/voglio-images/packaging-1.png', import.meta.url).href
}

export function readStoredCart() {
  try {
    const storedValue = localStorage.getItem(cartStorageKey)
    return storedValue ? JSON.parse(storedValue) : []
  } catch {
    return []
  }
}

export function groupSlotsByDay(slots) {
  return slots.reduce((accumulator, slot) => {
    const currentGroup = accumulator[slot.slot_date] || []
    currentGroup.push(slot)
    accumulator[slot.slot_date] = currentGroup
    return accumulator
  }, {})
}
