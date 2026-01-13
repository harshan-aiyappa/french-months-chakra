# Vocalis UI/UX Color Consistency Plan

## Core Color Palette (Light Theme Only)

### Primary Colors
- **Brand Primary**: `#594ce6` (Indigo - Main brand color)
- **Brand Secondary**: `#7c72ff` (Light Purple - Accents)
- **Cyan Accent**: `#38bdf8` (For Login screen background)

### Semantic Colors
- **Success**: `#10B981` (Green - Positive feedback)
- **Warning**: `#F59E0B` (Orange - Alerts)
- **Error**: `#EF4444` (Red - Errors)
- **Info**: `#3B82F6` (Blue - Information)

### Neutral Colors (Light Theme)
- **Background Main**: `#f6f6f8` (Very light gray)
- **Background Alt**: `#e8f4f8` (Light cyan tint)
- **Card Background**: `white` with glassmorphism
- **Text Primary**: `gray.900` (#1A202C)
- **Text Secondary**: `gray.600` (#718096)
- **Text Muted**: `gray.400` (#CBD5E1)
- **Border**: `gray.200` (#E2E8F0)
- **Border Light**: `gray.100` (#F7FAFC)

### Glassmorphism Effects
- **Glass Card**: `rgba(255, 255, 255, 0.7)` + blur(16px)
- **Glass Nav**: `rgba(255, 255, 255, 0.9)` + blur(30px)
- **Glass Panel**: `rgba(255, 255, 255, 0.6)` + blur(12px)

---

## Screen-by-Screen Audit

### ✅ LoginScreen.jsx
- [x] Background: `#e8f4f8`
- [x] Left panel: Cyan gradient (`#7dd3fc`, `#38bdf8`, `#0ea5e9`)
- [x] Right panel: `white`
- [x] Form inputs: `gray.50` bg, `gray.200` border
- [x] Primary button: Brand gradient
- [x] Text colors: Proper light theme

### ✅ DashboardHome.jsx
- [x] Ensure all text uses `gray.900` for headings
- [x] Ensure all secondary text uses `gray.600`
- [x] Stats cards consistent colors
- [x] Practice mode cards use semantic colors
- [x] CTA gradient uses brand colors

### ✅ SettingsScreen.jsx
- [x] Background: Should match `#f6f6f8`
- [x] Card backgrounds: `white` with glass effect
- [x] Text consistency
- [x] Form controls follow theme

### ✅ AppLayout.jsx
- [x] Sidebar: Glass nav effect
- [x] Nav items: `gray.600` inactive, `white` + `brand.500` bg active
- [x] Search bar: Proper light theme
- [x] User avatar border: `brand.500`

### ✅ GameUnit Screens (StartScreen, CalibrationScreen, GameScreen, MCQScreen, ResultsScreen)
- [x] All should respect light theme
- [x] Consistent glassmorphism
- [x] Proper text contrast
- [x] Brand color usage for CTAs

---

## Implementation Checklist

1. **Update theme.js** - ✅ Complete
2. **LoginScreen** - ✅ Complete
3. **DashboardHome** - ✅ Complete
4. **AppLayout** - ✅ Complete
5. **SettingsScreen** - ✅ Complete
6. **Game Screens** - ✅ Complete
7. **Verify Contrast** - ✅ Complete

---

## Component-Level Standards

### Headings
```jsx
<Heading color={useColorModeValue('gray.900', 'white')}>
```

### Body Text
```jsx
<Text color={useColorModeValue('gray.600', 'gray.400')}>
```

### Buttons (Primary)
```jsx
<Button 
  bgGradient="linear(to-r, brand.500, #7c72ff)"
  color="white"
>
```

### Buttons (Secondary)
```jsx
<Button 
  variant="outline"
  borderColor={useColorModeValue('gray.200', 'whiteAlpha.200')}
  color={useColorModeValue('gray.700', 'white')}
>
```

### Input Fields
```jsx
<Input
  bg={useColorModeValue('gray.50', 'whiteAlpha.50')}
  borderColor={useColorModeValue('gray.200', 'whiteAlpha.100')}
  color={useColorModeValue('gray.900', 'white')}
  _focus={{ borderColor: 'brand.500' }}
/>
```

### Cards
```jsx
<Box
  className="glass-card"
  bg={useColorModeValue('white', 'whiteAlpha.50')}
>
```

---

## Status
- LoginScreen: ✅ Complete
- DashboardHome: ✅ Complete
- AppLayout: ✅ Complete
- SettingsScreen: ✅ Complete
- Game Screens: ✅ Complete
