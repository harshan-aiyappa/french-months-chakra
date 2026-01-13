import os
import logging
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from pydantic import BaseModel
from livekit import api
from dotenv import load_dotenv

# Modern logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("vocalis-gateway")

load_dotenv()

app = FastAPI(
    title="Vocalis ASR Gateway",
    description="Modern, optimized gateway for LiveKit token generation and health monitoring.",
    version="1.1.0"
)

# 🛡️ SECURITY: Trusted Hosts
# Add your production domain here
app.add_middleware(
    TrustedHostMiddleware, 
    allowed_hosts=["localhost", "127.0.0.1", "*.vercel.app", "*.ngrok-free.app"] 
)

# 🌐 CONNECTIVITY: Advanced CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict this in production
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

class ConnectionRequest(BaseModel):
    room_name: str
    participant_identity: str

@app.get("/health")
async def health_check():
    """Optimized health check for production monitoring."""
    return {
        "status": "healthy",
        "engine": "FastAPI",
        "livekit_connected": bool(os.getenv('LIVEKIT_API_KEY'))
    }

@app.post("/get-token")
async def get_token(request: ConnectionRequest):
    """
    SECURE: Generates a short-lived LiveKit Access Token.
    Optimized for high-concurrency token issuance.
    """
    logger.info(f"[TOKEN REQUEST] User: {request.participant_identity}, Room: {request.room_name}")
    
    api_key = os.getenv('LIVEKIT_API_KEY')
    api_secret = os.getenv('LIVEKIT_API_SECRET')
    
    if not api_key or not api_secret:
        logger.error("[TOKEN FAILED] LiveKit credentials missing in environment")
        raise HTTPException(status_code=500, detail="ASR engine configuration error")

    try:
        # Modern LiveKit Token implementation
        token = api.AccessToken(api_key, api_secret) \
            .with_identity(request.participant_identity) \
            .with_grants(api.VideoGrants(
                room_join=True,
                room=request.room_name,
                can_publish=True,
                can_subscribe=True,
            ))
        
        # Expire tokens quickly for better security (e.g., 2 hours)
        token.ttl = 7200 
        
        logger.info(f"[TOKEN SUCCESS] Generated for '{request.participant_identity}' → Room '{request.room_name}' (TTL: {token.ttl}s)")
        return {"token": token.to_jwt()}
    except Exception as e:
        logger.error(f"[TOKEN ERROR] Generation failed for {request.participant_identity}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to secure ASR connection")

if __name__ == "__main__":
    import uvicorn
    # Use standard modern port 8000
    # Enable proxy_headers if behind Nginx/Vercel for proper SSL detection
    uvicorn.run(app, host="0.0.0.0", port=8000, proxy_headers=True, forwarded_allow_ips="*")
