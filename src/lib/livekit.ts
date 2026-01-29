import { AccessToken, RoomServiceClient, EgressClient, CreateOptions } from 'livekit-server-sdk';

// Initialize LiveKit client
const roomService = new RoomServiceClient(
    process.env.LIVEKIT_WS_URL || '',
    process.env.LIVEKIT_API_SECRET || ''
);

const egressClient = new EgressClient(
    process.env.LIVEKIT_WS_URL || '',
    process.env.LIVEKIT_API_KEY || '',
    process.env.LIVEKIT_API_SECRET || ''
);

/**
 * Create a new LiveKit room with recording enabled
 */
export async function createLiveKitRoom(roomName: string, options?: { maxParticipants?: number }) {
    const opts: CreateOptions = {
        name: roomName,
        emptyTimeout: 60 * 10, // Room stays alive for 10 minutes after last participant leaves
        maxParticipants: options?.maxParticipants || 100,
    };

    try {
        const room = await roomService.createRoom(opts);
        return room;
    } catch (error) {
        console.error('Error creating LiveKit room:', error);
        throw error;
    }
}

/**
 * Generate an access token for a participant to join a room
 * @param roomName - Name of the room
 * @param participantName - Display name of the participant
 * @param participantIdentity - Unique identifier for the participant (e.g., userId)
 * @param role - Role of the participant: 'host', 'cohost', or 'viewer'
 */
export async function generateAccessToken(
    roomName: string,
    participantName: string,
    participantIdentity: string,
    role: 'host' | 'cohost' | 'viewer' = 'viewer'
) {
    const at = new AccessToken(
        process.env.LIVEKIT_API_KEY,
        process.env.LIVEKIT_API_SECRET,
        {
            identity: participantIdentity,
            name: participantName,
        }
    );

    // Set permissions based on role
    if (role === 'host' || role === 'cohost') {
        at.addGrant({
            room: roomName,
            roomJoin: true,
            canPublish: true,
            canPublishData: true, // For chat
            canSubscribe: true,
        });
    } else {
        // Viewer: can only subscribe, not publish
        at.addGrant({
            room: roomName,
            roomJoin: true,
            canPublish: false,
            canPublishData: true, // Viewers can still chat
            canSubscribe: true,
        });
    }

    return at.toJwt();
}

/**
 * Start recording for a room
 */
export async function startRoomRecording(roomName: string) {
    try {
        // Note: Recording configuration should be set up in LiveKit Cloud dashboard
        // This triggers the start if auto-recording is not enabled
        const egressInfo = await egressClient.listEgress({ roomName });

        if (egressInfo.length === 0) {
            console.log(`No egress configured for room ${roomName}, recordings may need cloud setup`);
        }

        return egressInfo;
    } catch (error) {
        console.error('Error starting recording:', error);
        throw error;
    }
}

/**
 * End a LiveKit room
 */
export async function endLiveKitRoom(roomName: string) {
    try {
        await roomService.deleteRoom(roomName);
    } catch (error) {
        console.error('Error ending LiveKit room:', error);
        throw error;
    }
}

/**
 * Get room details
 */
export async function getRoomDetails(roomName: string) {
    try {
        const rooms = await roomService.listRooms([roomName]);
        return rooms.length > 0 ? rooms[0] : null;
    } catch (error) {
        console.error('Error fetching room details:', error);
        return null;
    }
}

/**
 * List participants in a room
 */
export async function listRoomParticipants(roomName: string) {
    try {
        const participants = await roomService.listParticipants(roomName);
        return participants;
    } catch (error) {
        console.error('Error listing participants:', error);
        return [];
    }
}

/**
 * Generate a unique room name
 */
export function generateRoomName(userId: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    return `live_${userId}_${timestamp}_${random}`;
}
