import logging
import json
import asyncio
import time
from livekit.agents import JobContext, WorkerOptions, cli, job_process
from livekit.plugins import whisper
from livekit import rtc
from dotenv import load_dotenv

load_dotenv()

# Optimized logging for high-performance streaming
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("vocalis-asr-worker")

async def entrypoint(ctx: JobContext):
    """
    ⚡ OPTIMIZED ASR WORKER
    Purpose: Low-latency, local transcription using Faster-Whisper.
    """
    logger.info(f"[ROOM CREATED] Connecting to room: {ctx.room.name}")
    
    # 🏁 INITIALIZATION: Local Whisper Optimization
    # Use 'int8' for CPU optimization (fast and memory efficient)
    # Use 'float16' if you have an NVIDIA GPU (Faster)
    stt = whisper.STT(
        model="base", 
        compute_type="int8", 
        language="fr"  # Pre-set to French for Vocalis
    )
    logger.info(f"[WHISPER INIT] Model: base, Compute: int8, Language: fr")

    async def transcribe_track(participant: rtc.Participant, track: rtc.AudioTrack):
        """Processes audio and streams transcripts back via DataChannel."""
        logger.info(f"[TRACK PROCESSING] Started for participant: {participant.identity}")
        audio_stream = rtc.AudioStream(track)
        
        # Modern streaming ASR integration
        # LiveKit Agents handle VAD and chunking automatically
        asr_stream = stt.stream()
        
        audio_frame_count = 0
        start_time = time.time()
        
        # Audio input task
        async def push_audio():
            nonlocal audio_frame_count
            async for frame in audio_stream:
                audio_frame_count += 1
                if audio_frame_count == 1:
                    logger.info(f"[AUDIO RECEIVED] First frame from {participant.identity} at {time.time():.3f}s")
                asr_stream.push_frame(frame)
            asr_stream.end_input()
            logger.info(f"[AUDIO END] Processed {audio_frame_count} frames from {participant.identity}")

        # Transcript output task
        async def process_results():
            transcript_count = 0
            async for event in asr_stream:
                if event.type == whisper.stt.TranscriptionEventType.FINAL_TRANSCRIPT:
                    transcript_count += 1
                    transcript = event.transcript.text
                    processing_time = time.time() - start_time
                    confidence = getattr(event, 'confidence', 'N/A')
                    
                    logger.info(f"[WHISPER FINAL] #{transcript_count} | User: {participant.identity} | Text: '{transcript}' | Confidence: {confidence} | Time: {processing_time:.2f}s")
                    
                    # 🛰️ DATA CHANNEL: Send result back to frontend
                    payload = json.dumps({
                        "type": "transcript",
                        "text": transcript,
                        "is_final": True,
                        "participant": participant.identity,
                        "confidence": str(confidence),
                        "processing_time_ms": int(processing_time * 1000)
                    })
                    await ctx.room.local_participant.publish_data(payload)
                    logger.info(f"[DATA SENT] Transcript delivered to client via DataChannel")
                elif event.type == whisper.stt.TranscriptionEventType.INTERIM_TRANSCRIPT:
                    logger.debug(f"[WHISPER PARTIAL] User: {participant.identity} | Text: '{event.transcript.text}'")

        # Run concurrently for maximum throughput/low latency
        await asyncio.gather(push_audio(), process_results())
        logger.info(f"[TRACK COMPLETE] Transcription finished for {participant.identity}")

    @ctx.room.on("track_subscribed")
    def on_track_subscribed(track: rtc.Track, publication: rtc.TrackPublication, participant: rtc.RemoteParticipant):
        if track.kind == rtc.TrackKind.KIND_AUDIO:
            logger.info(f"[TRACK SUBSCRIBED] Audio track from {participant.identity} (SID: {track.sid})")
            asyncio.create_task(transcribe_track(participant, track))

    @ctx.room.on("track_unsubscribed")
    def on_track_unsubscribed(track: rtc.Track, publication: rtc.TrackPublication, participant: rtc.RemoteParticipant):
        logger.info(f"[TRACK UNSUBSCRIBED] Track {track.sid} from {participant.identity}")

    @ctx.room.on("participant_connected")
    def on_participant_connected(participant: rtc.RemoteParticipant):
        logger.info(f"[CLIENT CONNECTED] Participant: {participant.identity} (SID: {participant.sid})")

    @ctx.room.on("participant_disconnected")
    def on_participant_disconnected(participant: rtc.RemoteParticipant):
        logger.info(f"[CLIENT DISCONNECTED] Participant: {participant.identity} (SID: {participant.sid})")

    await ctx.connect()
    logger.info(f"[WORKER ONLINE] ASR Worker connected to room '{ctx.room.name}' - Ready for transcription")

if __name__ == "__main__":
    # Modern Agent CLI
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))
