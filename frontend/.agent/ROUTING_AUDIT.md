# Routing System Audit & Fix Plan

## Current Routing Setup

### App.jsx Routes
```javascript
case 'dashboard': → DashboardHome
case 'lessons': → GameUnit (ORPHAN - not in nav)
case 'settings': → SettingsScreen
// case 'analytics': COMMENTED OUT
```

### AppLayout.jsx Navigation
```javascript
- Dashboard (active)
- Settings (active)
// - Analytics (commented out)
// - Lessons (commented out)
```

### DashboardHome.jsx Flow
```javascript
Click practice mode → setIsPracticing(true) → Renders GameUnit inline
```

---

## ⚠️ Issues Found

1. **Orphan Route**: `'lessons'` route exists in App.jsx but not accessible from sidebar
2. **Double GameUnit**: GameUnit rendered both:
   - As a route in App.jsx (`case 'lessons'`)
   - Inline in DashboardHome (when `isPracticing === true`)
3. **Navigation Confusion**: Users clicking practice modes stay on Dashboard route but see GameUnit
4. **Back Navigation**: No way to return to Dashboard from GameUnit

---

## ✅ Recommended Fix

### Option 1: Keep Inline (Current Approach)
- Remove `'lessons'` route from App.jsx
- DashboardHome manages GameUnit state internally
- Add "Back to Dashboard" button in GameUnit

### Option 2: Use Proper Routing
- Keep `'lessons'` route in App.jsx
- DashboardHome clicks trigger `onNavigate('lessons')`
- Cleaner separation, proper route management

**Recommendation**: **Option 2** - Proper routing is cleaner

---

## Implementation Plan

### Step 1: Update DashboardHome
Change practice mode clicks to use navigation prop:
```javascript
const PracticeModeCard = ({ onClick }) => {
  // onClick should call onNavigate('lessons')
}
```

### Step 2: Pass navigation to DashboardHome
```javascript
// App.jsx
<DashboardHome onNavigate={setCurrentView} />
```

### Step 3: Add Back Button in GameUnit/Header
```javascript
<Button onClick={() => onNavigate('dashboard')}>
  Back to Dashboard
</Button>
```

### Step 4: Clean up App.jsx
Keep all routes clean and functional:
```javascript
case 'dashboard': → DashboardHome
case 'practice': → GameUnit // Rename from 'lessons'
case 'settings': → SettingsScreen
```

---

## Current State
- ❌ Routes are inconsistent
- ❌ Navigation logic mixed (inline + routes)
- ❌ No back button from GameUnit
- ✅ Login/Auth working
- ✅ Dashboard/Settings navigation working

## After Fix
- ✅ Clean route separation
- ✅ Proper navigation flow
- ✅ Back button from practice
- ✅ Consistent routing pattern

---

**Status**: Needs Fixing
**Priority**: High
**Recommendation**: Use proper routing instead of inline rendering
