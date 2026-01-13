# 🎯 Vocalis Implementation Plan: Advanced ASR System

## **1. Objective**
To implement a professional-grade speech recognition system for Vocalis that provides high-accuracy transcription using **OpenAI Whisper** via **LiveKit**, while maintaining a robust fallback to **Native Browser ASR** (Web Speech API).

---

## **2. ASR Mode Definitions**

| Mode           | Technology         | Description                                                    |
| :------------- | :----------------- | :------------------------------------------------------------- |
| **Native ASR** | Web Speech API     | Lightweight, browser-based, fast, and free.                    |
| **Hybrid ASR** | LiveKit + Whisper  | Industry-standard, high-accuracy server approach using WebRTC. |
| **Auto Mode**  | Intelligent Switch | Selects Hybrid when available, safely falls back to Native.    |

---

## **3. Detailed Architectural Flows**

### **A. Native ASR Flow**
1.  **User** taps "Start"
2.  **Browser** requests Mic Permission
3.  **Web Speech API** initializes
4.  **OS / Browser ASR Engine** processes audio
5.  **Partial + Final Text** returned to UI
6.  **Results** evaluated by Vocalis logic

### **B. Hybrid ASR Flow (High Fidelity)**
1.  **User** taps "Start"
2.  **Mic Capture** (Browser)
3.  **WebRTC Stream** initiated via **LiveKit Client**
4.  **LiveKit Server** receives audio
5.  **Audio Ingest Worker** processes stream:
    *   Noise Calibration (first 1s)
    *   Noise Gate (RMS threshold)
    *   VAD (Voice Activity Detection)
    *   Chunking (2.5–3s + overlap)
    *   Resample → 16kHz mono
6.  **Whisper ASR** performs transcription
7.  **Final Transcripts** sent via **DataChannel / WebSocket**
8.  **UI** receives and displays result

### **C. Auto-Detection Engine Flow**
1.  **App Loads**
2.  **Connectivity Checks**:
    *   LiveKit server reachability
    *   ASR worker health status
    *   Network quality assessment
    *   Browser WebRTC support
3.  **Decision Engine**:
    *   `IF Hybrid Available` → **Use Hybrid ASR**
    *   `ELSE` → **Fallback to Native ASR**

---

## **4. Implementation Roadmap**

### **Phase 1: Infrastructure & Utilities** ⏳
- [x] Create `asrService.js` (Decision Engine logic)
- [x] Implement browser support checks (WebRTC, SpeechRecognition)
- [x] Implement LiveKit connectivity mock/check logic

### **Phase 2: Hybrid Flow Client Implementation** ⏳
- [x] Install `livekit-client` SDK
- [x] Create `useLiveKit.js` hook
    - [x] WebRTC room management (Connect/Disconnect)
    - [x] Published audio track handling
    - [x] DataChannel listener for JSON transcripts

### **Phase 3: Unified Master Hook (Abstraction Layer)** 📅
- [ ] Create `useUnifiedASR.js`
- [ ] Logic to wrap both `useSpeechRecognition` and `useLiveKit`
- [ ] Unified interface for `startListening`, `stopListening`, `transcript`, and `isListening`
- [ ] Internal "Auto" mode execution

### **Phase 4: UI/UX Finishing & Integration** 📅
- [ ] Update `AdvancedPracticeScreen` to use the Unified Hook
- [ ] Update `GameUnit` to handle ASR selection dynamically
- [ ] Visual indicators for "Hybrid" vs "Native" active state
- [ ] Error handling and fallback toast notifications

---

## **5. Current Status Tracker**

- **Project Status**: 🏗️ In Progress (Phase 2-4)
- **Latest Update**: Optimized FastAPI Gateway and ASR Worker implemented with `int8` quantization.
- **Next Step**: Configure local LiveKit server and connect Frontend to the real Gateway.

### **Backend Optimizations Implemented:**
1.  **Quantization**: Using `int8` in `faster-whisper` for 4x faster CPU inference.
2.  **Concurrency**: Fully `asyncio` based audio processing in `asr_worker.py`.
3.  **Security**: Added `TrustedHostMiddleware` and `ProxyHeadersMiddleware` for SSL-ready production environments.
4.  **Modern Stack**: Python 3.12 recommended for stability; FastAPI 0.110+ for performance.


---

*Last Updated: 2026-01-13*
