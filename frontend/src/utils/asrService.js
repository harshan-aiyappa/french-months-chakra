/**
 * ASR Service - Decision Engine
 * Handles connectivity checks and support detection for different ASR modes.
 */

export const ASR_ENGINE_TYPES = {
    NATIVE: 'native',
    HYBRID: 'hybrid',
};

/**
 * Checks if the browser supports the Native Web Speech API
 */
export const checkNativeSupport = () => {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
};

/**
 * Checks for WebRTC and MediaDevices support (required for Hybrid)
 */
export const checkWebRTCSupport = () => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.RTCPeerConnection);
};

/**
 * Checks LiveKit Server connectivity
 * (Currently returns a promise that resolves to true for simulation, 
 * in production this would ping the LiveKit server endpoint)
 */
export const checkLiveKitConnectivity = async () => {
    try {
        // Mocking a health check ping
        // const response = await fetch(`${import.meta.env.VITE_LIVEKIT_URL}/health`);
        // return response.ok;

        // Simulating check...
        return new Promise((resolve) => setTimeout(() => resolve(true), 500));
    } catch (err) {
        console.error("LiveKit connectivity check failed:", err);
        return false;
    }
};

/**
 * DECISION ENGINE:
 * Intelligently selects the best ASR mode based on environment.
 */
export const detectBestASRMode = async () => {
    console.log("[Decision Engine] Running connectivity and support checks...");

    const nativeSupported = checkNativeSupport();
    const webRTCSupported = checkWebRTCSupport();

    if (!webRTCSupported) {
        console.warn("[Decision Engine] WebRTC not supported. Falling back to Native.");
        return nativeSupported ? ASR_ENGINE_TYPES.NATIVE : null;
    }

    const liveKitAvailable = await checkLiveKitConnectivity();

    if (liveKitAvailable) {
        console.log("[Decision Engine] Hybrid ASR (LiveKit + Whisper) available and selected.");
        return ASR_ENGINE_TYPES.HYBRID;
    }

    console.warn("[Decision Engine] Hybrid ASR unavailable. Falling back to Native.");
    return nativeSupported ? ASR_ENGINE_TYPES.NATIVE : null;
};
