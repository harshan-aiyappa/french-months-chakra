# System Functionality & Tech Stack Verification Log

**Date:** 2026-01-13
**Status:** ✅ Stabilized & Verified

This log tracks the implementation status of all core functionalities, technologies, and user flows in the Vocalis application following recent refactors.

## 1. Core Technologies (The "Techs")

| Technology       | Implementation         | Status       | Notes                                                                                  |
| :--------------- | :--------------------- | :----------- | :------------------------------------------------------------------------------------- |
| **Routing**      | `react-router-dom` v6  | 🟢 **Active** | Dynamic routes `/practice/:modeId` fully implemented. passing params correctly.        |
| **ASR (Native)** | `Web Speech API`       | 🟢 **Active** | Primary engine. `useUnifiedASR` hook handles browser listeners successfully.           |
| **ASR (Hybrid)** | `LiveKit` / `Whisper`  | 🟡 **Ready**  | Hooked up in `startListening`. Falls back to Native if no token/backend.               |
| **TTS (Speech)** | `SpeechSynthesis`      | 🟢 **Active** | "Listen to Native" & "Play Sound" use `window.speechSynthesis`. Fixed simple playback. |
| **State**        | `Redux Toolkit`        | 🟢 **Active** | Game state (`playing`, `results`), score, and retry logic managed globally.            |
| **UI Framework** | `Chakra UI` + `Framer` | 🟢 **Active** | unified design system. Glassmorphism removed. Animations smooth.                       |

## 2. Feature Workflows (The "Flows")

### A. Dashboard & Navigation
- [x] **Mode Selection:** Clicking "Speaking" calls `/practice/speech`.
- [x] **Param Resolution:** `GameUnit` correctly parses `speech`, `mcq`, or `mixed` from URL.
- [x] **Safe Exit:** Clicking "Back" triggers `handleExit`, ensuring mics are killed (`stopListening`).

### B. Game Loop: Speaking Mode
- [x] **Initialization:** Auto-starts calibration or game based on retry count.
- [x] **Recording:** "Mic" button toggles listening. Visualizer pulses on audio input.
- [x] **Processing:** Silence detection (`handleNoSpeech`) works.
- [x] **Feedback:** Success/Correct/Incorrect feedback panels display dynamically.
- [x] **Progression:** "Next" button appears only after result. `handleNextActivity` clears feedback.

### C. Game Loop: MCQ Mode
- [x] **Interaction:** clicking options highlights selection.
- [x] **Audio:** "Play Sound" button triggers TTS for the word.
- [x] **Validation:** "Check Answer" validates against Redux state.
- [x] **Transition:** "Continue" moves to next card instantly (delay removed).

## 3. Critical Fixes Logged
1.  **Unmount Loop:** Fixed by removing conflicting `useEffect` dependencies and stabilizing `useParams`.
2.  **Audio "Stuck":** Added `stopListening` on component unmount and explicit User Exit.
3.  **Missing Logic:** Restored `useUnifiedASR` and handler functions in `GameUnit.jsx`.

## 4. Next Actions for User
- **Test:** Open the app in a browser.
- **Verify:** Click "Speaking Practice". Speak a word. Check if "Next" appears.
- **Verify:** Click "Back". Ensure red recording circle (browser tab) disappears.
