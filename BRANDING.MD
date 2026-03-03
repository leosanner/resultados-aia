# BRANDING & UI DESIGN SYSTEM: Eco-Tech Minimalist

This document defines the visual style guide for the application's interface refactoring. The goal is to migrate the current design to a modern, clean, and eco-friendly aesthetic, based on the provided visual references (referencing "Clover" and "NatureRoot" styles).

## ⚠️ PRIMARY GUIDELINES (READ BEFORE CHANGING)

1.  **Evolution, not Revolution:** Keep the functional structure, routes, and business logic of the current application intact.
2.  **Layout Preservation:** Do not alter the macro positioning of elements (header, sidebar, main content) unless strictly necessary for visual alignment.
3.  **Focus on CSS/Style:** Changes must concentrate on colors, typography, spacing (padding/margin), borders, and shadows.
4.  **Consistency:** Apply the design tokens defined below globally.

---

## 1. Color Palette

The design utilizes high contrast between light/white backgrounds and deep forest green sections, with vibrant green accents.

### Base Colors

- **Main Background:** `#FFFFFF` (Pure White) or `#FAFAFA` (Very subtle Off-white for content areas).
- **Secondary Background (Hero/Footer):** `#0B281F` (Deep Forest Green - _Ref: NatureRoot Hero_).
- **Surfaces (Cards):** `#FFFFFF` with soft shadows or `#F3F5F4` (Pale Greenish Gray).

### Action & Text Colors

- **Primary Brand (Buttons/Highlights):** `#2ECC71` to `#28A745` (Vibrant Leaf Green - _Ref: Clover Button_).
- **Text Primary:** `#111111` (Almost absolute Black for headings).
- **Text Secondary:** `#4A5568` (Medium Gray for paragraphs).
- **Text On Dark:** `#FFFFFF` (Text over Forest Green backgrounds).

---

## 2. Typography

Typography must convey modernity and clarity.

- **Font Family (Headings):** Geometric Sans-serif or Grotesque (e.g., _Inter, DM Sans, or Plus Jakarta Sans_).
  - _Style:_ Bold (Bold/Extrabold), slightly tight tracking.
  - _Usage:_ Large headings, highlight numbers (e.g., "01", "5,000").
- **Font Family (Body):** Clean and legible Sans-serif (e.g., _Inter, Roboto_).
  - _Style:_ Regular weight, generous line height (1.6 or greater) for readability.

---

## 3. Shapes & Borders (Radius)

The interface should avoid sharp corners. Softness is key.

- **Buttons:** Pill-shape or full rounding (`border-radius: 9999px`).
- **Cards and Containers:** Expressive rounding.
  - _Standard:_ `20px` to `24px` (similar to `rounded-2xl` or `3xl` in Tailwind).
- **Images:** Must follow the card rounding. In highlight sections, use organic masks or "squircles" if possible.

---

## 4. UI Components

### Buttons

- **Primary:** Vibrant Green Background (`#2ECC71`), White Text, Pill Shape. No border.
- **Secondary/Outline:** Transparent Background, Thin Gray or Dark Green Border, Dark Text.
- **Icons in Buttons:** If an icon exists (arrows), use a white circle inside the green button to contain the icon (_Ref: Clover_).

### Cards (Bento Grid Style)

- Inspired by the "Bento" style (well-defined rectangular grids).
- **Style 1 (Clean):** White background, ultra-light diffuse shadow (`box-shadow: 0 4px 20px rgba(0,0,0,0.05)`), generous internal padding (32px+).
- **Style 2 (Dark):** Forest Green background, white text, light green icons.

### Navigation Elements

- **Header:** Transparent or solid white background.
- **Menu Item:** Black text, medium weight.
- **CTA in Header:** Vibrant green pill button aligned to the right.

---

## 5. Spacing & Layout

- **Whitespace:** Use EXTENSIVE whitespace. Do not be afraid to leave breathing room between sections (margin-y: 80px to 120px on desktop).
- **Grids:** Utilize CSS Grid to align information cards and images.
- **Alignment:** Keep titles and call-to-action texts left-aligned, creating a clear vertical reading line.

---

## 6. Iconography & Images

- **Icons:** Thin lines or minimalist filled styles. Should often be placed inside circles (icon containers).
- **Photography:** Editorial style, natural, high quality. If the application lacks images, use placeholders with green tones and abstract nature themes.
