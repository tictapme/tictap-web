Sí: **hacer una landing específica para partners distribuidores es buena idea**, pero no sustituiría la página actual de Stock. Yo montaría una arquitectura de **3 piezas**, cada una con una función distinta:

1. **Página actual `/stock/`**
   Explica el módulo como solución general para empresas que quieren controlar stock en almacenes, furgonetas y puntos de trabajo.

2. **Nueva landing `/stock/partners-distribuidores/`**
   Habla directamente a distribuidores eléctricos y wholesalers: “puedes ofrecer TicTAP Stock a tus clientes profesionales como servicio de valor añadido”.

3. **Caso de éxito `/casos-de-exito/yessss-electrical-stock/`**
   Construye confianza: “esto no es una idea teórica; ya lo está utilizando un distribuidor eléctrico”.

La página actual ya explica bastante bien el producto: control de stock en almacenes y furgonetas, Stores con QR, movimientos de entrada/salida/ajuste, mínimos/máximos, alertas de reposición, trazabilidad e integración con ERP/compras. ([TicTAP][1]) Lo que le falta para este objetivo es **un mensaje específico para distribuidores como canal/partner**.

---

# 1. Arquitectura recomendada

Yo lo organizaría así:

```text
Home
 ├── Soluciones
 │    └── Gestión de Stock (/stock/)
 │          ├── CTA: Ver cómo funciona para distribuidores
 │          └── CTA: Leer caso Yessss Electrical
 │
 ├── Partners
 │    └── Stock para distribuidores eléctricos (/stock/partners-distribuidores/)
 │          ├── CTA: Hablar sobre partnership
 │          └── CTA: Ver caso Yessss Electrical
 │
 └── Casos de éxito
      └── Yessss Electrical + TicTAP Stock
```

No pondría todo en una sola página porque hay dos intenciones distintas:

* Quien entra en `/stock/` quiere entender **qué hace el producto**.
* Quien entra en la landing de partners necesita entender **por qué le interesa a un distribuidor revenderlo, recomendarlo o integrarlo en su propuesta comercial**.
* Quien entra en el caso de éxito necesita pensar: **“si otro distribuidor eléctrico ya lo usa, quizá tiene sentido que lo valoremos”**.

---

# 2. Mensaje central de la landing de partners

El error sería decir:

> “Buscamos partners para vender nuestro módulo de stock.”

Eso suena a que queréis que ellos os ayuden a vender.

El mensaje debería ser:

> **Ayuda a tus clientes profesionales a controlar su stock y conviértete en su proveedor natural de reposición.**

Ese es el mensaje fuerte.

Porque a un distribuidor eléctrico no le interesa solamente una herramienta de software. Le interesa:

* Fidelizar instaladores, mantenedores y clientes profesionales.
* Generar compras recurrentes.
* Diferenciarse de otros mayoristas.
* Dar más valor sin competir solo en precio.
* Obtener más visibilidad sobre necesidades reales de reposición.
* Mejorar su propuesta digital frente a otros distribuidores.

---

# 3. Página 1: Landing para partners distribuidores

URL sugerida:

```text
/stock/partners-distribuidores/
```

O en inglés si vas a usarla fuera de España:

```text
/stock/electrical-distributors/
```

## Estructura recomendada

### Hero

**Título:**

> Convierte el control de stock de tus clientes en una nueva oportunidad de fidelización

**Subtítulo:**

> TicTAP Stock permite a distribuidores eléctricos ofrecer a instaladores, mantenedores y clientes profesionales una forma sencilla de controlar material en almacenes, furgonetas y puntos de trabajo mediante QR/NFC, sin instalar apps.

**CTA principal:**

> Hablar sobre partnership

**CTA secundario:**

> Ver caso Yessss Electrical

**Imagen recomendada:**

Una composición visual con:

* Técnico escaneando QR en una furgoneta.
* Estantería con material eléctrico.
* Pantalla móvil con “Stock Out / Replenish / Adjust”.
* Logo de TicTAP + “Partner model for electrical distributors”.

