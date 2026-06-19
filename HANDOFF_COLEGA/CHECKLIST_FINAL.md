# Checklist Final

## Conexion

- [ ] Pegar `VITE_SUPABASE_URL` en `.env`
- [ ] Pegar `VITE_SUPABASE_ANON_KEY` en `.env`
- [ ] Ejecutar `SUPABASE_SCHEMA.sql`

## Verificacion funcional

- [ ] Tienda lee productos reales
- [ ] Agenda lee horarios reales
- [ ] Reserva guarda en `service_bookings`
- [ ] Formulario comercial guarda en `business_leads`
- [ ] Si se usa cata, revisar `cupping_requests`

## Ajustes opcionales recomendados

- [ ] Hacer que una reserva reduzca cupos tambien en Supabase
- [ ] Mejorar checkout por WhatsApp con resumen automatico
- [ ] Asignar imagen especifica a cada producto
- [ ] Pulir responsive final
- [ ] Revisar textos comerciales

## Publicacion

- [ ] Subir a GitHub
- [ ] Desplegar en Netlify o GitHub Pages
- [ ] Configurar variables de entorno en el hosting
- [ ] Verificar que el link publico funcione

## Validacion tecnica

- [ ] `npm install`
- [ ] `npm run lint`
- [ ] `npm run build`
- [ ] Revisar visualmente `#/tienda`, `#/carrito`, `#/agenda`
