# 🎯 **CLAUDE CODE PROMPT - CONCISE & FOCUSED**

Fix content alignment on zoom - everything must stay centered at any zoom level (50%-200%)

PROBLEM: Skills, projects, and blog sections shift left/right when zooming

ROOT CAUSE: Missing centered container wrappers with max-width

FILES TO FIX:
1. index.html - Add .container wrapper to sections
2. css/layouts.css - Create/update container styles
3. css/skills-enhanced.css - Remove width: 100vw
4. css/project-cards-minimal.css - Remove width: 100vw

REQUIRED CHANGES:

1. CREATE/UPDATE css/layouts.css:
```css
.container {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
}
```

2. WRAP ALL SECTIONS in index.html:

Find: <section id="skills" class="skills-section">
Ensure it has: <div class="container"> wrapping all content

Find: <section class="featured-projects">
Ensure it has: <div class="container"> wrapping all content

Find: <div id="projects" class="page">
Ensure it has: <div class="container"> wrapping all content

Find: <section class="blog-section">
Ensure it has: <div class="container"> wrapping all content

3. REMOVE from ALL CSS files:
- width: 100vw (causes zoom issues)
- Any absolute positioning with vw units
- Replace with: width: 100%

4. ADD to html/body:
```css
html, body {
    overflow-x: hidden;
    max-width: 100vw;
}
```

5. FIX background decorations:
```css
.section::before {
    left: 50%;
    transform: translateX(-50%);
    max-width: 90vw;
}
```

TEST: Content must stay centered at 50%, 100%, 150%, 200% zoom (Ctrl+/-)

CRITICAL: Every section needs <div class="container"> wrapper. Container has max-width: 1400px and margin: 0 auto.

Look at test-zoom-alignment.html for correct implementation pattern.
```

