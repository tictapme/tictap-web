# Plan de implementación: landing partners distribuidores + caso de éxito Yesss

## Objetivo

Implementar una arquitectura de 3 piezas alineada con la conversación de negocio y con la estructura actual de `tictap-web`:

1. `/stock/`
2. `/stock/partners-distribuidores/`
3. `/casos-de-exito/yessss-electrical-stock/`

La implementación debe reutilizar el lenguaje visual y los patrones ya presentes en la web, especialmente:

- la estructura editorial y de confianza de `src/casos-de-exito/index.html`
- la jerarquía de solución, beneficios, proof y CTA de `src/stock/index.html`

## Hallazgos previos del proyecto

### Estado actual relevante

- `src/` es la verdad de producción y cualquier ruta nueva debe existir ahí para publicarse.
- El catch-all de Astro (`astro/src/pages/[...slug].astro`) genera páginas a partir de rutas encontradas en `src/`.
- Si existe un fichero equivalente en `astro/legacy-sources/`, Astro lo prioriza como fuente al construir la misma ruta.
- `casos-de-exito` ya tiene una implementación más estructurada y editorial:
  - masthead
  - carrusel de destacados
  - grid filtrable de casos
  - CTA final
- `stock` ya tiene una estructura clara de solución:
  - hero
  - problema
  - cómo funciona
  - beneficios
  - métricas / social proof
  - pasos de activación
  - CTA demo
- `/producto/` no existe hoy en `src/`; solo aparece como CTA roto/referenciado desde `src/casos-de-exito/index.html`.

### Hallazgos adicionales de los brochures de Yessss / Smart Asset Solutions

Los PDFs añadidos en `yesss-business-case-plan/` aportan información comercial concreta que debe influir en la implementación:

- El modelo no se presenta como “software standalone”, sino como una oferta de canal:
  - `Smart Asset Solutions`
  - `powered by`
  - `supported by your local YESSS Electrical branch`
- La propuesta combina tres formatos claros:
  - `Smart Van`
  - `Smart Portal`
  - `Smart Store`
- La promesa comercial está muy centrada en:
  - visibilidad en tiempo real
  - reposición automatizada
  - control de gasto y uso
  - reducción de desperdicio y stock loss
  - continuidad operativa sin emergency orders
- El flujo de reposición descrito en brochure es especialmente valioso para la landing:
  - técnico escanea QR/NFC
  - el sistema actualiza stock en tiempo real
  - al llegar a mínimos se notifica automáticamente
  - la sucursal YESSS, proveedor nominado o compras recibe aviso
- El distribuidor aparece como actor operativo real, no solo como prescriptor:
  - soporte local
  - instalación
  - ajustes del sistema
  - suministro continuo de stock
- El brochure introduce dos diferenciales de negocio importantes:
  - `simple monthly subscription`
  - `multi-supplier functionality`
- Hay un activo comercial físico que refuerza el caso:
  - `demo van`
  - se usa para enseñar el sistema en entorno real y acelerar conversaciones/conversiones
- Los sectores objetivo mencionados son útiles para modular el copy:
  - trade & construction
  - utilities & infrastructure
  - field-service maintenance

### Implicación para la implementación

- La nueva landing de partners debe vivir como ruta real en `src/stock/partners-distribuidores/index.html`.
- El nuevo caso de éxito debe vivir como ruta real en `src/casos-de-exito/yessss-electrical-stock/index.html`.
- Si se quiere mantener una fuente más mantenible para render estructurado, se puede añadir además una copia editable en `astro/legacy-sources/...`, pero no sustituye la necesidad de que la ruta exista en `src/`.
- La estrategia de enlaces no puede depender de `/producto/` hasta que esa ruta exista o se redefina.

## Arquitectura objetivo