No usaría una imagen demasiado abstracta de software. Tiene que parecer “mundo real”: furgonetas, cajas, almacén, instaladores.

---

### Sección 2 — El problema del cliente profesional

**Título:**

> Tus clientes profesionales trabajan con stock distribuido, pero muchas veces sin visibilidad real

**Texto:**

> Material en furgonetas, pequeños almacenes, cuartos técnicos, obras y sedes de cliente. Cuando no existe un sistema simple para registrar entradas, salidas y reposiciones, aparecen roturas de stock, compras duplicadas, urgencias y pérdida de tiempo.

**Bullets:**

* No saben exactamente qué material tienen en cada ubicación.
* Compran de más “por si acaso”.
* Detectan tarde que falta material crítico.
* Pierden tiempo haciendo inventarios manuales.
* Gestionan mínimos y reposiciones en Excel o de memoria.

Esta sección puede reutilizar ideas de la página actual, que ya habla de información dispersa, compras duplicadas, inventarios manuales y falta de visibilidad en almacenes y furgonetas. ([TicTAP][1])

**Imagen recomendada:**

Foto o mockup dividido en 3 columnas:

* Almacén.
* Furgoneta.
* Cuarto técnico.

Con pequeños iconos de “sin visibilidad”, “rotura de stock”, “duplicado”.

---

### Sección 3 — Por qué importa al distribuidor

Esta es la sección más importante de la landing.

**Título:**

> Cuando tu cliente no controla su stock, tú también pierdes oportunidades

**Mensaje:**

> Cada rotura de stock, compra urgente o reposición improvisada es una oportunidad para que el cliente compre donde encuentre disponibilidad. Si le ayudas a ordenar su stock, puedes estar presente justo en el momento en el que surge la necesidad de reposición.

**Tres bloques:**

**1. Más fidelización**
Ayudas al cliente a resolver un problema operativo diario.

**2. Más recurrencia**
Las reposiciones dejan de ser reactivas y pasan a estar guiadas por mínimos, consumos y necesidades reales.

**3. Más diferenciación**
Pasas de vender producto a ofrecer una solución de control y eficiencia.

**Imagen recomendada:**

Un diagrama simple:

```text
Cliente controla stock
        ↓
Detecta necesidad de reposición
        ↓
Distribuidor recibe oportunidad comercial
        ↓
Más recurrencia y fidelización
```

---

### Sección 4 — Cómo funciona TicTAP Stock

**Título:**

> Una forma simple de digitalizar stock sin cambiar la forma de trabajar del técnico

**Flujo visual:**

1. Crear Stores: almacén, furgoneta, delegación, cuarto técnico.
2. Etiquetar cada Store con QR/NFC.
3. Importar productos y mínimos.
4. Escanear desde móvil.
5. Registrar salida, entrada o ajuste.
6. Activar reposición cuando baja del mínimo.

La página actual ya explica esta lógica: cada almacén, furgoneta o cuarto técnico se convierte en una Store con su propio QR, y el equipo registra movimientos desde el terreno. ([TicTAP][1]) También comunica que no hace falta instalar app, solo escanear desde el móvil. ([TicTAP][1])

**Imagen recomendada:**

Capturas reales del producto, no solo ilustraciones. Aquí pondría:

* Pantalla de Store.
* Pantalla de selección de producto.
* Pantalla de mínimo/reposición.
* Dashboard de movimientos.

---

### Sección 5 — Modelos de partnership

**Título:**

> Tres formas de colaborar con TicTAP

**Modelo 1 — Pilotos con clientes clave**
El distribuidor propone TicTAP Stock a cuentas profesionales con almacenes, furgonetas o mantenimiento recurrente.

**Modelo 2 — Servicio digital de valor añadido**
El distribuidor ofrece TicTAP como herramienta complementaria para mejorar control, reposición y trazabilidad.

**Modelo 3 — Reposición conectada al distribuidor**
El cliente usa TicTAP para detectar necesidades de reposición y el distribuidor puede integrarse en ese flujo comercial.

