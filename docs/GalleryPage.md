# Gallery Page Documentation (`GalleryPage.jsx`)

The **Gallery Page** is a dedicated public showcase page displaying high-definition photos of construction, architecture, and interior design projects undertaken by Porchelvan Builders. It includes category filter buttons allowing prospects to focus on their specific areas of interest.

---

## 🎨 Page Structure & Layout
* **Navbar Integration**: Includes the global dynamic `<Navbar />` component with dark mode support.
* **Hero Banner (`.gallery-hero`)**: A full-width background cover displaying a construction-site image, text layout: *"Our Work"*, and secondary subtext.
* **Masonry Hover Effect**: Implements interactive cards. On hover:
  * The image slightly scales up (`transform: scale(1.05)`).
  * A gradient overlay slides in revealing category labels and project titles.

---

## 🛠️ Key Features

### 1. Interactive Category Filtering (`.gallery-filters`)
* Provides interactive filtering pills for seamless classification:
  * **All**: Displays all available items.
  * **Residential**: Custom homes, heritage villas, suburban housing.
  * **Commercial**: Tech hubs, office complexes, zenith shopping malls.
  * **Interior**: Modern kitchens, living rooms, corporate lobbies.

### 2. High-Quality Image Grid (`.gallery-grid`)
* Rendered via CSS Grid `repeat(auto-fill, minmax(300px, 1fr))` ensuring automatic responsiveness across all mobile, tablet, and widescreen layouts.
* Utilizes HTML5 lazy loading (`loading="lazy"`) to optimize database rendering and speed up visual presentation.

### 3. Comprehensive Branding Footer (`.footer-section`)
* Features a stylized, dark-themed footer (`#020617`) containing:
  * **PB Logo Mark & Branding** text.
  * **Social Media Icons**: Integrated SVGs for Instagram, Facebook, and LinkedIn.
  * **Quick Navigation links**: Home, Portfolio, and Admin Portal.
  * **Contact Details list**: Physical Chennai address, phone numbers, email address, and operating hours.

---

## 💾 Image Dataset Schema (Hardcoded Mock Assets)
The page renders items conforming to the following structure:
```javascript
{
  id: 1,
  category: 'Residential',
  src: 'https://images.unsplash.com/...',
  alt: 'Heritage Villa'
}
```
* **Performance Note**: The images are fetched dynamically from optimized, compressed URLs hosted on Unsplash.
