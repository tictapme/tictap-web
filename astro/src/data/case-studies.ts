export type CaseStudy = {
  slug: string;
  slugEn: string;
  client: string;
  sector: string;
  sectorEn: string;
  tag: string;
  tagEn: string;
  image?: string;
  imageAlt?: string;
  imageAltEn?: string;
  metric?: { n: string; u: string; uEn: string };
  titleEs: string;
  titleEn: string;
  leadEs: string;
  leadEn: string;
  quoteEs: string;
  quoteEn: string;
  featured?: boolean;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: '/casos-de-exito/yessss-electrical-stock/',
    slugEn: '/en/sucess-stories/yesss-electrical-stock/',
    client: 'YESSS Electrical',
    sector: 'distribución',
    sectorEn: 'distribution',
    tag: 'Distribución',
    tagEn: 'Distribution',
    image: '/wp-content/uploads/2026/06/flota-yesss-electrical-light-blue.webp',
    imageAlt: 'Flota YESSS Electrical',
    imageAltEn: 'YESSS Electrical fleet',
    titleEs: 'Control de stock para instaladores y mantenedores sin instalar apps',
    titleEn: 'Stock control for installers and maintenance teams with no app required',
    leadEs: 'El distribuidor eléctrico ofrece a sus clientes profesionales trazabilidad de material en almacenes, furgonetas y puntos de trabajo mediante QR/NFC, diferenciándose de la competencia con un servicio de valor añadido.',
    leadEn: 'The electrical distributor offers professional customers full material traceability across warehouses, vans and job sites via QR/NFC — a value-added service that sets them apart from competitors.',
    quoteEs: '«Trazabilidad de material en almacenes, furgonetas y puntos de trabajo como servicio de valor añadido.»',
    quoteEn: '"Material traceability across warehouses, vans and job sites as a value-added service."',
    featured: true,
  },
  {
    slug: '/casos-de-exito/trazabilidad-de-grupos-electrogenos-para-dagartech/',
    slugEn: '/en/sucess-stories/dagartech/',
    client: 'Dagartech',
    sector: 'energía',
    sectorEn: 'energy',
    tag: 'Energía',
    tagEn: 'Energy',
    image: '/wp-content/uploads/2023/07/dagartech-generador.webp',
    imageAlt: 'Generador Dagartech con etiqueta NFC',
    imageAltEn: 'Dagartech generator with NFC tag',
    metric: { n: '+7.000', u: 'unidades de alquiler controladas', uEn: 'rental units tracked' },
    titleEs: 'Cómo Dagartech traza 7.000 grupos electrógenos con una etiqueta del tamaño de una moneda',
    titleEn: 'How Dagartech tracks 7,000 generators with a coin-sized tag',
    leadEs: 'Una compañía líder en fabricación, venta y alquiler de generadores pasó de gestionar su flota con documentación dispersa a controlar 2.500 familias de equipos y 7.000 unidades de alquiler desde una sola pantalla.',
    leadEn: 'A leading generator manufacturer moved from scattered documentation to controlling 2,500 equipment families and 7,000 rental units from a single screen.',
    quoteEs: '«De documentación dispersa a controlar 2.500 familias de equipos y 7.000 unidades de alquiler desde una sola pantalla.»',
    quoteEn: '"From scattered docs to controlling 2,500 equipment families and 7,000 rental units from a single screen."',
    featured: true,
  },
  {
    slug: '/casos-de-exito/control-y-mantenimiento-de-instalaciones-de-proteccion-contra-incendios-para-el-grupo-damm/',
    slugEn: '/en/sucess-stories/damm-group/',
    client: 'Damm Group',
    sector: 'industria',
    sectorEn: 'industry',
    tag: 'Industria',
    tagEn: 'Industry',
    image: '/wp-content/uploads/2023/07/damm-extintor.webp',
    imageAlt: 'Extintor Damm con etiqueta TicTAP',
    imageAltEn: 'Damm fire extinguisher with TicTAP tag',
    featured: true,
    titleEs: 'Control y mantenimiento de instalaciones de protección contra incendios',
    titleEn: 'Control and maintenance of fire protection installations',
    leadEs: 'Auditorías PCI pasadas a la primera, sin recopilar papeles a última hora: toda la documentación de los equipos contra incendios centralizada y al día.',
    leadEn: 'Fire audits passed first time, without last-minute paperwork scrambles: all fire equipment documentation centralised and up to date.',
    quoteEs: '«Auditorías PCI pasadas a la primera, sin recopilar papeles a última hora.»',
    quoteEn: '"Fire audits passed first time, no last-minute scramble for paperwork."',
  },
  {
    slug: '/casos-de-exito/unificacion-y-aumento-de-eficiencia-en-mantenimiento-para-delgado-instalaciones/',
    slugEn: '/en/sucess-stories/delgado-instal·lacions/',
    client: 'Delgado Instal·lacions',
    sector: 'industria',
    sectorEn: 'industry',
    tag: 'Industria',
    tagEn: 'Industry',
    image: '/wp-content/uploads/2023/07/ImatgeDELGADO1-2-1024x1024.png',
    imageAlt: 'Técnico de Delgado Instal·lacions con etiqueta TicTAP',
    imageAltEn: 'Delgado Instal·lacions technician with TicTAP tag',
    titleEs: 'Unificación y aumento de eficiencia en el mantenimiento de instalaciones',
    titleEn: 'Unified and more efficient facility maintenance',
    leadEs: 'Un solo sistema para todas las plantas y un solo flujo de órdenes de trabajo: el equipo de mantenimiento dejó atrás las herramientas dispersas.',
    leadEn: 'One system for all sites and one work-order flow: the maintenance team left scattered tools behind.',
    quoteEs: '«Un solo sistema para todas las plantas, un solo flujo de órdenes de trabajo.»',
    quoteEn: '"One system for all sites, one work-order flow."',
    featured: true,
  },
  {
    slug: '/casos-de-exito/trazabilidad-del-material-rodante-de-trenes-tramvias-y-coches-para-alstom/',
    slugEn: '/en/sucess-stories/alstom-eng/',
    client: 'Alstom',
    sector: 'ferroviario',
    sectorEn: 'railway',
    tag: 'Ferroviario',
    tagEn: 'Railway',
    image: '/wp-content/uploads/2023/07/ImatgeALSTOM1-768x768.png',
    imageAlt: 'Material rodante Alstom con etiqueta TicTAP',
    imageAltEn: 'Alstom rolling stock with TicTAP tag',
    featured: true,
    titleEs: 'Trazabilidad del material rodante de trenes, tranvías y coches',
    titleEn: 'Rolling stock traceability for trains, trams and coaches',
    leadEs: 'Material distribuido en cuatro países, inventariado en un solo sitio: cada componente del material rodante localizable y con su historial accesible.',
    leadEn: 'Assets spread across four countries, inventoried in one place: every rolling-stock component locatable with its full history on hand.',
    quoteEs: '«Material distribuido en cuatro países, inventariado en un solo sitio.»',
    quoteEn: '"Assets across four countries, inventoried in one place."',
  },
  {
    slug: '/casos-de-exito/trazabilidad-y-gestion-eficiente-de-tag-carretillas-elevadoras/',
    slugEn: '/en/sucess-stories/tag-carretillas-eng/',
    client: 'Cliente · Alquiler',
    sector: 'logística',
    sectorEn: 'logistics',
    tag: 'Logística',
    tagEn: 'Logistics',
    image: '/wp-content/uploads/2023/06/Imatge-TAG-2-1024x1024.png',
    imageAlt: 'Carretilla elevadora con etiqueta TAG TicTAP',
    imageAltEn: 'Forklift with TicTAP TAG label',
    featured: true,
    titleEs: 'Trazabilidad y gestión eficiente del alquiler de carretillas elevadoras',
    titleEn: 'Efficient traceability and management of forklift rentals',
    leadEs: 'Cada cliente sabe qué equipo tiene, en qué estado y cuándo toca revisión.',
    leadEn: 'Every customer knows which equipment they have, its condition, and when the next inspection is due.',
    quoteEs: '«Cada cliente sabe qué equipo tiene, en qué estado y cuándo toca revisión.»',
    quoteEn: '"Every customer knows which equipment they have, its condition, and when the next check is due."',
  },
  {
    slug: '/casos-de-exito/trazabilidad-de-amortiguadores-de-ferrocarril-koni-y-optimizacion-del-reporte-de-incidentes/',
    slugEn: '/en/sucess-stories/koni-eng/',
    client: 'KONI',
    sector: 'ferroviario',
    sectorEn: 'railway',
    tag: 'Ferroviario',
    tagEn: 'Railway',
    image: '/wp-content/uploads/2023/07/ImatgeKONI-1.png',
    imageAlt: 'Amortiguador ferroviario KONI con etiqueta TicTAP',
    imageAltEn: 'KONI railway shock absorber with TicTAP tag',
    featured: true,
    titleEs: 'Trazabilidad de amortiguadores de ferrocarril y optimización del reporte de incidentes',
    titleEn: 'Railway shock absorber traceability and incident reporting optimisation',
    leadEs: 'Cada amortiguador localizado, con su historial de incidentes accesible desde el campo.',
    leadEn: 'Every shock absorber located, with its incident history accessible from the field.',
    quoteEs: '«Cada amortiguador localizado, con su historial de incidentes accesible desde el campo.»',
    quoteEn: '"Every shock absorber located, incident history accessible from the field."',
  },
];

export const featuredCases = caseStudies.filter(c => c.featured);
export const allSectorsEs = [...new Set(caseStudies.map(c => c.sector))];
export const allSectorsEn = [...new Set(caseStudies.map(c => c.sectorEn))];
