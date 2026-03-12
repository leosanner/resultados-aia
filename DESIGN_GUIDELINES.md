# Design Guidelines — Interface Inspired by Petrobras Socio-Environmental Portal

## 1. Objective

This document defines the visual and structural design patterns that should be followed to reproduce an interface inspired by the Petrobras socio-environmental portal.

The goal is not to copy the website but to abstract its **visual language, layout logic, and component patterns** so that an AI agent or automated UI generator can construct pages with the same visual coherence and hierarchy.

The design prioritizes:

- Visual clarity
- Information hierarchy
- Strong environmental visual identity
- Data-driven visualization
- Modular UI components
- Map-based spatial exploration

---

# 2. Visual Identity

## 2.1 Design Principles

The interface follows these main principles:

**Institutional credibility**

- Clean layout
- Clear typography
- Strong hierarchy
- Structured grid

**Environmental theme**

- Dominant green palette
- Nature-inspired tones
- Soft gradients

**Data visualization emphasis**

- Cards summarizing metrics
- Charts and maps
- Large numerical highlights

**Accessible layout**

- Large typography
- Clear contrast
- Structured sections

---

# 3. Color Palette

The visual identity strongly relies on **green as the primary color**, supported by neutral backgrounds and accent colors.

## 3.1 Primary Colors

| Token         | Description       | Approx Color |
| ------------- | ----------------- | ------------ |
| Primary Green | Brand highlight   | `#0C7C3C`    |
| Dark Green    | Headers / accents | `#085E2E`    |
| Light Green   | Tags / highlights | `#27AE60`    |

## 3.2 Secondary Colors

| Token           | Description                     |
| --------------- | ------------------------------- |
| Yellow Accent   | Important indicators / emphasis |
| Blue Background | Map section / data panels       |
| Gray Background | Neutral section separation      |

Approximate values:

```
Green: #0C7C3C
Dark Green: #085E2E
Light Green: #27AE60
Yellow: #F2C94C
Blue Panel: #1F6F8B
Light Gray: #F5F5F5
Border Gray: #E0E0E0
Text Dark: #2B2B2B
```

---

# 4. Typography

The typography follows a **modern, readable sans-serif style**, typical of institutional and corporate interfaces.

Recommended font families:

```
Primary: Inter
Fallback: Helvetica / Arial / sans-serif
```

## 4.1 Typographic Scale

| Element        | Size    | Weight   |
| -------------- | ------- | -------- |
| Hero Title     | 36–48px | Bold     |
| Section Title  | 24–28px | Semibold |
| Card Title     | 16–18px | Semibold |
| Body Text      | 14–16px | Regular  |
| Metric Numbers | 28–40px | Bold     |
| Small Labels   | 12–13px | Medium   |

## 4.2 Typography Behavior

Titles should:

- be short
- be high contrast
- follow sentence case

Body text:

- limited to 2–3 lines in cards
- neutral gray color
- line height ~1.5

---

# 5. Layout System

## 5.1 Grid Structure

The interface follows a **12-column responsive grid**.

Desktop:

```
|----12 columns----|
```

Typical patterns:

- Cards: 3 or 4 per row
- Dashboard blocks: 2 columns
- Map layout: 40% panel / 60% map

Spacing:

```
Section padding: 80px
Component spacing: 24px
Card padding: 20–24px
```

---

# 6. Core Layout Sections

Pages are composed of modular sections.

Typical structure:

```
Hero Section
Highlights / Featured Content
Interactive Data Dashboard
Map Visualization
Project Cards
Additional Resources
Footer
```

---

# 7. Hero Section

## Structure

The hero area contains:

- Large background image
- Title
- Short description
- Primary CTA button

Layout:

```
[ Background Image ]

Title
Description

[ Primary Button ]
```

## Design Characteristics

- Dark overlay on background image
- White typography
- Large visual presence
- Center or left alignment

CTA Button:

```
Green background
White text
Rounded corners
```

---

# 8. Dashboard / Metrics Panel

A key visual component is the **data metrics panel**.