```text
/stock/
  ├── CTA hacia /stock/partners-distribuidores/
  └── CTA hacia /casos-de-exito/yessss-electrical-stock/

/stock/partners-distribuidores/
  ├── CTA primaria de partnership/contacto
  ├── CTA secundaria hacia /casos-de-exito/yessss-electrical-stock/
  └── enlace contextual hacia /stock/

/casos-de-exito/yessss-electrical-stock/
  ├── enlace contextual hacia /stock/
  ├── bloque específico para distribuidores
  └── CTA hacia /stock/partners-distribuidores/

/casos-de-exito/
  └── nueva tarjeta/caso destacado para Yessss
```

## Páginas a implementar o modificar

### 1. Página existente `/stock/`

#### Rol

Seguir siendo la página de producto/solución general. No convertirla en una landing de canal.

#### Cambios requeridos

- Mantener el hero actual como mensaje generalista.
- Añadir un bloque específico para canal o partnership sin romper el flujo principal.
- Añadir dos enlaces visibles:
  - `Ver cómo funciona para distribuidores`
  - `Leer caso Yessss Electrical`
- Insertar esos enlaces en dos puntos:
  - en la mitad de página, después de la explicación de funcionamiento o beneficios
  - en el último tercio, cerca del CTA/demo o del bloque de resultados

#### Patrón visual recomendado

- No crear un hero secundario nuevo.
- Usar una banda o card horizontal integrada con el diseño actual de `stock`.
- Mantener:
  - tipografía Varela Round/Lato
  - botones y colores del sistema actual
  - composición de solución + CTA ya usada en la página

#### Mensaje

- `/stock/` responde a “qué hace el producto”.
- Los nuevos enlaces deben abrir la vía de “para quién en canal” y “prueba real”.

### 2. Nueva landing `/stock/partners-distribuidores/`

#### Rol

Página orientada a distribuidores eléctricos / wholesalers / partners de canal. Debe vender el valor comercial del modelo, no solo el software.

#### Principio de mensaje obligatorio

La landing no debe plantearse como “TicTAP busca distribuidores”.

Debe plantearse como:

- una solución de stock que el distribuidor puede llevar a cliente bajo una propuesta de servicio local
- una forma de conectar reposición, soporte y relación comercial recurrente
- un modelo similar al observado en YESSS: solución tecnológica + sucursal/partner de proximidad + operativa de reposición

#### Estructura recomendada

##### Hero

- Título centrado en fidelización, recurrencia y valor añadido.
- Subtítulo que explique:
  - stock en almacenes, furgonetas y puntos de trabajo
  - QR/NFC
  - sin apps
  - propuesta para clientes profesionales del distribuidor
- Añadir explícitamente el concepto de:
  - soporte desde la red local / branch / distribuidor
  - reposición conectada
- CTA principal: partnership/contacto
- CTA secundaria: ver caso Yessss

##### Sección problema

- Adaptar el problema operativo del cliente profesional:
  - stock distribuido
  - baja visibilidad
  - compras duplicadas
  - roturas
  - inventarios manuales
- Esta sección debe heredar el tono y la claridad de los bloques de problema ya presentes en `/stock/`.

##### Sección “por qué importa al distribuidor”

- Debe ser la sección central de la landing.
- Ejes:
  - más fidelización
  - más recurrencia
  - más diferenciación
  - más presencia en el momento de reposición
- Formato recomendado:
  - 3 cards o 3 columnas
  - iconografía simple
  - una línea de impacto por card

Añadir una idea explícita tomada del material de Yessss:

- cuando el stock llega al mínimo, el distribuidor puede entrar en el flujo de reposición sin depender de pedidos improvisados

##### Sección “cómo funciona”

- Reutilizar la lógica actual de `/stock/`:
  - crear Stores
  - etiquetar con QR/NFC
  - importar productos
  - registrar movimientos
  - disparar reposición
- Debe ser más breve que en `/stock/`.
- Objetivo: demostrar facilidad y compatibilidad operativa.

El flujo debe reflejar el patrón real visto en brochure:

1. escanear o tap con QR/NFC
2. actualización inmediata en portal central
3. trigger automático cuando se alcanza mínimo
4. aviso a branch, proveedor o compras
5. reposición y optimización

##### Sección “modelos de partnership”

- 3 modelos:
  - pilotos con clientes clave
  - servicio digital de valor añadido
  - reposición conectada al distribuidor
