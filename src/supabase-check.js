// Supabase connectivity check without React.
// Usage: open http://localhost:5173/?plainTest=1

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

function el(tag, props = {}, text) {
  const n = document.createElement(tag)
  Object.entries(props).forEach(([k, v]) => n.setAttribute(k, v))
  if (text) n.textContent = text
  return n
}

const container = el('div', { style: 'position:fixed;right:12px;bottom:12px;z-index:9999;max-width:420px;padding:12px;border-radius:10px;background:rgba(6,8,14,0.95);color:#e6eef8;font-family:system-ui,Segoe UI;box-shadow:0 6px 28px rgba(0,0,0,0.6);border:1px solid rgba(255,255,255,0.04)' })
container.appendChild(el('div', {}, 'Comprobación Supabase (sin React)'))
const pre = el('pre', { style: 'white-space:pre-wrap;margin-top:8px;font-size:13px;color:#cfe9ff' })
container.appendChild(pre)
const btn = el('button', { style: 'margin-top:8px;padding:8px 10px;border-radius:8px;border:0;background:#2f9bff;color:white;cursor:pointer' }, 'Probar conexión')
container.appendChild(btn)
document.body.appendChild(container)

function mask(k) { if (!k) return null; return k.slice(0,4) + '…' + k.slice(-4) }

async function run() {
  pre.textContent = ''
  pre.textContent += `VITE_SUPABASE_URL=${url}\nVITE_SUPABASE_ANON_KEY=${mask(anonKey)}\n\n`

  if (!url || !anonKey) {
    pre.textContent += 'Variables faltantes. Asegura .env y reinicia el servidor (npm run dev)'
    return
  }

  try {
    const endpoint = `${url}/rest/v1/order_requests?select=id&limit=1`
    pre.textContent += `GET ${endpoint}\n\n`
    const res = await fetch(endpoint, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        Accept: 'application/json',
      },
    })

    pre.textContent += `Status: ${res.status} ${res.statusText}\n`
    const text = await res.text()
    try { pre.textContent += JSON.stringify(JSON.parse(text), null, 2) } catch { pre.textContent += text }
  } catch (e) {
    pre.textContent += `Error: ${e.message || e}`
  }
}

btn.addEventListener('click', run)

// autocall once
run()
