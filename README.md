# Lingotran: French Months Practice Unit

A high-performance, interactive language learning application built with React, Chakra UI, and the Web Speech API. This unit focuses on mastering the pronunciation and recognition of French months.

## 🎯 Objective
The primary mission of this application is to provide a **frictionless, AI-powered environment** for practicing French phonetics. By combining real-time Voice Activity Detection (VAD) with Automatic Speech Recognition (ASR), users can receive immediate, granular feedback on their pronunciation.

## ✨ Key Features
- **Intelligent VAD**: Dynamic background noise calibration ensures accurate speech detection in various environments.
- **Real-time Feedback**: Interactive "Mic Visualizer" provides instant interaction confirmation.
- **Pronunciation Analysis**: Leverages Levenshtein distance and fuzzy matching for nuanced evaluation of user speech.
- **Cross-Platform**: Tailored optimizations for iOS/Safari, including full-height viewport fixes and audio context management.
- **Premium UI**: Modern glassmorphic design with fluid animations (Framer Motion).

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- npm or yarn
- A modern browser (Chrome 80+ or Safari 14.1+ recommended for Web Speech API support)

### Installation
1. **Clone the repository**:
   ```bash
   git clone https://github.com/harshan-aiyappa/french-months-chakra.git
   cd french-months-chakra
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Microphone Access**:
   When prompted, allow microphone access. The application requires a **Secure Context (HTTPS)** or `localhost` to access the Web Speech API.

## 🏗️ Architecture
- **Framework**: React 18
- **Styling**: Chakra UI (Emotion)
- **Animations**: Framer Motion
- **Audio Engine**: Web Audio API (AnalyserNode)
- **Speech Engine**: Web Speech API (SpeechRecognition)

---
*Digital Architecture by [Harshan Aiyappa](https://github.com/harshan-aiyappa)*