La página actual ya menciona que TicTAP puede conectarse con ERP, compras y otros sistemas para sincronizar pedidos, recepciones y niveles de stock. ([TicTAP][1]) Esta idea es clave para distribuidores.

**Imagen recomendada:**

Tabla o tarjetas con los tres modelos. Visualmente claro, tipo:

```text
Pilot
Value-added service
Connected replenishment
```

---

### Sección 6 — Caso Yessss Electrical

Aquí no metería todo el caso. Pondría un resumen y enlazaría a la página específica.

**Título:**

> Ya estamos validando este modelo con un distribuidor eléctrico

**Texto sugerido:**

> Yessss Electrical está utilizando TicTAP Stock para validar cómo un distribuidor eléctrico puede aportar más control, trazabilidad y capacidad de reposición a entornos donde el stock está repartido entre almacenes, vehículos y puntos de trabajo.

Solo usaría esta afirmación si es real y tenéis permiso. Si aún no tenéis permiso para usar el logo o detalles, pondría:

> Estamos validando este modelo con un distribuidor eléctrico en UK, en un contexto muy parecido al de otros wholesalers europeos.

**CTA:**

> Leer caso Yessss Electrical

**Imagen recomendada:**

* Logo de Yessss Electrical, si tenéis permiso.
* Foto de almacén/furgoneta.
* Mockup con “Store”, “Replenishment”, “Movements”.
* Una cita del cliente si la podéis conseguir.

---

### Sección 7 — Qué gana cada parte

**Título:**

> Valor para el distribuidor, valor para el cliente profesional

Tabla:

| Distribuidor eléctrico                   | Cliente profesional           |
| ---------------------------------------- | ----------------------------- |
| Más fidelización                         | Menos roturas de stock        |
| Más oportunidades de reposición          | Menos compras duplicadas      |
| Diferenciación frente a otros mayoristas | Inventarios más rápidos       |
| Servicio digital de valor añadido        | Control desde cualquier móvil |
| Posible integración con ecommerce/ERP    | Trazabilidad de movimientos   |

---

### Sección 8 — Piloto recomendado

**Título:**

> Empieza con un piloto de bajo riesgo

**Propuesta:**

> Validamos el modelo con una cuenta profesional, una delegación o una categoría concreta antes de escalar.

**Formato de piloto:**

* 1 cliente profesional o 1 delegación.
* 1 almacén + 3-5 furgonetas.
* 50-100 referencias.
* Mínimos/máximos configurados.
* QR/NFC por ubicación.
* Medición de movimientos, reposiciones y adopción.

**CTA:**

> Diseñar un piloto conmigo

---

### Sección 9 — CTA final

**Título:**

> ¿Quieres explorar cómo TicTAP Stock puede encajar en tu propuesta para clientes profesionales?

**Texto:**

> Hablemos de tus clientes, tus categorías prioritarias y el modelo de colaboración que tendría más sentido para tu red.

**CTA:**

> Agendar conversación

---

# 4. Página 2: Caso de éxito Yessss Electrical

URL sugerida:

```text
/casos-de-exito/yessss-electrical-stock/
```

Esta página no debería vender mucho. Debería construir confianza.

## Estructura recomendada

### Hero

**Título:**

> Cómo Yessss Electrical está utilizando TicTAP Stock para llevar más control al stock distribuido

**Subtítulo:**

> Un caso de uso en distribución eléctrica para mejorar visibilidad, trazabilidad y reposición en entornos con almacenes, vehículos y material repartido.

**Imagen recomendada:**

* Logo Yessss Electrical.
* Foto real o contextual de almacén eléctrico.
* Mockup de TicTAP en móvil.

**Importante:** Solo usar logo, nombre y detalles si tenéis autorización.

---

### Sección 2 — Contexto

**Título:**

> El contexto: stock repartido, clientes profesionales y necesidad de control simple

Explicar:

* Quién es Yessss Electrical.
* Qué tipo de operación o cliente tiene.
* Por qué el control de stock es relevante.
* Qué problema concreto querían validar.

Aquí evitaría decir “tenían un problema grave” si no está aprobado. Mejor:

> Como muchos distribuidores eléctricos, Yessss Electrical opera en un entorno donde la disponibilidad, la trazabilidad y la reposición de material son claves para dar buen servicio a profesionales.

---

### Sección 3 — El reto

**Título:**

> El reto: hacer visible lo que ocurre en cada punto de stock

Bullets:

* Stock repartido en diferentes ubicaciones.
* Necesidad de registrar movimientos sin fricción.
* Reposición más ordenada.
* Información accesible desde campo.
* Sistema fácil de adoptar por perfiles no técnicos.

---

### Sección 4 — La solución implantada

**Título:**

> TicTAP Stock: Stores, QR/NFC y movimientos trazables

Explicar:

* Se crean Stores.
* Se etiquetan puntos de stock con QR/NFC.
* Se registran salidas, reposiciones y ajustes.
* Se configuran mínimos.
* Se centraliza la información.

Aquí puedes enlazar a `/stock/` para quien quiera ver el módulo completo.

---

### Sección 5 — Métricas

Esta sección es crítica.

No pondría métricas inventadas. Mejor dejar preparado el espacio y completarlo cuando las tengáis.

Métricas recomendadas:

| Métrica                                   | Por qué importa                  |
| ----------------------------------------- | -------------------------------- |
| Nº de Stores creadas                      | Mide alcance operativo           |
| Nº de referencias gestionadas             | Mide complejidad del inventario  |
| Nº de movimientos registrados             | Mide adopción real               |
| Nº de usuarios activos                    | Mide uso por equipo              |
| Tiempo medio por operación                | Mide facilidad de uso            |
| Nº de alertas de reposición generadas     | Mide valor comercial             |
| Reducción de roturas de stock             | Mide impacto operativo           |
| Reducción de compras duplicadas           | Mide ahorro                      |
| Nº de reposiciones iniciadas desde TicTAP | Mide potencial para distribuidor |

Si aún no tenéis suficientes datos, usaría una sección tipo:

> Métricas que estamos monitorizando

Eso es honesto y profesional.

---

### Sección 6 — Aprendizajes

**Título:**

> Qué estamos aprendiendo del caso Yessss Electrical

Ejemplos de aprendizajes:

* La adopción mejora cuando el técnico solo tiene que escanear un QR.
* El concepto de Store encaja bien con almacenes, vehículos y puntos de trabajo.
* Los mínimos/máximos ayudan a convertir consumo en reposición.
* El valor para el distribuidor no está solo en el software, sino en el servicio añadido al cliente.

---

### Sección 7 — Testimonio

Idealmente, una cita real.

Formato:

> “TicTAP nos ayuda a dar visibilidad al stock distribuido y a simplificar la forma en que nuestros clientes pueden controlar material y reposición.”

Pero no publiques una cita sin aprobación.

Si no tenéis testimonio todavía, sustituir por:

> Próximo paso: incorporar feedback operativo y métricas de adopción durante la fase de validación.

---

### Sección 8 — CTA para otros distribuidores

**Título:**

> ¿Quieres explorar un piloto similar para tu red de clientes profesionales?

**CTA:**

> Hablar sobre un piloto

**CTA secundario:**

> Ver solución para partners distribuidores

---

# 5. Cómo relacionarlas desde la home

En la home no metería un bloque enorme. Pondría un bloque corto dentro de “Soluciones” o “Casos de éxito”.

## Bloque sugerido en Home

**Título:**

> Stock digital para distribuidores y clientes profesionales

**Texto:**

> TicTAP Stock ayuda a controlar material en almacenes, furgonetas y puntos de trabajo mediante QR/NFC, sin apps. Estamos colaborando con distribuidores eléctricos para convertir el control de stock en una oportunidad de fidelización y reposición.

**CTAs:**

* Ver solución para distribuidores
* Leer caso Yessss Electrical

**Imagen:**

Una tarjeta visual con:

* “Stock para distribuidores eléctricos”
* “Caso Yessss Electrical”
* Mockup móvil con QR.

---

# 6. Cómo relacionarlas desde `/stock/`