- Este bloque no existe hoy y debe diseñarse como bloque nuevo, pero usando el lenguaje de cards y espaciados del sitio.

Añadir una nota de implementación de copy:

- el tercer modelo debe parecerse al esquema comercial real de YESSS
- no presentar solo “reselling software”
- presentar “servicio conectado de stock + reposición + soporte local”

##### Sección “formatos de despliegue”

Incorporar un bloque específico, corto y visual, basado en los brochures:

- `Smart Van`
- `Smart Portal`
- `Smart Store`

Objetivo del bloque:

- aterrizar la solución en formatos que un distribuidor entiende y puede vender
- conectar con la realidad de instaladores, mobile teams, almacenes, workshops y customer stores

Formato recomendado:

- 3 cards horizontales o 3 columnas
- un caso de uso por formato
- una frase de valor por formato

##### Sección “servicio local y activación comercial”

Crear un bloque específico que no existe todavía en la propuesta inicial pero sí está respaldado por los brochures:

- instalación y puesta en marcha
- soporte y ajustes del sistema
- suministro continuo de stock
- acompañamiento comercial desde la sucursal/local branch

Este bloque es importante para evitar que la landing suene a SaaS puro.

##### Sección “suscripción y escalabilidad”

Añadir una mención breve a:

- suscripción mensual simple
- baja barrera de entrada
- escalabilidad por vans, stores, teams y locations

No hace falta convertirlo en bloque de pricing, pero sí en argumento comercial.

##### Sección “demo real”

Si negocio confirma que puede contarse, añadir un bloque o microcopy sobre demostración en entorno real:

- demo van
- demo on-site
- validación del flujo en condiciones de trabajo reales

Si no puede afirmarse públicamente, dejarlo solo como inspiración para CTA y no como claim.

##### Sección “caso validado”

- Resumen corto del caso Yessss.
- No contar todo el caso aquí.
- Incluir CTA al caso completo.

##### CTA final

- CTA principal a contacto/comercial.
- CTA secundaria a `/stock/`.

#### Patrón visual recomendado

- Debe parecer una página hermana de `/stock/`, no una landing aislada de otra marca.
- Reutilizar:
  - ritmo vertical
  - fondo claro
  - combinaciones de texto + imagen
  - botones primarios/secundarios del sistema
- Evitar estética de campaña temporal tipo `landing-page/`.

### 3. Nuevo caso de éxito `/casos-de-exito/yessss-electrical-stock/`

#### Rol

Validar socialmente el modelo de partnership para distribuidores usando la misma lógica narrativa del archivo de casos de éxito existente.

#### Estructura recomendada

Seguir la misma familia estructural que los casos actuales y encajar en el archivo `/casos-de-exito/`.

##### Estructura editorial

- Hero del caso
  - cliente
  - sector
  - titular transformacional
  - resumen ejecutivo
- Bloque de reto inicial
- Bloque de implantación / solución
- Bloque de operativa conseguida
- Bloque de resultados
- Bloque de aprendizaje/valor para distribuidores
- CTA final cruzada hacia partners y stock

#### Requisitos de consistencia con el archivo de casos

- Debe usar la misma taxonomía visual:
  - sector/tag
  - cliente
  - titular
  - quote / insight
  - CTA “Saber más” o equivalente
- Debe poder añadirse al archivo:
  - como card en el grid
  - idealmente también como caso destacado si el negocio lo prioriza

#### Mensaje específico

- El caso no debe quedarse en “usan TicTAP”.
- Debe demostrar:
  - utilidad para stock distribuido
  - valor comercial para distribuidor
  - puente entre control de stock y reposición
  - papel activo de la branch/local team en despliegue y soporte

#### Ángulos concretos a reflejar en el caso

El caso debe aprovechar la información del brochure para mostrar un patrón operativo reconocible:

- stock distribuido entre:
  - vans
  - stores
  - depots
  - customer stores / on-site locations
