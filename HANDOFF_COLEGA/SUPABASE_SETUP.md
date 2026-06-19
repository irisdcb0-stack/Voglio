# Supabase Setup

## 1. Sacar credenciales

Dentro del proyecto de Supabase:

1. Ir a `Project Settings`
2. Ir a `API`
3. Copiar:
   - `Project URL`
   - `anon public key`

## 2. Pegar en el proyecto

Abrir el archivo `.env` del proyecto raiz y completar:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_publica_anon
```

Si el colega prefiere, puede copiar primero `ENV_TEMPLATE.txt`.

## 3. Crear tablas

1. Abrir `SQL Editor` en Supabase
2. Crear una nueva query
3. Copiar el contenido completo de `SUPABASE_SCHEMA.sql`
4. Ejecutarlo

## 4. Tablas esperadas

- `catalog_items`
- `business_leads`
- `cupping_requests`
- `service_slots`
- `service_bookings`

## 5. Que usa el frontend

### Lectura

- `catalog_items`
- `service_slots`

### Escritura

- `business_leads`
- `service_bookings`
- `cupping_requests`

## 6. Archivo del cliente Supabase

La logica de conexion esta en:

- `src/lib/supabase.js`

## 7. Verificacion minima

Despues de conectar:

1. Ejecutar `npm run dev`
2. Ir a `#/tienda`
3. Verificar si el catalogo se lee desde Supabase
4. Ir a `#/agenda`
5. Verificar si dias y horas salen desde `service_slots`
6. Probar una reserva
7. Revisar en Supabase si se inserto en `service_bookings`
