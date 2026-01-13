# Complete Technology Stack - All Practice Modes

## **Existing Modes (1-3)** - Web Speech API Based

### **1. Speaking Practice** 🎤
**Technologies Used:**
- ✅ **Web Speech API** - Browser's built-in ASR (`window.SpeechRecognition`)
- ✅ **Web Audio API** - Voice Activity Detection (VAD)
  - `AudioContext` for microphone access
  - `AnalyserNode` for frequency analysis
  - Real-time audio level monitoring
- ✅ **React Hooks** - State management (useState, useEffect, useCallback, useRef)
- ✅ **Redux Toolkit** - Global game state
- ✅ **Framer Motion** - Animations and transitions
- ✅ **Chakra UI** - UI components and theming
- ✅ **Custom Pronunciation Evaluator** - Phoneme-level analysis
  - IPA (International Phonetic Alphabet) parsing
  - Fuzzy matching algorithm
  - Exact matching mode
- ✅ **French Language Data** - 12 months with IPA transcriptions

**Features:**
- Real-time speech recognition
- Dynamic VAD threshold calibration
- Pronunciation scoring
- Audio visualization (waveform bars)
- Retry mechanism (max 3 attempts)

---

### **2. Phonetic Quiz** 📝
**Technologies Used:**
- ✅ **React** - Component-based UI
- ✅ **Redux Toolkit** - Quiz state management
- ✅ **Chakra UI** - Form components and styling
- ✅ **Framer Motion** - Answer feedback animations
- ✅ **French MCQ Data** - Multiple choice questions
  - Question bank with 12 items
  - 4 options per question
  - Correct answer validation

**Features:**
- Multiple choice interface
- Instant feedback (correct/incorrect)
- Visual highlighting (green/red)
- Score tracking
- Navigation to next question

---

### **3. Mixed Mode** 🔀
**Technologies Used:**
- **Combination of Mode 1 & 2:**
  - ✅ **Web Speech API** (for speaking tasks)
  - ✅ **Web Audio API** (VAD for speaking tasks)
  - ✅ **React + Redux** (state management)
  - ✅ **Chakra UI** (unified UI)
  - ✅ **Framer Motion** (transitions between modes)
  - ✅ **Pronunciation Evaluator** (speaking evaluation)
  - ✅ **MCQ System** (quiz evaluation)

**Features:**
- 24 total activities (12 speaking + 12 MCQ)
- Alternating between speaking and quiz
- Unified scoring system
- Progress tracking across both types
- Single results screen with combined stats

**Activity Flow:**
```
Start → Calibration (VAD) → 
  Speaking Task 1 → MCQ Task 1 → 
  Speaking Task 2 → MCQ Task 2 → 
  ... → Results
```

---

## **New Mode 4 (Implemented)** - LiveKit + Whisper Based 🆕

### **4. Advanced Practice** (Implemented)
**Technologies Used:**

#### **Frontend:**
- ✅ **LiveKit Client SDK** - WebRTC real-time communication
  - `@livekit/components-react` - Pre-built React components
  - Room management
  - Track publishing/subscription
  - Audio encoding/decoding
- ✅ **React Hooks** - `useLiveKit` and `useUnifiedASR`
- ✅ **Redux Toolkit** - `asrMode` state management
- ✅ **Chakra UI** - Consistent UI components
- ✅ **Framer Motion** - Advanced animations

#### **Backend (Implemented):**
- ✅ **LiveKit Server** - Cloud/Local Media routing
  - WebRTC SFU (Selective Forwarding Unit)
  - Room creation and management
  - Token-based authentication
- ✅ **Faster-Whisper** - Local Inference Engine
  - `faster-whisper` Python library
  - `int8` quantization for speed
  - Multi-language support (French optimized)
- ✅ **Python FastAPI Backend** - Integration layer
  - `main.py` - Secure Gateway
  - `tokenService.js` - Frontend Auth
  - `asr_worker.py` - Real-time LiveKit Agent

#### **Infrastructure:**
- ✅ **WebRTC** - Peer-to-peer or SFU connection
- ✅ **WebSocket (WSS)** - Secure Signaling
- ✅ **HTTPS** - Required for WebRTC
- ✅ **LiveKit Cloud / Local** - Flexible deployment