- reposición conectada a la branch o al proveedor designado
- dashboard/portal central con visibilidad transversal
- reducción de:
  - stock loss
  - duplicated purchases
  - emergency orders
  - downtime

#### Elementos diferenciales recomendados en el caso

Si hay respaldo editorial suficiente, incluir:

- la nomenclatura funcional tipo:
  - van stock
  - central portal
  - smart store
- la idea de que el distribuidor no solo suministra material:
  - instala
  - acompaña
  - ajusta el sistema
  - permanece en el circuito de reposición

### 4. Archivo `/casos-de-exito/`

#### Cambios requeridos

- Añadir el nuevo caso al grid de “Más historias”.
- Decidir si entra también en el carrusel de destacados.

#### Recomendación

- Fase 1: añadirlo al grid y filtro sectorial.
- Fase 2 opcional: promoverlo a destacado si hay materiales visuales y copy suficientemente sólidos.

#### Taxonomía sugerida

- Sector:
  - `Distribución`
  - o `Logística`
  - o `Industria`

Recomendación: crear `Distribución` solo si se va a usar en más casos. Si no, usar una taxonomía existente para no romper la simplicidad del filtro.

### 5. Página de producto

#### Hecho relevante

- No existe actualmente una ruta publicada clara para `/producto/`.
- El único rastro encontrado es un CTA en `casos-de-exito` hacia una URL inexistente.

#### Decisión de implementación

La IA implementadora debe elegir una de estas dos opciones y documentarla:

1. No tocar `/producto/` en esta iteración y sustituir los enlaces pensados para “producto” por `/stock/`.
2. Si el negocio insiste en una página de producto general, tratarla como trabajo separado y no bloquear esta entrega.

#### Recomendación

- Para esta iteración, considerar `/stock/` como la página de producto relevante para esta iniciativa.
- No abrir una dependencia nueva creando `/producto/` salvo instrucción explícita.

## Estrategia de enlazado interno

## Enlace desde `/stock/`

- Añadir CTA contextual a `/stock/partners-distribuidores/`.
- Añadir CTA contextual a `/casos-de-exito/yessss-electrical-stock/`.
- No saturar el hero principal con demasiados CTAs.
- Ubicaciones recomendadas:
  - bloque intermedio “para distribuidores/partners”
  - bloque final de CTA

## Enlace desde `/stock/partners-distribuidores/`

- CTA principal a contacto.
- CTA secundaria a caso de éxito.
- Enlace de retorno a `/stock/` como “ver la solución completa”.
- Si se crea un bloque de formatos de despliegue, enlazar desde cada card a anclas internas o a `/stock/` para ampliar la explicación general del producto.

## Enlace desde `/casos-de-exito/yessss-electrical-stock/`

- CTA principal a `/stock/partners-distribuidores/`.
- CTA secundaria a `/stock/`.
- Enlace de navegación de contexto al archivo `/casos-de-exito/`.

## Enlace desde `/casos-de-exito/`

- Añadir nueva card del caso Yessss.
- Si se crea nueva taxonomía, asegurar que el filtro la soporta.
- Si no se crea nueva taxonomía, mapearlo a una taxonomía existente sin tocar demasiado el JS del filtro.

## Decisiones técnicas

### Archivos mínimos a tocar

- `src/stock/index.html`
- `src/casos-de-exito/index.html`
- `src/stock/partners-distribuidores/index.html`
- `src/casos-de-exito/yessss-electrical-stock/index.html`

### Archivos opcionales recomendados

Si se quiere una fuente editable alineada con el patrón de páginas gestionadas:

- `astro/legacy-sources/stock/partners-distribuidores/index.html`
- `astro/legacy-sources/casos-de-exito/yessss-electrical-stock/index.html`

Nota:
- Esto es opcional para la entrega funcional.
- La ruta publicada sigue necesitando existir en `src/`.

### Reglas de implementación

- Mantener URLs absolutas del dominio en forma local relativa durante edición, dejando que el pipeline SEO normalice.
- Respetar patrones de header/footer existentes.
- No introducir componentes visuales que rompan con Astra/Elementor/legacy styling del sitio.
- Si se reutiliza JS existente del archivo de casos, no duplicarlo innecesariamente.

