/**
 * Token Service
 * Fetches access tokens from the local backend for LiveKit connections.
 */

const GATEWAY_URL = "http://localhost:8000";

export const fetchLiveKitToken = async (roomName, participantIdentity) => {
    try {
        console.log(`[TokenService] Requesting token for ${participantIdentity} in ${roomName}...`);

        const response = await fetch(`${GATEWAY_URL}/get-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                room_name: roomName,
                participant_identity: participantIdentity,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `Server error: ${response.status}`);
        }

        const data = await response.json();
        console.log("[TokenService] Token received successfully.");
        return data.token;
    } catch (error) {
        console.error("[TokenService] Error fetching token:", error);
        throw error; // Re-throw to be handled by the caller
    }
};
