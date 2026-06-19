create table if not exists public.catalog_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in ('espresso', 'filter', 'equipment', 'academy')),
  format text not null,
  price numeric(10, 2) not null default 0,
  roast text not null,
  notes text not null,
  origin text not null,
  image_label text,
  featured boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.business_leads (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  contact_name text not null,
  email text not null,
  phone text,
  business_type text,
  interest_area text not null,
  monthly_volume text,
  message text not null,
  source text not null default 'website',
  created_at timestamptz not null default now()
);

create table if not exists public.cupping_requests (
  id uuid primary key default gen_random_uuid(),
  requester_name text not null,
  requester_email text not null,
  company text,
  preferred_method text not null,
  attendees integer not null default 1,
  requested_date date not null,
  notes text,
  source text not null default 'website',
  created_at timestamptz not null default now()
);

create table if not exists public.service_slots (
  id uuid primary key default gen_random_uuid(),
  service_name text not null,
  slot_date date not null,
  slot_time text not null,
  duration_minutes integer not null default 60,
  format text not null default 'Virtual',
  capacity integer not null default 1,
  remaining_spots integer not null default 1,
  notes text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.service_bookings (
  id uuid primary key default gen_random_uuid(),
  requester_name text not null,
  requester_email text not null,
  company text,
  phone text,
  slot_id uuid references public.service_slots(id),
  requested_date date not null,
  requested_time text not null,
  service_name text not null,
  notes text,
  source text not null default 'website',
  created_at timestamptz not null default now()
);

alter table public.catalog_items enable row level security;
alter table public.business_leads enable row level security;
alter table public.cupping_requests enable row level security;
alter table public.service_slots enable row level security;
alter table public.service_bookings enable row level security;

drop policy if exists "public can read active catalog" on public.catalog_items;
create policy "public can read active catalog"
on public.catalog_items
for select
to anon
using (active = true);

drop policy if exists "public can insert business leads" on public.business_leads;
create policy "public can insert business leads"
on public.business_leads
for insert
to anon
with check (true);

drop policy if exists "public can insert cupping requests" on public.cupping_requests;
create policy "public can insert cupping requests"
on public.cupping_requests
for insert
to anon
with check (true);

drop policy if exists "public can read active service slots" on public.service_slots;
create policy "public can read active service slots"
on public.service_slots
for select
to anon
using (active = true and remaining_spots > 0);

drop policy if exists "public can insert service bookings" on public.service_bookings;
create policy "public can insert service bookings"
on public.service_bookings
for insert
to anon
with check (true);

insert into public.catalog_items (name, category, format, price, roast, notes, origin, image_label, featured)
values
  ('House Blend Espresso', 'espresso', '1 kg', 24, 'Medio', 'Chocolate, caramelo y nuez. Pensado para barra con leche y alto flujo.', 'Blend VogliO', 'VO Roast', true),
  ('Gesha Lavado', 'filter', '340 g', 21, 'Claro', 'Floral, citrico y limpio para V60, Origami y Chemex.', 'VogliO Lab', 'Gesha', true),
  ('Pitcher Bomber Pro', 'equipment', 'Accesorio', 32, 'Barra', 'Pitcher de acero para latte art y servicio de precision.', 'MHW-3BOMBER', 'Bomber', true),
  ('Workshop Brew Like a Pro', 'academy', 'Cupo', 35, 'Educacion', 'Sesion de entrenamiento para metodos filtrados, molienda y receta.', 'VogliO Academy', 'Course', false)
on conflict do nothing;

insert into public.service_slots (
  service_name,
  slot_date,
  slot_time,
  duration_minutes,
  format,
  capacity,
  remaining_spots,
  notes
)
values
  ('Discovery para tueste', '2026-06-20', '10:00', 45, 'Virtual', 3, 2, 'Ideal para cafeterias que quieren lanzar o ajustar house blend.'),
  ('Asesoria de barra', '2026-06-20', '15:00', 60, 'Presencial', 4, 1, 'Flujo de barra, menu y calibracion de espresso.'),
  ('Cata y filtros', '2026-06-21', '11:30', 75, 'Presencial', 6, 4, 'Sesion abierta para equipos o clientes finales.'),
  ('Revision de equipamiento', '2026-06-22', '17:00', 30, 'Virtual', 5, 3, 'Seleccion de Bomber y herramientas para nueva barra.')
on conflict do nothing;
