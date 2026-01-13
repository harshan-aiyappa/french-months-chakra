import logging
import json
import asyncio
from livekit.agents import JobContext, WorkerOptions, cli, job_process
from livekit.plugins import whisper
from livekit import rtc
from dotenv import load_dotenv

load_dotenv()

# Optimized logging for high-performance streaming
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("vocalis-asr-worker")

async def entrypoint(ctx: JobContext):
    """
    ⚡ OPTIMIZED ASR WORKER
    Purpose: Low-latency, local transcription using Faster-Whisper.
    """
    logger.info(f"Connecting to room: {ctx.room.name}")
    
    # 🏁 INITIALIZATION: Local Whisper Optimization
    # Use 'int8' for CPU optimization (fast and memory efficient)
    # Use 'float16' if you have an NVIDIA GPU (Faster)
    stt = whisper.STT(
        model="base", 
        compute_type="int8", 
        language="fr"  # Pre-set to French for Vocalis
    )

    async def transcribe_track(participant: rtc.Participant, track: rtc.AudioTrack):
        """Processes audio and streams transcripts back via DataChannel."""
        audio_stream = rtc.AudioStream(track)
        
        # Modern streaming ASR integration
        # LiveKit Agents handle VAD and chunking automatically
        asr_stream = stt.stream()
        
        # Audio input task
        async def push_audio():
            async for frame in audio_stream:
                asr_stream.push_frame(frame)
            asr_stream.end_input()

        # Transcript output task
        async def process_results():
            async for event in asr_stream:
                if event.type == whisper.stt.TranscriptionEventType.FINAL_TRANSCRIPT:
                    transcript = event.transcript.text
                    logger.info(f"[ASR] {participant.identity}: {transcript}")
                    
                    # 🛰️ DATA CHANNEL: Send result back to frontend
                    payload = json.dumps({
                        "type": "transcript",
                        "text": transcript,
                        "is_final": True,
                        "participant": participant.identity
                    })
                    await ctx.room.local_participant.publish_data(payload)

        # Run concurrently for maximum throughput/low latency
        await asyncio.gather(push_audio(), process_results())

    @ctx.room.on("track_subscribed")
    def on_track_subscribed(track: rtc.Track, publication: rtc.TrackPublication, participant: rtc.RemoteParticipant):
        if track.kind == rtc.TrackKind.KIND_AUDIO:
            logger.info(f"Subscribed to audio track from {participant.identity}")
            asyncio.create_task(transcribe_track(participant, track))

    await ctx.connect()
    logger.info("⚡ ASR Worker status: ONLINE")

if __name__ == "__main__":
    # Modern Agent CLI
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))
