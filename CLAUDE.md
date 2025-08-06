# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hurricane Milton 6-Month Report - An interactive web presentation showcasing American Red Cross disaster response. Built as a static single-page application optimized for embedding in ArcGIS Experience Builder and other platforms.

## Commands & Development Workflow

### Local Development
```bash
# No build process required - open directly in browser
open index.html

# Or use a local server (if you have Python installed)
python3 -m http.server 8000
# Then navigate to http://localhost:8000

# Test iframe embedding
open test-embed.html
```

### Deployment
```bash
# Deploy to GitHub Pages
./push-to-github.sh

# Deploy to Vercel
# Import repository at vercel.com or use Vercel CLI
```

## Architecture & Key Files

### Core Files
- `index.html` - Main presentation with all content sections
- `style.css` - Complete styling with responsive design and animations
- `script.js` - Interactive functionality (charts, animations, calculators)

### Key Dependencies (CDN)
- Chart.js - Data visualizations
- Font Awesome 6.4.0 - Icons
- Google Fonts (Inter) - Typography

### Important Features to Maintain
1. **Iframe Embedding Support** - Must work embedded in ArcGIS Experience Builder
2. **Responsive Design** - Adapts to any container size
3. **Scroll Animations** - Intersection Observer triggers animations on scroll
4. **Interactive Elements**:
   - Donation calculator with real-time impact calculations
   - Timeline chart showing assistance over months
   - Animated statistics counters
   - Interactive map with pulsing markers

### Key Metrics in Content
- 500,000+ meals served
- 153,300+ overnight shelter stays
- $6.6 million in financial assistance
- 13,000 people helped
- 2,500+ volunteers

## Development Guidelines

### When Making Changes
1. Test in both standalone and iframe modes (use test-embed.html)
2. Maintain responsive behavior - test at different viewport sizes
3. Keep animations smooth and performance-optimized
4. Preserve accessibility features (ARIA labels, semantic HTML)

### CSS Variables
The design uses CSS custom properties for theming:
- `--red-cross-red: #ED1B2E`
- `--red-cross-dark: #6D0011`
- Various spacing and animation variables

### JavaScript Patterns
- Event-driven architecture with DOM listeners
- Modular functions for each feature
- Intersection Observer for scroll-triggered animations
- No framework dependencies - pure vanilla JS

### Vercel Configuration
The `vercel.json` enables iframe embedding:
```json
{
  "headers": [{
    "source": "/(.*)",
    "headers": [{
      "key": "X-Frame-Options",
      "value": "ALLOWALL"
    }]
  }]
}
```