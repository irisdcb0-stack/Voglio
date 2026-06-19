export const businessFacts = {
  about:
    'We Coffee Together. VogliO combina tostaduria, consultoria y tienda de cafe para Cochabamba y cuentas B2B.',
  city: 'Cochabamba, Bolivia',
  phone: '70704240',
  instagram: 'https://www.instagram.com/voglio.bo/',
  facebook: 'https://www.facebook.com/profile.php/?id=100076224877447',
  maps: 'https://maps.app.goo.gl/hV4YSsbaHsb7hAmR6',
}

export const navLinks = [
  { label: 'Inicio', to: '/' },
  { label: 'Sobre VogliO', to: '/sobre' },
  { label: 'Servicios', to: '/servicios' },
  { label: 'Direccion', to: '/direccion' },
  { label: 'Tienda', to: '/tienda' },
  { label: 'Agenda', to: '/agenda' },
  { label: 'Registro', to: '/registro' },
  { label: 'Admin', to: '/admin' },
]

export const fallbackStats = [
  { value: '2208', label: 'seguidores en Instagram' },
  { value: '153+', label: 'publicaciones activas de marca' },
  { value: 'B2B', label: 'tueste, consultoria y retail' },
]

export const serviceCards = [
  {
    id: 'tueste',
    title: 'Tueste para cafeterias',
    description:
      'Perfiles para espresso y filtrados, lotes pequenos o recurrentes y consistencia sensorial para barras profesionales.',
    bullets: ['Desarrollo de perfil', 'Control por lote', 'Entrega para cuentas Horeca'],
  },
  {
    id: 'blends',
    title: 'Blends personalizados',
    description:
      'Recetas exclusivas para negocios que necesitan una firma de sabor propia y estable en el tiempo.',
    bullets: ['Blend de marca', 'Version house blend', 'Pruebas y ajustes'],
  },
  {
    id: 'equipamiento',
    title: 'Curaduria de equipamiento',
    description:
      'Venta y seleccion de accesorios Bomber, herramientas de brew y soluciones para abrir o renovar barra.',
    bullets: ['Tamper y pitchers', 'Drippers y balanzas', 'Kits de barra'],
  },
]

export const menuHighlights = [
  'Espresso',
  'Cappuccino',
  'Latte',
  'Macchiato',
  'Flat White',
  'V60',
  'Aeropress',
  'Origami',
  'Chemex',
  'Prensa Francesa',
]

export const valuePillars = [
  {
    title: 'Street coffee identity',
    text: 'Visual fuerte, colaboraciones, empaques con caracter y una energia urbana que conecta con gente joven y cafeterias creativas.',
  },
  {
    title: 'Operacion real',
    text: 'No es una landing informativa: hay catalogo, agenda de servicios, carrito y reservas desde base de datos.',
  },
  {
    title: 'Equipo integral',
    text: 'Tostadores, catadores, consultores y apasionados del cafe para retail y hospitalidad.',
  },
]

export const storeCategories = [
  { label: 'Todo', value: 'all' },
  { label: 'Espresso', value: 'espresso' },
  { label: 'Filtrados', value: 'filter' },
  { label: 'Equipamiento', value: 'equipment' },
]

export const fallbackCatalog = [
  {
    id: 'espresso-house',
    name: 'House Blend Espresso',
    category: 'espresso',
    format: '1 kg',
    price: 24,
    roast: 'Medio',
    notes: 'Chocolate, caramelo y nuez. Pensado para barra con leche y alto flujo.',
    origin: 'Blend VogliO',
    featured: true,
    imageLabel: 'VO Roast',
  },
  {
    id: 'lavado-filter',
    name: 'Gesha Lavado',
    category: 'filter',
    format: '340 g',
    price: 21,
    roast: 'Claro',
    notes: 'Floral, citrico y limpio para V60, Origami y Chemex.',
    origin: 'VogliO Lab',
    featured: true,
    imageLabel: 'Gesha',
  },
  {
    id: 'bomber-pitcher',
    name: 'Pitcher Bomber Pro',
    category: 'equipment',
    format: 'Accesorio',
    price: 32,
    roast: 'Barra',
    notes: 'Pitcher de acero para latte art y servicio de precision.',
    origin: 'MHW-3BOMBER',
    featured: true,
    imageLabel: 'Bomber',
  },
  {
    id: 'espresso-italiano',
    name: 'Classico Italiano',
    category: 'espresso',
    format: '1 kg',
    price: 22,
    roast: 'Medio oscuro',
    notes: 'Cuerpo alto, cacao y final persistente para carta italiana clasica.',
    origin: 'Linea VogliO',
    featured: false,
    imageLabel: 'Classic',
  },
  {
    id: 'tamper-precision',
    name: 'Tamper Precision',
    category: 'equipment',
    format: 'Accesorio',
    price: 41,
    roast: 'Espresso',
    notes: 'Tamper calibrado para mejorar consistencia en extraccion.',
    origin: 'MHW-3BOMBER',
    featured: false,
    imageLabel: 'Tamp',
  },
]

export const fallbackSlots = [
  {
    id: 'slot-1',
    service_name: 'Discovery para tueste',
    slot_date: '2026-06-20',
    slot_time: '10:00',
    duration_minutes: 45,
    format: 'Virtual',
    capacity: 3,
    remaining_spots: 2,
    notes: 'Ideal para cafeterias que quieren lanzar o ajustar house blend.',
  },
  {
    id: 'slot-2',
    service_name: 'Asesoria de barra',
    slot_date: '2026-06-20',
    slot_time: '15:00',
    duration_minutes: 60,
    format: 'Presencial',
    capacity: 4,
    remaining_spots: 1,
    notes: 'Flujo de barra, menu y calibracion de espresso.',
  },
  {
    id: 'slot-3',
    service_name: 'Cata y filtros',
    slot_date: '2026-06-21',
    slot_time: '11:30',
    duration_minutes: 75,
    format: 'Presencial',
    capacity: 6,
    remaining_spots: 4,
    notes: 'Sesion abierta para equipos o clientes finales.',
  },
  {
    id: 'slot-4',
    service_name: 'Revision de equipamiento',
    slot_date: '2026-06-22',
    slot_time: '17:00',
    duration_minutes: 30,
    format: 'Virtual',
    capacity: 5,
    remaining_spots: 3,
    notes: 'Seleccion de Bomber y herramientas para nueva barra.',
  },
]

export const aboutTimeline = [
  'Tostaduria y coffee store con base en Cochabamba.',
  'Marca con identidad visual urbana, colaborativa y experimental.',
  'Participacion en comunidad cafetera y cultura brew.',
  'Foco simultaneo en retail, experiencia de cafeteria y servicios B2B.',
]

export const socialProofGallery = [
  {
    src: new URL('../assets/voglio-images/facebook-profile.png', import.meta.url).href,
    alt: 'Perfil de Facebook de VogliO.',
    caption: 'Facebook con ubicacion y contacto visible',
  },
  {
    src: new URL('../assets/voglio-images/instagram-profile.png', import.meta.url).href,
    alt: 'Perfil de Instagram de voglio.bo.',
    caption: 'Instagram con tienda, clientes y comunidad',
  },
]

export const shopBenefits = [
  'Compra cafe por perfil, metodo o formato.',
  'Agrega accesorios al mismo carrito.',
  'Agenda servicios con calendario y cupos visibles.',
]
