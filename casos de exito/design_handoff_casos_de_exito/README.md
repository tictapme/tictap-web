# Handoff: Casos de éxito · TicTAP

Rediseño de la sección **Casos de éxito** del sitio público `tictap.me`. Cubre dos plantillas:

- **Listado** → `/casos-de-exito/`
- **Plantilla de caso individual** → `/casos-de-exito/[slug]/` (Dagartech como ejemplo trabajado)

> **Reemplaza** la página actual: `https://www.tictap.me/casos-de-exito/trazabilidad-de-grupos-electrogenos-para-dagartech/`

---

## Sobre los archivos de este paquete

Los archivos `.html` y `.css` de esta carpeta **son código de producción funcional, no maquetas**. HTML semántico, CSS sin dependencias, sin JavaScript, sin build step. Pueden abrirse directamente en un navegador y son responsive.

**Tu trabajo como dev**: integrarlos en el entorno actual del sitio. Si el sitio está en **WordPress + Elementor** (que es como está montado tictap.me hoy), las dos pautas son:

1. **Pull el CSS** (`styles.css`) al theme child como un stylesheet más. Los tokens en `:root` ya respetan la marca TicTAP.
2. **Convierte cada `<section>`** del HTML en un bloque/widget Elementor equivalente, o monta plantillas custom de Elementor Theme Builder usando este HTML como referencia exacta de estructura, copy y comportamiento.

Si el sitio se migra a otro stack (Astro, Next.js, etc.), los HTML se pueden adoptar prácticamente tal cual, separando el contenido reutilizable (lista de casos) a una colección/CMS.

---

## Fidelidad

**Hi-fi de producción.** No son wireframes. Lo que se ve es lo que tiene que quedar. Decisiones tomadas:

- Tipografía final: Varela Round (display) + Lato (body), las dos de la marca TicTAP.
- Color final: azul de marca `#00B0FF` aplicado con cuentagotas (eyebrows, métricas, links, separadores).
- Border-radius global: 20 px (variable `--radius`).
- Layout final: contenido a 1140 px max, fondos full-bleed.

Lo único que falta son los **assets reales** (fotos, screenshots, logo cliente, quote real) — están como `<figure class="placeholder">` con un label que indica qué debe ir ahí.

---

## Estructura de archivos

```
design_handoff_casos_de_exito/
├── README.md         ← este documento
├── styles.css        ← tokens, componentes, responsive (~600 líneas)
├── listado.html      ← /casos-de-exito/
├── dagartech.html    ← /casos-de-exito/[slug]/
└── preview.html      ← landing con enlaces a los dos (preview local)
```

---

## Pantalla 1 · Listado (`listado.html`)

URL final: `/casos-de-exito/`

### Propósito

Punto de entrada SEO/orgánico Y página que el comercial enlaza al prospect. Audiencia objetivo: **director de mantenimiento / operaciones** evaluando si TicTAP encaja en su sector.

### Layout (de arriba a abajo)

1. **Masthead** — eyebrow + H1 grande + lead. Fondo blanco, centrado.
2. **Caso destacado** — grid 2-col (1.25fr / 1fr en laptop+). Imagen a la izquierda con tag flotante "Destacado · [sector]"; a la derecha: eyebrow con nombre del cliente, H2, lead, callout con métrica grande, link "Leer historia completa".
3. **Más historias** — header con título + tabs por sector (todos / energía / bebidas / logística / ferroviario / industria).
4. **Grid de casos** — 1-col en móvil, 2-col en laptop+. Cada card: imagen, sector + cliente, título, quote con borde izquierdo, link "Leer caso".
5. **CTA inferior** — banda oscura full-bleed. Grid 2-col (1.4fr / 1fr en laptop+) con copy + dos botones.

### Comportamiento

- Tabs por sector: filtran la lista. En producción, esto se conecta a la taxonomía (`tax_input[sector]`) de WP, o al sistema de filtrado del CMS que se use. **Sin reload de página**, idealmente.
- Cards y "Leer caso" enlazan al detalle correspondiente.

---

## Pantalla 2 · Detalle (`dagartech.html`)

URL final: `/casos-de-exito/[slug]/`

### Propósito

Página de venta: el comercial pasa el link al prospect después de la primera llamada. El prospect tiene que entender en 60 segundos qué problema tenía Dagartech, qué se hizo, y qué resultado obtuvieron.

### Layout (de arriba a abajo)