**Features Implemented:**
- Professional-grade ASR (Whisper accuracy)
- Real-time transcription via DataChannel
- Low-latency audio streaming
- Hybrid Fallback (Auto Mode)
- Local Privacy Option

**Advantages over Web Speech API:**
- ✅ More accurate transcription
- ✅ Consistent across browsers
- ✅ Support for more languages
- ✅ Customizable models
- ✅ Better handling of accents
- ✅ Professional audio quality

---

## **Shared Technologies (All Modes)**

### **Core Stack:**
- **React 18** - UI framework
- **Redux Toolkit** - State management
- **Chakra UI** - Design system
  - Light theme
  - Glassmorphism effects
  - Responsive design (mobile-first)
- **Framer Motion** - Animations
- **React Router** - URL-based navigation
- **Material Symbols** - Icon system

### **Development Tools:**
- **Vite** - Build tool and dev server
- **npm** - Package manager
- **Git** - Version control
- **VS Code** - Development environment
- **Python 3.12** - Backend environment

### **Browser APIs (Modes 1-3):**
- **Web Speech API** (`SpeechRecognition`)
- **Web Audio API** (`AudioContext`, `AnalyserNode`)
- **MediaDevices API** (`getUserMedia`)
- **RequestAnimationFrame API** - Smooth animations

---

## **Technology Comparison Matrix**

| Feature              | Modes 1-3 (Web Speech API) | Mode 4 (LiveKit + Whisper) |
| -------------------- | -------------------------- | -------------------------- |
| **ASR Engine**       | Browser built-in           | OpenAI Whisper (Local)     |
| **Accuracy**         | Good (~85-90%)             | Excellent (~95-98%)        |
| **Latency**          | Low (~100-200ms)           | Medium (~300-500ms)        |
| **Browser Support**  | Chrome, Edge, Safari       | All (via WebRTC)           |
| **Offline Support**  | ❌ No                       | ✅ Yes (Local Backend)      |
| **Cost**             | ✅ Free                     | ✅ Free (Local) / Cloud $   |
| **Setup Complexity** | ✅ Simple                   | ⚠️ Medium                   |
| **Languages**        | Limited (15+)              | Extensive (99+)            |
| **Customization**    | ❌ None                     | ✅ High                     |
| **Infrastructure**   | ✅ None needed              | ⚠️ Server required          |

---

## **File Structure & Responsibilities**

### **Modes 1-3:**
```
frontend/src/
├── hooks/
│   └── useSpeechRecognition.js      ← Web Speech API hook
├── utils/
│   ├── pronunciationEvaluator.js    ← Scoring logic
│   └── browserDetection.js         ← Feature detection
├── store/
│   └── gameSlice.js                 ← Redux state
├── components/
│   ├── GameUnit.jsx                 ← Main coordinator
│   └── screens/
│       ├── CalibrationScreen.jsx    ← VAD setup
│       ├── GameScreen.jsx           ← Speaking tasks
│       ├── MCQScreen.jsx            ← Quiz tasks
│       └── ResultsScreen.jsx        ← Final scores
```

### **Mode 4 (Implemented):**
```
frontend/src/
├── hooks/
│   ├── useLiveKit.js                ← LiveKit Client hook
│   └── useUnifiedASR.js             ← Master Abstraction (Native vs Hybrid)
├── utils/
│   ├── asrService.js                ← Decision Engine (Auto Mode)
│   └── tokenService.js              ← Backend Auth
├── components/
│   └── screens/
│       └── AdvancedPracticeScreen.jsx   ← Mode Selection UI
backend/
├── main.py                          ← FastAPI Gateway
├── asr_worker.py                    ← LiveKit Agent (Whisper)
├── start_backend.ps1                ← Startup Script
└── requirements.txt                 ← Python Dependencies
```

---

## **Summary**

**Current Implementation (Modes 1-3):**
- ✅ Fully functional with Web Speech API
- ✅ No backend required
- ✅ Free and fast
- ✅ Great for MVP and testing

**New Implementation (Mode 4):**
- ✅ Production-grade with LiveKit + Faster-Whisper
- ✅ Secure Local Backend
- ✅ Better accuracy and features
- ✅ Scalable for commercial use

**Both approaches coexist** - users can choose based on needs! 🚀
