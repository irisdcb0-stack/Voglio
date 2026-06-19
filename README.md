# VogliO

SPA en React + JSX para una tostaduria de cafe de especialidad con enfoque comercial real.

## Lo que incluye

- Multipagina con rutas para:
  - Inicio
  - Sobre VogliO
  - Servicios
  - Direccion
  - Tienda
  - Carrito
  - Agenda
- Catalogo filtrable con datos de Supabase
- Carrito persistido en localStorage
- Agenda con dias y horas de servicio
- Reserva de reuniones y formulario B2B
- Estetica oscura inspirada en la presencia real de VogliO

## Stack

- React + Vite + JSX
- `react-router-dom`
- Supabase

## Variables de entorno

Crea un archivo `.env` basado en [.env.example](./.env.example):

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_publica_anon
```

## Tablas esperadas en Supabase

Ejecuta [supabase/schema.sql](./supabase/schema.sql) para crear:

- `catalog_items`
- `business_leads`
- `cupping_requests`
- `service_slots`
- `service_bookings`
- `order_requests`

## Ver el proyecto

Opcion 1:

- Doble clic en [abrir-demo-compilado.bat](./abrir-demo-compilado.bat)

Opcion 2:

- Abrir [dist/index.html](./dist/index.html)

Opcion 3:

```bash
npm install
npm run dev
```

## Despliegue

- Netlify sugerido para entregar link publico
- GitHub Pages tambien es posible
- El proyecto usa `HashRouter`, asi que soporta bien entornos estaticos, Netlify y builds locales desde archivo