1. **Breadcrumb** — `Casos de éxito › Energía › Dagartech`. Fondo blanco, borde inferior.
2. **Hero** — grid 2-col (1.4fr / 1fr en laptop+). A la izquierda: tags, H1, lead, banda con logo cliente + datos del proyecto (`<dl>` con sector / inicio / módulos). A la derecha: foto principal.
3. **Capítulo 01 · El reto** — número grande, eyebrow, H2. Body en grid 2-col (1.2fr / 1fr en laptop+): párrafos narrativos a la izquierda, caja "Antes de TicTAP" con checklist de pain points a la derecha.
4. **Capítulo 02 · La solución** — mismo patrón pero grid invertido (1fr / 1.2fr): screenshot a la izquierda, narrativa + lista numerada de features a la derecha.
5. **Capítulo 03 · El resultado** — fondo soft, número y eyebrow en azul. Métricas en grid (1/2/3 columnas según breakpoint), luego párrafo de cierre.
6. **Pull quote** — fondo soft, full-bleed, quote en Varela Round 30 px con comillas decorativas, avatar + nombre + cargo.
7. **CTA** — banda oscura full-bleed, centrada, con dos botones (Reservar 30 min / Descargar PDF).
8. **Más casos de éxito** — fondo soft, grid de 3 cards (1/2/3 cols según breakpoint).

### Comportamiento

- **Capítulos**: estática, sin acordeón. Todo visible al hacer scroll.
- **Botón "Descargar caso (PDF)"**: en una fase posterior, generar PDF del caso. Por ahora puede apuntar a un PDF estático subido manualmente.
- **Botón "Reservar 30 min"**: enlace al formulario de demo o al widget de Calendly que se use.

### Importante — bloque "Más casos de éxito"

La decisión original era **conservar el bloque Elementor actual** (`elementor-element-e762101`) en lugar de reemplazarlo. La versión que viene en `dagartech.html` es una recreación visual de cómo debería quedar; si el cliente quiere mantener el bloque original tal cual, eliminar la `<section class="... more-cases-section">` y dejar que el theme inyecte el bloque viejo.

---

## Sistema de tokens (en `:root`)

Todos los valores de marca están centralizados en `styles.css`. Cambia el token → cambia todo.

### Color

| Token | Valor | Uso |
|---|---|---|
| `--c-paper` | `#ffffff` | Fondo principal |
| `--c-paper-soft` | `#FAFAFA` | Fondo de capítulo resultado + pull quote + más casos |
| `--c-paper-alt` | `#F2F2F2` | Fondo de cards alt y callouts |
| `--c-ink` | `#2a2a2a` | Headings + fondo CTA dark |
| `--c-ink-2` | `#484848` | Body |
| `--c-ink-3` | `#737373` | Texto secundario |
| `--c-ink-4` | `#A5A19D` | Terciario / labels |
| `--c-line` | `#D9D9D9` | Bordes |
| `--c-line-soft` | `#EDEDED` | Bordes suaves |
| `--c-brand` | `#00B0FF` | Acento de marca (links, eyebrows destacados, borde superior de métricas, separadores de callout) |
| `--c-brand-dark` | `#0096d9` | Hover de botones |
| `--c-brand-soft` | `#D9F3FF` | Fondo de tag-blue y feature numbers |

### Tipografía

| Token | Valor |
|---|---|
| `--f-display` | `'Varela Round', system-ui, sans-serif` |
| `--f-body` | `'Lato', system-ui, sans-serif` |

Cargadas desde Google Fonts (ver `<link>` en los HTML). En producción es preferible **self-host** con `font-display: swap` y `preload` para evitar FOUT.

### Escala tipográfica (todas usan `clamp()` para fluidez)

| Token | Min – max | Uso |
|---|---|---|
| `--fs-display-1` | 34 – 56 px | H1 del listado |
| `--fs-display-2` | 30 – 52 px | H1 del detalle |
| `--fs-display-3` | 26 – 42 px | H2 / titulares de hero secundarios |
| `--fs-display-4` | 22 – 32 px | H3 / titulares de capítulo y secciones |
| `--fs-display-5` | 20 – 28 px | H4 / titulares de card |
| `--fs-lead` | 16 – 19 px | Párrafo de entrada |
| `--fs-body` | 15 px | Body por defecto |
| `--fs-small` | 13 px | Breadcrumb, copy auxiliar |
| `--fs-eyebrow` | 11 px | Eyebrows |

### Forma y espaciado

| Token | Valor |
|---|---|
| `--radius` | `20px` (cards, placeholders, callouts, métricas) |
| `--pad-x` | `clamp(20px, 5vw, 56px)` (gutter lateral) |
| `--pad-y-md` | `clamp(48px, 7vw, 72px)` (padding vertical de sección) |
| `--pad-y-lg` | `clamp(56px, 8vw, 96px)` |

### Ancho de contenido

