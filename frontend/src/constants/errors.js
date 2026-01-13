export const ERROR_MAP = {
    network: { id: "R-2", title: "Network Error", desc: "A network issue prevented the speech from being recognized. Please check your connection." },
    "audio-capture": { id: "R-3", title: "Microphone Disconnected", desc: "The audio source was lost during recognition. Please check your microphone." },
    "not-allowed": { id: "R-4", title: "Service Not Allowed", desc: "The speech recognition service was blocked. This may be due to a browser extension or network policy." },
    "service-not-allowed": { id: "R-4", title: "Service Not Allowed", desc: "The speech recognition service was blocked. This may be due to a browser extension or network policy." },
    aborted: { id: "R-5", title: "Recognition Canceled", desc: "The listening session was canceled because the page became inactive." },
    "start-failed": { id: "L-3", title: "Recognition Failed to Start", desc: "There was an issue initializing the speech recognition engine." },
    "unsupported-browser": { id: "M-6", title: "Browser Not Supported", desc: "Your browser doesn't support speech recognition. Please use Chrome, Edge, or Safari." },
};
