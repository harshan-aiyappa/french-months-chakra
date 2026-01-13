# Validation & Fix Plan: Game Flow & UI/UX

## Objective
Resolve the "stuck" state in the game loop and ensure a smooth, premium UI/UX experience for all practice modes (Speaking, MCQ, Mixed).

## 1. Technical Flow Validation (GameUnit.jsx)

### A. State Management & transitions
- [ ] **Issue:** `GameUnit` appears to be unmounting/remounting unexpectedly (logs show repeated "Unmounting").
- [ ] **Check:** `App.jsx` routing and `DashboardHome` navigation. Ensure `useParams` usage in `GameUnit` doesn't cause loop.
- [ ] **Check:** `currentIndex` advancement logic in `handleNextActivity`.
- [ ] **Check:** `sessionResults` update logic in `handleSpeechResult` / `handleMCQAnswer`.

### B. Game Logic Loop
1.  **Start:** `useEffect` initializes game. -> **Validate:** Does it respect `modeId` logic?
2.  **Input:** User speaks or selects MCQ option.
3.  **Process:** ASR/Check Logic runs.
4.  **Result:** Result is stored in Redux/Local state.
5.  **Feedback:** UI shows Success/Fail.
6.  **Next:** User clicks "Next/Continue". -> **Validate:** Does `nextPrompt` actually increment index is it stuck?

## 2. UI/UX Validation & Refinement

### A. GameScreen (Speaking)
- [ ] **Stop Button:** Ensure "Stop Listening" works and triggers processing immediately.
- [ ] **Next Button:** Ensure it appears *only* after a result is recorded.
- [ ] **Transition:** Ensure smooth transition to next card (no flickering).
- [ ] **TTS:** Verify "Listen to Native" works reliably.

### B. MCQScreen (Quiz)
- [ ] **Selection:** Ensure selecting an option visually highlights it clearly.
- [ ] **Feedback:** Ensure correct/incorrect state is visually distinct (Green/Red).
- [ ] **Continue:** Ensure "Continue" button advances to the next question properly.

## 3. Step-by-Step Fixes

1.  **Fix Routing Stability:** Prevent `GameUnit` from unmounting unwantingly.
2.  **Fix "Next" Logic:** Ensure `handleNextActivity` correctly moves to the next `currentIndex`.
3.  **Fix ASR/Interaction Block:** Ensure `isListening` state doesn't get stuck true.
4.  **UI Polish:** Verify margins, padding, and animations for "Next" buttons.

## Status Log
- **[Pending]** Diagnosis of Unmounting.
- **[Pending]** Validation of Next Button Logic.
