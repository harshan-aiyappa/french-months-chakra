import { useState, useCallback, useRef, useEffect } from 'react';
import {
    Room,
    RoomEvent,
    VideoPresets,
    Track,
    createLocalAudioTrack
} from 'livekit-client';

/**
 * useLiveKit - Hybrid ASR Hook
 * Manages WebRTC connection to LiveKit and receives Whisper transcripts.
 */
const useLiveKit = ({ onResult, onError, onStart }) => {
    const [isConnecting, setIsConnecting] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [error, setError] = useState(null);

    const roomRef = useRef(null);
    const audioTrackRef = useRef(null);

    // Callback refs to prevent re-initialization
    const callbacks = useRef({ onResult, onError, onStart });
    useEffect(() => {
        callbacks.current = { onResult, onError, onStart };
    }, [onResult, onError, onStart]);

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

            // 1. Initialize Room
            const room = new Room({
                adaptiveStream: true,
                dynacast: true,
            });
            roomRef.current = room;

            // 2. Setup Event Listeners (DataChannel for transcripts)
            room.on(RoomEvent.DataReceived, (payload, participant, kind) => {
                const decoder = new TextDecoder();
                const data = JSON.parse(decoder.decode(payload));

                if (data.type === 'transcript') {
                    console.log(`[Hybrid ASR] Whisper Transcript: "${data.text}" (Final: ${data.is_final})`);
                    if (data.is_final && callbacks.current.onResult) {
                        callbacks.current.onResult(data.text.toLowerCase().trim());
                    }
                }
            });

            room.on(RoomEvent.Disconnected, () => {
                console.log("[Hybrid ASR] Disconnected from room");
                setIsConnected(false);
                setIsTranscribing(false);
            });

            // 3. Connect to Room
            await room.connect(url, token);
            setIsConnected(true);
            console.log("[Hybrid ASR] Connected to LiveKit Room:", room.name);

            // 4. Capture and Publish Mic Track (WebRTC Stream)
            const audioTrack = await createLocalAudioTrack({
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
            });

            await room.localParticipant.publishTrack(audioTrack);
            audioTrackRef.current = audioTrack;

            setIsTranscribing(true);
            if (callbacks.current.onStart) callbacks.current.onStart();

        } catch (err) {
            console.error("[Hybrid ASR] Connection failed:", err);
            setError(err.message);
            setIsConnecting(false);
            if (callbacks.current.onError) callbacks.current.onError(err.message);
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
    }, []);

    return {
        startHybridASR,
        stopHybridASR,
        isConnecting,
        isConnected,
        isTranscribing,
        error
    };
};

export default useLiveKit;
