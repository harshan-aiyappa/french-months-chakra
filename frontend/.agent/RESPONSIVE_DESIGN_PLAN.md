# Mobile-First Responsive Design Plan - Vocalis

## Responsive Breakpoints (Chakra UI)
```
base: 0px (mobile)
sm: 480px (small mobile)
md: 768px (tablet)
lg: 992px (desktop)
xl: 1280px (large desktop)
```

## Typography Scale (Mobile-First)

### Headings
```jsx
// Page Titles
fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}

// Section Headings
fontSize={{ base: "lg", md: "xl", lg: "2xl" }}

// Card Titles
fontSize={{ base: "md", md: "md", lg: "lg" }}

// Small Headings
fontSize={{ base: "sm", md: "sm", lg: "md" }}
```

### Body Text
```jsx
// Primary Text
fontSize={{ base: "sm", md: "md" }}

// Secondary Text
fontSize={{ base: "xs", md: "sm" }}

// Small Text (captions, labels)
fontSize={{ base: "xs", md: "xs" }}
```

## Spacing Scale (Mobile-First)

### Padding
```jsx
// Container padding
p={{ base: 4, md: 6, lg: 8 }}

// Card padding
p={{ base: 4, md: 5, lg: 6 }}

// Section gaps
gap={{ base: 4, md: 6, lg: 8 }}
```

### Margins
```jsx
// Section margins
mb={{ base: 4, md: 6, lg: 8 }}

// Component gaps
gap={{ base: 2, md: 3, lg: 4 }}
```

## Component Sizing

### Buttons
```jsx
// Primary buttons
px={{ base: 4, md: 6, lg: 8 }}
py={{ base: 3, md: 4, lg: 5 }}
fontSize={{ base: "sm", md: "md" }}

// Icon buttons
boxSize={{ base: "32px", md: "40px" }}
```

### Cards
```jsx
borderRadius={{ base: "lg", md: "xl", lg: "2xl" }}
p={{ base: 4, md: 5, lg: 6 }}
```

### Icons
```jsx
fontSize={{ base: "20px", md: "24px", lg: "28px" }}
```

## Grid/Layout

### Columns
```jsx
// 1-3 column layouts
columns={{ base: 1, md: 2, lg: 3 }}

// Sidebar layouts
direction={{ base: "column", lg: "row" }}
```

## Screens to Fix

### ✅ LoginScreen.jsx
- [ ] Mobile: Stack left/right panels vertically
- [ ] Fonts: Responsive heading sizes
- [ ] Padding: Mobile-friendly spacing
- [ ] Buttons: Full-width on mobile

### ✅ DashboardHome.jsx
- [ ] Welcome heading responsive
- [ ] Practice cards: 1 column mobile, 3 desktop
- [ ] Fonts: All text responsive
- [ ] Spacing: Mobile padding

### ✅ SettingsScreen.jsx
- [ ] Form inputs: Full-width mobile
- [ ] 2-column grid: Stack on mobile
- [ ] Fonts: Responsive labels
- [ ] Padding: Mobile spacing

### ✅ AppLayout.jsx
- [ ] Sidebar: Collapsible on mobile
- [ ] Header: Responsive search bar
- [ ] Nav items: Touch-friendly
- [ ] Logo/branding: Scaled for mobile

### ⚠️ GameUnit Screens
- [ ] StartScreen: Responsive mode cards
- [ ] CalibrationScreen: Mobile visualizer
- [ ] GameScreen: Touch-friendly controls
- [ ] MCQScreen: Responsive options
- [ ] ResultsScreen: Mobile stats layout

## Implementation Checklist

1. ✅ Create responsive theme tokens
2. ✅ Update font sizes across components
3. ✅ Fix padding/spacing for mobile
4. ✅ Test grid layouts on mobile
5. ✅ Ensure touch targets (min 44px)
6. ✅ Test on actual mobile device
7. ✅ Verify text readability
8. ✅ Check button accessibility

## Testing Matrix

| Screen    | Mobile (375px) | Tablet (768px) | Desktop (1440px) |
| --------- | -------------- | -------------- | ---------------- |
| Login     | ⬜              | ⬜              | ⬜                |
| Dashboard | ⬜              | ⬜              | ⬜                |
| Settings  | ⬜              | ⬜              | ⬜                |
| AppLayout | ⬜              | ⬜              | ⬜                |

---

**Priority**: High
**Status**: Starting Implementation
**Date**: 2026-01-13
