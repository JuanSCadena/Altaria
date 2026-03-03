# Guía de Diseño de Marca Profesional (Brand Guidelines)

> **Cuidado:** Este documento debe ser la fuente única de verdad para la identidad visual y comunicacional de este proyecto. Si un color o tipografía definido aquí no concuerda con lo implementado en `tailwind.config.ts` o los componentes, el diseño está inconsistente.

## 1. Identidad Central (Core Identity)
- **Misión de la Marca:** [Define el porqué existimos y qué problema real resolvemos]
- **Visión:** [Hacia dónde vamos a largo plazo]
- **Voz y Tono:** [Ej. Directo, premium, técnico, sin disculpas. Nunca uses lenguaje pasivo o complaciente.]
- **Arquetipo de Marca:** [Ej. El Sabio, El Creador, El Gobernante - Esto dicta cómo actuamos visualmente]

## 2. Paleta de Colores (Color System)
> **Regla Crítica:** Nunca usar colores por defecto del navegador o genéricos. Todos los colores deben ser intencionados y ajustados (ej. evitar negro puro `#000000`, usar un negro entintado `#0A0A0B`).

| Token | Hex / HSL | Uso Principal |
| :--- | :--- | :--- |
| **`primary`** | `[Color]` | Botones CTA, elementos de alto énfasis, interacciones principales. |
| **`secondary`** | `[Color]` | Elementos de soporte, fondos secundarios, navegación. |
| **`accent`** | `[Color]` | Detalles, alertas, elementos diferenciadores (ej. un rojo vino premium). |
| **`background`** | `[Color]` | Fondos de página principales (Base). |
| **`foreground`** | `[Color]` | Texto principal y alta jerarquía (contraste óptimo). |
| **`muted`** | `[Color]` | Texto secundario, bordes, elementos deshabilitados (bajo énfasis). |

## 3. Tipografía (Typography System)
- **Fuente Principal (Headings):** [Ej. Inter, Roboto, Outfit, Bricolage Grotesque]
  - *Uso:* Pesos Bold/Black para impacto visual.
- **Fuente Secundaria (Body):** [Ej. Inter o una alternativa Serif para contraste editorial]
  - *Uso:* Lecturabilidad extrema en bloques largos de texto, peso Regular/Medium.

**Jerarquía Escalar Base:**
- `h1`: [Móvil: Ej. 2.5rem] / [Desktop: Ej. 4rem] - Line Height: `tight` (1.1 - 1.2)
- `h2`: [Móvil: Ej. 2rem] / [Desktop: Ej. 3rem] - Line Height: `tight`
- `body`: [Móvil/Desktop: 1rem (16px)] - Line Height: `relaxed` (1.6)

## 4. Sistema de Espaciado y Layout (Grid & Spacing)
- **Escala de Espaciado:** Usar múltiplos de 4px (0.25rem) u 8px (0.5rem) estrictamente.
- **Contenedor Máximo (Max Width):** [Ej. 1200px / 1440px para mantener contención premium]
- **Márgenes Laterales Base (Gutter):** [Ej. Móvil: 16px / Desktop: 64px]

## 5. Primitivas de Interfaz (UI Primitives)
- **Bordes (Border Radius):** [Ej. Cuadrados `0px` para un estilo brutalista/arquitectónico, o redondeados `8px` / `999px` para algo amigable y moderno].
- **Sombras (Shadows/Elevations):** [Evitar sombras grises estándar (`box-shadow: 0 4px 6px rgba(0,0,0,0.1)`). Preferir sombras suaves, direccionales y tintadas (blend-modes) con el color de fondo para profundidad hiperrealista].
- **Efectos Globales:** [¿Uso de Glassmorphism en navegaciones? ¿Bordes con gradientes? Documentar estilo aquí].

## 6. Movimiento y Animaciones (Motion & Interactions)
- **Transiciones Base:** [Ej. `ease-[cubic-bezier(0.25,1,0.5,1)]`, 200ms para hovers, 500-800ms para entradas de sección].
- **Micro-interacciones:** [Qué ocurre al hacer hover en botones (Escala, cambio de color, rebote) o enlaces].
- **Carga de Página / Scroll:** [Efectos permitidos, ej. reveal por opacidad y transform, parallax sutil. Evitar movimientos caóticos que mareen al usuario].

## 7. Fotografía y Dirección de Arte
- **Estilo Visual:** [Ej. Minimalista, Premium, Alto Contraste, Tonos monocromáticos con acentos de color].
- **Tratamiento de Imagen:** [Especificar el uso de superposiciones oscuras (overlays) para asegurar legibilidad del texto superior, recortes, filtros].
- **Regla Negativa (Lo que NO se hace):** [Ej. Evitar a toda costa fotos de stock corporativas genéricas o ilustraciones de vectores planos (flat design abusivo)].
