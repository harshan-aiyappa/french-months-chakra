import { useState, useCallback, useRef, useEffect } from 'react';
import {
    Room,
    RoomEvent,
    createLocalAudioTrack
} from 'livekit-client';

/**
 * useLiveKit - Hybrid ASR Hook
 * Manages WebRTC connection to LiveKit and receives Whisper transcripts.
 */
const useLiveKit = ({ onResult, onError, onStart, onStatusChange }) => {
    const [isConnecting, setIsConnecting] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [error, setError] = useState(null);
    const [room, setRoom] = useState(null);
    const [localTrack, setLocalTrack] = useState(null);

    const roomRef = useRef(null);
    const audioTrackRef = useRef(null);

    // Callback refs to prevent re-initialization
    const callbacks = useRef({ onResult, onError, onStart, onStatusChange });
    useEffect(() => {
        callbacks.current = { onResult, onError, onStart, onStatusChange };
    }, [onResult, onError, onStart, onStatusChange]);

    /**
     * Connect to LiveKit Room and start publishing audio
     */
    const startHybridASR = useCallback(async (url, token) => {
        if (!url || !token) {
            console.error("[Hybrid ASR] Missing URL or Token");
            setError('missing-auth');
            return;
        }

        try {
            setIsConnecting(true);
            setError(null);
            if (callbacks.current.onStatusChange) {
                callbacks.current.onStatusChange('connecting', 'Establishing secure link...');
            }

            // 1. Initialize Room
            const r = new Room({
                adaptiveStream: true,
                dynacast: true,
            });
            roomRef.current = r;
            setRoom(r);

            // 2. Setup Event Listeners
            r.on(RoomEvent.DataReceived, (payload) => {
                const decoder = new TextDecoder();
                const data = JSON.parse(decoder.decode(payload));
                if (data.type === 'transcript' && data.is_final && callbacks.current.onResult) {
                    console.log(`[Hybrid ASR] Whisper Transcript: "${data.text}" (Final: ${data.is_final})`);
                    callbacks.current.onResult(data.text.toLowerCase().trim());
                }
            });

            r.on(RoomEvent.Disconnected, () => {
                console.log("[Hybrid ASR] Disconnected from room");
                setIsConnected(false);
                setIsTranscribing(false);
                if (callbacks.current.onStatusChange) {
                    callbacks.current.onStatusChange('disconnected', 'Link Terminated');
                }
            });

            // 3. Connect to Room
            await r.connect(url, token);
            setIsConnected(true);
            if (callbacks.current.onStatusChange) {
                callbacks.current.onStatusChange('connected', 'Connected to LiveKit Neural Grid');
            }
            console.log("[Hybrid ASR] Connected to LiveKit Room:", r.name);

            // 4. Capture and Publish Mic Track (WebRTC Stream)
            const audioTrack = await createLocalAudioTrack({
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
            });

            await r.localParticipant.publishTrack(audioTrack);
            audioTrackRef.current = audioTrack;
            setLocalTrack(audioTrack);

            setIsTranscribing(true);
            if (callbacks.current.onStart) callbacks.current.onStart();

        } catch (err) {
            console.error("[Hybrid ASR] Connection failed:", err);
            setError(err.message);
            setIsConnecting(false);
            if (callbacks.current.onError) callbacks.current.onError(err.message);
            if (callbacks.current.onStatusChange) {
                callbacks.current.onStatusChange('error', 'Connection Failed');
            }
        } finally {
            setIsConnecting(false);
        }
    }, []);

    /**
     * Stop publishing and disconnect
     */
    const stopHybridASR = useCallback(async () => {
        if (audioTrackRef.current) {
            audioTrackRef.current.stop();
            audioTrackRef.current = null;
        }
        if (roomRef.current) {
            await roomRef.current.disconnect();
            roomRef.current = null;
        }
        setIsConnected(false);
        setIsTranscribing(false);
        setRoom(null);
        setLocalTrack(null);
    }, []);

    return {
        startHybridASR,
        stopHybridASR,
        isConnecting,
        isConnected,
        isTranscribing,
        error,
        room,
        localTrack
    };
};

export default useLiveKit;