- `.container` → max-width **1140 px**, centrado.
- Las `<section>` son full-bleed (fondo a borde); el contenido se centra dentro.

### Breakpoints

Mobile-first. Reglas adicionales en:
- `≥ 768px` (tablet) — métricas 2-col, más-casos 2-col
- `≥ 1024px` (laptop) — todos los grids 2-col activos (hero, l-featured, cta-strip, chapter bodies, l-cases)
- `≥ 1280px` (desktop) — sin cambios estructurales, sólo `--pad-x` máximo

---

## Componentes reutilizables

Definidos en `styles.css`. Si se migra a un framework con componentes (React, Vue, etc.), cada uno de estos es un candidato a componente:

| Clase | Descripción |
|---|---|
| `.tag` / `.tag--blue` / `.tag--outline` | Píldoras (border-radius 999px) |
| `.btn` / `.btn--ghost` / `.btn--ghost-light` | Botones (también píldoras) |
| `.link-action` | Link de acción con flecha (azul, bold) |
| `.t-eyebrow` / `.t-eyebrow--brand` | Eyebrow con letterspacing |
| `.t-display` + `.t-h1`…`.t-h5` | Headings en Varela Round |
| `.t-lead` | Párrafo de entrada |
| `.section` + variantes (`--dark`, `--soft`, `--alt`, `--bot`, etc.) | Wrapper full-bleed con padding |
| `.container` | Wrapper de contenido 1140 max |
| `.card` | Card genérica con borde, radius y overflow hidden |
| `.placeholder` | Caja vacía estilizada (sustituir por `<img>`) |
| `.metric` / `.metric-callout` | Métricas grandes en Varela Round |
| `.chapter` / `.chapter__head` / `.chapter__body` | Sección numerada |
| `.pullquote` | Quote grande con comillas decorativas |
| `.checklist` | Lista de bullets con dot a la izquierda |
| `.features` / `.feature` | Lista numerada con círculos azules |

---

## Assets que el dev tiene que conseguir

Las imágenes están como placeholders. Sustituir `<figure class="placeholder">` por `<img class="placeholder" src="..." alt="...">` — la clase mantiene `border-radius` y `object-fit: cover`.

**Listado**:
- 1 imagen editorial del caso destacado (Dagartech) — recomendado: foto del generador con etiqueta NFC, ratio ~4:3, mín. 1200×900
- 4 imágenes de los casos secundarios (Damm, Industria, Logística, Ferroviario), ratio ~5:4 mín. 600×480

**Detalle Dagartech**:
- 1 foto principal en el hero — generador Dagartech con etiqueta NFC, ratio ~4:3
- 1 screenshot del módulo de mantenimiento de TicTAP — UI real, ratio libre, mín. 1000 de ancho
- 1 logo de Dagartech (140×48 visible, idealmente SVG transparente)
- 1 foto del entrevistado para el pull quote (40×40 circular)
- Quote real del cliente (la actual es una recreación a partir del tono del original)
- Nombre + cargo real del entrevistado

**Más casos** (la sección del final del detalle):
- 3 thumbnails de los otros casos destacados, ratio ~5:3

---

## Cosas que NO se incluyen (y por qué)

- **Header global del sitio** — lo pone el theme. No se duplica aquí.
- **Footer global del sitio** — idem.
- **JS** — no se necesita para el render base. Los tabs de filtro y el smooth-scroll son progresivos: si se quieren, se añaden encima.
- **PDF del caso** — el botón "Descargar caso (PDF)" requiere generar PDFs por caso. Fase posterior; por ahora puede apuntar a un PDF estático.

---

## Cómo previsualizar localmente

```bash
cd design_handoff_casos_de_exito
python3 -m http.server 8000
# abrir http://localhost:8000/preview.html
```

`preview.html` es una landing con enlaces a las dos plantillas y notas para el dev.

---

## Resumen del proceso de diseño

Para contexto, este diseño es el resultado de:

1. Análisis estructural de la página actual (problemas: prosa corrida, métricas enterradas, sin marca visual de capítulos, CTA genérico).
2. 4 direcciones estructurales exploradas en wireframe lo-fi (Resultados primero · Reto-Solución-Resultado · Ficha técnica · Editorial).
3. Decisión del cliente: **Editorial para el listado + Reto/Solución/Resultado para el detalle**.
4. Pasada mid-fi con tipografía y copy real.
5. Conversión a HTML/CSS de producción responsive (este paquete).

Cualquier cambio futuro debería respetar este sistema: tokens en `:root`, secciones full-bleed con contenido en `.container`, fidelidad a Varela Round + Lato + acento `#00B0FF`.
