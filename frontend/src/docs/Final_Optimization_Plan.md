# Final Optimization & Standardization Plan

## Objective
Ensure the Vocalis codebase is fully optimized, visually consistent, and robust, with a specific focus on asset standardization and solid UI design.

## 1. Asset Standardization (Immediate Action)
- [x] **Profile Icons:** Replace all hardcoded/broken URLs and generic placeholders with the verified local asset: `/assets/personIcon.png`.
- [x] **Locations:** Update `AppLayout.jsx`, `AuthContext.jsx`, and any `Avatar` component usage.

## 2. Code Optimization & Stability
- [x] **ASR Stability:** Verified `useUnifiedASR` and `useSpeechRecognition` hooks are now stable using `useMemo` and `useRef`.
- [x] **Cleanup:** Remove debug `console.log` statements from production paths (keep critical flow logs).
- [x] **Unused Code:** Scan for and remove unused imports or commented-out blocks (e.g., old glassmorphism styles).

## 3. UI/UX Standardization (Premium Solid)
- [x] **Glassmorphism Removal:** Verified major screens (`GameScreen`, `MCQScreen`, `Dashboard`, `Header`) use solid backgrounds.
- [x] **Spacing & Layout:** Verify consistent padding/margins in `AppLayout` to reduce "white space" gaps (already adjusted, will double-check).
- [x] **Feedback:** Ensure all interactive elements (buttons, inputs) have consistent hover/active states.

## 4. Validation Steps
1.  **Visual Check:** Navigate to Dashboard -> Check Avatar.
2.  **Flow Check:** Complete one full Speaking Session -> Check "Next" flow.
3.  **Flow Check:** Complete one full MCQ Session -> Check TTS and Result flow.
4.  **Error Check:** Monitor console for any remaining "unmount" or "404" errors.