This section contains **cards displaying numerical statistics**.

Example metrics:

- investment values
- number of projects
- environmental impact metrics
- workforce numbers
- research initiatives

## Component Structure

```
+----------------------+
| Metric Title         |
|                      |
|  LARGE NUMBER       |
|                      |
| Additional context   |
+----------------------+
```

## Visual Rules

- White card background
- Rounded corners
- Subtle shadow
- Icon or circular progress indicator

---

# 9. Map Visualization Section

The interface prominently features a **geographic map with data points**.

## Layout

```
+----------------+---------------------+
| Statistics     |                     |
| Cards Panel    |                     |
|                |      Map            |
|                |                     |
+----------------+---------------------+
```

## Map Characteristics

- Country level visualization
- Location markers
- Marker clustering
- Color coded markers

Marker colors:

```
Green → environmental projects
Yellow → social projects
```

---

# 10. Card Components

Cards are heavily used to present content.

Examples:

- Projects
- Articles
- News
- Resources

## Card Layout

```
+----------------------+
| Image / Illustration |
|                      |
| Category Tag         |
| Title                |
| Short description    |
+----------------------+
```

## Card Features

Cards may include:

- tags
- small icons
- hover effect
- click navigation

Hover interaction:

```
- slight elevation
- subtle shadow increase
- cursor pointer
```

---

# 11. Category Tags

Small labels appear above titles.

Examples:

```
Ambiental
Social
Pesquisa
```

Design rules:

```
Font size: 12px
Rounded background
High contrast color
Small padding
```

Examples:

```
Green tag → Environmental
Yellow tag → Social
```

---

# 12. Buttons

Primary buttons follow a consistent style.

Primary button:

```
Background: Green
Text: White
Padding: 10px 18px
Border radius: 6px
```

Secondary button:

```
Border: Green
Text: Green
Background: Transparent
```

Hover effect:

```
Slight darkening
Smooth transition
```

---

# 13. Carousel Components

Some sections use horizontal scrolling components.

Examples:

- news
- highlights
- featured content

Characteristics:

```
Horizontal scroll
Arrow navigation
Cards partially visible
```

Spacing between cards:

```
16px–24px
```

---

# 14. Data Visualization

Metrics and analytics often include:

- circular indicators
- progress bars
- percentages
- mini charts

Common patterns:

```
Circular progress charts
Donut charts
Horizontal progress bars
```

Colors follow the palette:

```
Green → environmental
Yellow → social
Blue → neutral analytics
```

---

# 15. Footer

Footer structure:

```
Logo
Navigation columns
Contact links
Social media icons
Search field
```

Footer characteristics:

- neutral background
- small typography
- organized columns

---

# 16. Iconography

Icons are simple and minimal.

Preferred style:

```
Outline icons
Thin stroke
Rounded corners
Monochrome or green accent
```

Common icon types:

- environmental symbols
- charts
- research
- navigation

---

# 17. Motion and Interactions

Animations should be subtle.

Allowed behaviors:

```
Card hover elevation
Button hover transitions
Carousel slide animations
Map marker hover highlight
```

Avoid:

```
Heavy animations
Distracting motion
```

---

# 18. Responsiveness

Responsive behavior must support:

Desktop
Tablet
Mobile

### Mobile Layout Changes

- Map moves below metrics
- Cards become vertical stack
- Navigation collapses into menu

---

# 19. Accessibility

Accessibility rules:

- High color contrast
- Readable font sizes
- Click targets > 40px
- Clear navigation hierarchy

---

# 20. Component Summary

Main UI components required:

```
Hero Banner
Metric Cards
Interactive Map
Project Cards
News Carousel
Category Tags
Primary Buttons
Footer Navigation
Dashboard Metrics
```

---

# 21. Expected Visual Result

When implemented correctly, the interface should convey:

- Institutional credibility
- Environmental focus
- Data-driven storytelling
- Clear exploration of projects and research initiatives
- Modern corporate design

The visual outcome should resemble a **modern environmental dashboard combined with a public institutional portal**.

---

End of design guidelines.