La página actual `/stock/` ya funciona como página de producto. Yo no la convertiría en página de partners. Añadiría 2-3 bloques estratégicos.

## Bloque nuevo después de explicar “Reposición inteligente”

**Título:**

> ¿Eres distribuidor eléctrico o proveedor de material profesional?

**Texto:**

> TicTAP Stock también puede ayudarte a ofrecer a tus clientes una solución sencilla para controlar material, detectar necesidades de reposición y trabajar con más visibilidad en almacenes y furgonetas.

**CTA:**

> Ver modelo para distribuidores

---

## Bloque nuevo cerca de “Resultados”

**Título:**

> Caso en distribución eléctrica: Yessss Electrical

**Texto:**

> Estamos validando TicTAP Stock con Yessss Electrical para demostrar cómo el control de stock puede convertirse en un servicio de valor añadido para distribuidores eléctricos y sus clientes profesionales.

**CTA:**

> Leer caso de éxito

---

## FAQ nuevo

Añadiría una pregunta al final:

**¿TicTAP Stock puede ser ofrecido por distribuidores a sus propios clientes?**

Respuesta:

> Sí. TicTAP Stock puede implantarse como solución directa para empresas o como servicio de valor añadido ofrecido por distribuidores a clientes profesionales que necesitan controlar material en almacenes, vehículos o puntos de trabajo. Podemos definir pilotos, modelos de colaboración e integraciones con procesos comerciales o sistemas existentes.

---

# 7. Mensaje visual: qué imágenes pondría

Usaría 5 tipos de imagen:

## 1. Mundo real

Fotos de:

* Estanterías de material eléctrico.
* Furgonetas de técnicos.
* Almacenes pequeños.
* Instaladores escaneando QR.
* Cajas, consumibles, recambios.

Objetivo: que el distribuidor piense “esto es mi cliente”.

## 2. Producto en contexto

Mockups de móvil sobre imagen real:

* Escaneo QR.
* Store abierta.
* Stock Out.
* Replenish.
* Lista de reposición.

Objetivo: que entiendan el flujo en 5 segundos.

## 3. Partnership

Visual tipo ecosistema:

```text
Distribuidor
   ↓ ofrece
TicTAP Stock
   ↓ usa
Cliente profesional
   ↓ genera
Reposición / datos / recurrencia
```

## 4. Caso de éxito

Si Yessss lo permite:

* Logo.
* Foto real.
* Cita.
* Métricas.

## 5. Métricas

Cards visuales:

```text
X Stores
Y referencias
Z movimientos
N usuarios activos
```

Aunque al principio sean métricas de piloto, ayudan muchísimo.

---

# 8. El mensaje que debe repetirse en todas las páginas

Yo repetiría siempre esta idea, con variaciones:

> **TicTAP Stock ayuda a los distribuidores eléctricos a ofrecer a sus clientes profesionales una forma simple de controlar stock en almacenes y furgonetas, mejorando fidelización, reposición y servicio.**

Este es el núcleo.

No diría “queremos partners” como mensaje principal. Diría:

> **Queremos colaborar con distribuidores que quieran aportar más valor a sus clientes profesionales.**

Suena mucho mejor.

---

# 9. Mi recomendación final

Sí haría una landing específica, pero con esta jerarquía:

## Prioridad 1

Crear:

```text
/stock/partners-distribuidores/
```

Objetivo: que cualquier Product Manager de Sonepar, Saltoki, Rexel, Electro Stocks, Grupo Noria, etc. entienda en menos de 60 segundos:

* qué problema resuelve,
* por qué le interesa a un distribuidor,
* cómo se podría colaborar,
* qué siguiente paso propones.

## Prioridad 2

Crear:

```text
/casos-de-exito/yessss-electrical-stock/
```

Objetivo: confianza y prueba.

## Prioridad 3

Actualizar `/stock/` con CTAs hacia ambas páginas.

La clave es que la landing de partners sea la página que envías en prospección, mientras que `/stock/` queda como soporte funcional para quien quiera entender el módulo en detalle.

[1]: https://www.tictap.me/stock/ "Gestiona los activos de tu instalación o establecimiento"