## Orden recomendado de ejecución

1. Crear el caso de éxito Yessss.
2. Insertarlo en `/casos-de-exito/`.
3. Crear la landing `/stock/partners-distribuidores/`.
4. Añadir enlaces cruzados desde la nueva landing al caso y a `/stock/`.
5. Modificar `/stock/` para incorporar el acceso a la landing y al caso.
6. Resolver cualquier CTA que apunte a `/producto/` dentro del ámbito afectado por esta iniciativa.
7. Ejecutar el pipeline estático completo y revisar diff.

## Criterios de contenido

### Para la landing de partners

- Hablar al distribuidor, no al técnico final.
- Priorizar:
  - fidelización
  - recurrencia
  - diferenciación
  - oportunidad de reposición
- apoyo de sucursal / branch local
- servicio asociado a la venta recurrente de material
- Evitar copy genérico tipo “somos partner tecnológico”.
- Evitar también copiar literalmente el naming comercial de Yessss si no está aprobado para uso público.

### Claims útiles extraídos de brochures que sí conviene traducir a web

- control de stock en cualquier ubicación
- reposición automatizada
- visibilidad en tiempo real
- control de gasto y consumo
- sin comprobaciones manuales constantes
- menos pedidos urgentes
- soporte local

### Claims que requieren validación antes de publicarse tal cual

- `supported by your local YESSS branch`
- `simple monthly subscription`
- `multi-supplier functionality`
- `demo van`

Usarlos solo si negocio confirma que pueden trasladarse 1:1 a la página pública de TicTAP o al caso.

### Para el caso de éxito

- Mantener tono verificable y concreto.
- No afirmar datos no aprobados.
- Si faltan permisos de naming/logo:
  - usar versión neutra temporal
  - dejarlo anotado como dependencia editorial

## Criterios de diseño

- Reutilizar la familia visual actual de `stock` para la nueva landing.
- Reutilizar la lógica de presentación editorial de `casos-de-exito` para el caso Yessss.
- Evitar una landing visualmente “de campaña” si el objetivo es SEO, confianza y navegación interna.
- Mantener consistencia en:
  - espaciados
  - botones
  - fondos
  - iconografía
  - tono de titulares

## Riesgos a controlar

- Crear la landing solo en `astro/legacy-sources/` sin su ruta correspondiente en `src/`.
- Romper el filtro del grid de casos por introducir una categoría nueva sin tocar el JS.
- Enlazar a `/producto/` sin resolver que esa ruta no existe.
- Duplicar mensajes entre `/stock/` y la nueva landing, perdiendo diferenciación de intención.
- Usar una estructura visual que no parezca parte del sitio actual.
- Convertir la landing en una página demasiado “corporate partner program” y no en una propuesta comercial tangible basada en reposición, branch support y operación real.
- Publicar nomenclaturas o claims del material interno de Yessss sin validación previa de uso externo.

## Validación obligatoria antes de cerrar

1. `npm run optimize:seo`
2. `npm run normalize:pages`
3. `npm run validate:static`
4. Revisar manualmente:
   - `/stock/`
   - `/stock/partners-distribuidores/`
   - `/casos-de-exito/`
   - `/casos-de-exito/yessss-electrical-stock/`
5. Verificar enlazado bidireccional:
   - stock -> partners
   - stock -> caso
   - partners -> stock
   - partners -> caso
   - caso -> partners
   - caso -> stock

## Definición de terminado

La iniciativa se considera terminada cuando:

- existe una landing real para partners/distribuidores bajo `/stock/partners-distribuidores/`
- existe un caso de éxito real para Yessss bajo `/casos-de-exito/yessss-electrical-stock/`
- `/stock/` enlaza claramente a ambas piezas
- `/casos-de-exito/` incorpora el nuevo caso con la misma lógica estructural ya existente
- no queda ningún enlace nuevo dependiendo de `/producto/` sin una ruta real detrás
- el pipeline estático y la validación del sitio pasan sin errores
