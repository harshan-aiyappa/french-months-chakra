$env:PYTHONPATH = "D:\01_Projects\Personal\POCs\vocalis\backend"

Write-Host "🚀 Starting Vocalis Backend Services..." -ForegroundColor Green

# 1. Start FastAPI Gateway
Write-Host "Starting API Gateway..." -ForegroundColor Cyan
Start-Process -FilePath "venv\Scripts\python.exe" -ArgumentList "main.py" -NoNewWindow

# 2. Start ASR Worker
Write-Host "Starting ASR Worker..." -ForegroundColor Cyan
Start-Process -FilePath "venv\Scripts\python.exe" -ArgumentList "asr_worker.py start" -NoNewWindow

Write-Host "✅ All services started!" -ForegroundColor Green
Write-Host "Gateway: http://localhost:8000"
Write-Host "Press Ctrl+C to stop."
