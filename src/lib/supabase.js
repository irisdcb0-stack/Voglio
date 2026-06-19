import { createClient } from '@supabase/supabase-js'

const supabaseUrl = normalizeSupabaseUrl(import.meta.env.VITE_SUPABASE_URL)
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
    })
  : null

function normalizeSupabaseUrl(url) {
  return url?.trim().replace(/\/rest\/v1\/?$/i, '').replace(/\/+$/, '')
}

function ensureSupabase() {
  if (!supabase) {
    throw new Error(
      'Falta configurar Supabase. Agrega VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY para activar datos reales.',
    )
  }
}

function mapCatalogItem(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    format: row.format,
    price: Number(row.price),
    roast: row.roast,
    notes: row.notes,
    origin: row.origin,
    featured: row.featured,
    imageLabel: row.image_label || row.name.slice(0, 8),
  }
}

function mapServiceSlot(row) {
  return {
    id: row.id,
    service_name: row.service_name,
    slot_date: row.slot_date,
    slot_time: row.slot_time,
    duration_minutes: row.duration_minutes,
    format: row.format,
    capacity: row.capacity,
    remaining_spots: row.remaining_spots,
    notes: row.notes,
  }
}

export async function fetchCatalogItems() {
  ensureSupabase()

  const { data, error } = await supabase
    .from('catalog_items')
    .select('id, name, category, format, price, roast, notes, origin, featured, image_label')
    .eq('active', true)
    .order('featured', { ascending: false })
    .order('price', { ascending: true })

  if (error) {
    throw new Error('No se pudo leer el catalogo desde Supabase.')
  }

  return (data || []).map(mapCatalogItem)
}

export async function fetchServiceSlots() {
  ensureSupabase()

  const { data, error } = await supabase
    .from('service_slots')
    .select(
      'id, service_name, slot_date, slot_time, duration_minutes, format, capacity, remaining_spots, notes',
    )
    .eq('active', true)
    .gt('remaining_spots', 0)
    .order('slot_date', { ascending: true })
    .order('slot_time', { ascending: true })

  if (error) {
    throw new Error('No se pudo leer la agenda desde Supabase.')
  }

  return (data || []).map(mapServiceSlot)
}

export async function saveBusinessLead(payload) {
  ensureSupabase()

  const { error } = await supabase.from('business_leads').insert({
    ...payload,
    source: 'website',
  })

  if (error) {
    throw new Error('No se pudo guardar la solicitud comercial en Supabase.')
  }
}

export async function saveCuppingRequest(payload) {
  ensureSupabase()

  const { error } = await supabase.from('cupping_requests').insert({
    ...payload,
    source: 'website',
  })

  if (error) {
    throw new Error('No se pudo guardar la reserva de cata en Supabase.')
  }
}

export async function saveServiceBooking(payload) {
  ensureSupabase()
  ensureSupabase()
  // If no slot_id provided, insert a free-form booking request and return.
  if (!payload.slot_id) {
    const { data, error } = await supabase.from('service_bookings').insert({ ...payload, source: 'website' })
    if (error) {
      throw new Error('No se pudo guardar la reserva en Supabase.')
    }
    return data
  }

  // Insert booking, then decrement remaining_spots on related slot.
  const { data: inserted, error: insertError } = await supabase
    .from('service_bookings')
    .insert({ ...payload, source: 'website' })
    .select('id')
    .single()

  if (insertError) {
    throw new Error('No se pudo guardar la reunion en Supabase.')
  }

  const slotId = payload.slot_id

  // Read current remaining_spots
  const { data: slotRow, error: slotError } = await supabase
    .from('service_slots')
    .select('remaining_spots')
    .eq('id', slotId)
    .single()

  if (slotError || !slotRow) {
    // rollback
    await supabase.from('service_bookings').delete().eq('id', inserted.id)
    throw new Error('No se pudo leer el cupo del horario. Reserva revertida.')
  }

  if (!(slotRow.remaining_spots > 0)) {
    await supabase.from('service_bookings').delete().eq('id', inserted.id)
    throw new Error('El horario no tiene cupos disponibles. Reserva revertida.')
  }

  const nextSpots = Math.max(0, slotRow.remaining_spots - 1)

  const { data: updated, error: updateError } = await supabase
    .from('service_slots')
    .update({ remaining_spots: nextSpots })
    .eq('id', slotId)
    .gt('remaining_spots', 0)
    .select()
    .single()

  if (updateError || !updated) {
    // rollback booking
    await supabase.from('service_bookings').delete().eq('id', inserted.id)
    throw new Error('No se pudo actualizar el cupo del horario. Reserva revertida.')
  }
}

export async function fetchServiceBookings() {
  ensureSupabase()

  const { data, error } = await supabase
    .from('service_bookings')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error('No se pudieron leer las reservas desde Supabase.')
  }

  return data || []
}

export async function fetchOrderRequests() {
  ensureSupabase()

  const { data, error } = await supabase.from('order_requests').select('*').order('created_at', { ascending: false })

  if (error) {
    throw new Error('No se pudieron leer los pedidos desde Supabase.')
  }

  return data || []
}

export async function fetchBusinessLeads() {
  ensureSupabase()

  const { data, error } = await supabase.from('business_leads').select('*').order('created_at', { ascending: false })

  if (error) {
    throw new Error('No se pudieron leer los registros comerciales desde Supabase.')
  }

  return data || []
}

export async function saveOrderRequest(payload) {
  ensureSupabase()

  const { data, error } = await supabase.from('order_requests').insert({
    ...payload,
    source: 'website',
  })

  if (error) {
    const msg = error.message || JSON.stringify(error)
    const status = error.status || error.statusCode || null
    const details = status ? `${msg} (status ${status})` : msg
    console.error('Supabase insert order_requests error:', error)
    throw new Error(`No se pudo guardar el pedido en Supabase. ${details}`)
  }

  return data
}

export async function diagnoseSupabase() {
  const maskKey = (k) => (k ? `${k.slice(0, 4)}...${k.slice(-4)}` : null)
  console.info('Supabase diagnostic: hasSupabaseConfig=', hasSupabaseConfig)
  console.info('Supabase diagnostic: url=', supabaseUrl)
  console.info('Supabase diagnostic: anonKey(mask)=', maskKey(supabaseAnonKey))

  if (!supabase) {
    return { ok: false, message: 'Supabase no configurado (variables ausentes).' }
  }

  try {
    const { data, error, status } = await supabase.from('order_requests').select('id').limit(1)
    if (error) {
      console.error('diagnoseSupabase - query error:', error)
      return { ok: false, status: status || null, error }
    }
    return { ok: true, status: status || 200, sample: data }
  } catch (e) {
    console.error('diagnoseSupabase - unexpected error', e)
    return { ok: false, message: e?.message || String(e) }
  }
}
