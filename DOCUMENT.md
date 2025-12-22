# Features & Functionalities Document

This document provides a comprehensive breakdown of all user-facing and technical features available in the French Months practice application.

## 1. User Experience (UX) Features

### 🌟 Interactive Practice Loop
- **Multi-Modal Learning**: Combines speaking prompts with Multiple Choice Questions (MCQ) to reinforce memory.
- **Dynamic Questioning**: System rotates through French months with randomized types (Pronunciation vs. Identification).
- **Graceful Failure**: If the system doesn't hear you, it prompts a retry rather than failing immediately.

### 🎨 Visual & Motion Design
- **Glassmorphic UI**: High-end aesthetic using semi-transparent containers, subtle blur effects, and premium shadows.
- **Fluid Transitions**: Slide-and-blur entrance/exit animations between every screen.
- **Interaction Feedback**: 
  - **Success**: Stat cards "pop", confetti explosions, and green highlighting.
  - **Warning**: "Shake" animations and orange alerts for near-misses.
  - **Error**: Clear red feedback with actionable tips.

### 📱 Mobile-First Optimization
- **iOS Resilience**: Solves the 100vh "floating button" problem common in Safari.
- **Safe-Area Awareness**: Interaction zones are padded to avoid clashing with OS-level home bars or notch areas.
- **Touch Polishing**: Zero-delay touch interaction and removal of persistent tap highlights.

---

## 2. Audio & Speech Functionalities

### 🎙️ Real-time Mic Visualization
- **11-Bar Equalizer**: Visual representation of the mic's frequency spectrum.
- **VAD (Voice Activity Detection)**: Intelligent logic that changes the UI color and triggers glows only when human speech is detected.
- **Sync Logic**: Visualizer stays perfectly in sync with the ASR (Speech Recognition) state.

### ⚙️ Smart Calibration
- **Background Noise Isolation**: Samples environment for 2.5s to set a noise floor.
- **Auto-Recalibration**: If environment noise changes mid-session, the app automatically triggers a recalibration to maintain accuracy.

### 🌍 Global Audio Persistence
- **Zero Lag**: Single `AudioContext` lifecycle prevents the slight delay users often feel when opening microphone-enabled pages.

---

## 3. Educational Functionalities

### 🧠 Pronunciation Evaluator
- **Fuzzy Matching**: Uses Levenshtein distance to detect if you were "close" vs "incorrect".
- **Granular Scoring**: Distinguishes between Correct, Partial (close but needs work), and Incorrect responses.
- **ASR Insights**: Shows you exactly what the system "heard" compared to the target word.

### 📊 Performance Analytics
- **Results Summary**: Comprehensive breakdown of score, accuracy (%), partial hits, and total items.
- **Interactive Review**: Ability to scroll through every past attempt to see where you excelled or failed.

---

## 4. Technical Robustness

### 🛠️ Developer Tools & Accessibility
- **Debug Logging**: Comprehensive console tracking labeled by module (`[ASR]`, `[VAD]`, `[Game]`).
- **ASR Fallbacks**: Clear error IDs correspond directly to the `ERROR_HANDLING.md` documentation.
- **ARIA Compliant**: Full screen-reader support with descriptive labels on all interactive elements.

### 🚀 Performance Architecture
- **Persistent Refs**: Expensive audio nodes are stored in refs to prevent memory leaks and unnecessary re-renders.
- **Debounced Interaction**: Click/Touch interactions are protected against "spamming" to ensure state stability.

---
*Developed by Harshan Aiyappa*
