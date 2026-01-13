$backendDir = "D:\01_Projects\Personal\POCs\vocalis\backend"
Set-Location -Path $backendDir

$env:PYTHONPATH = $backendDir

Write-Host "🚀 Starting Vocalis Backend Services..." -ForegroundColor Green

# 1. Start FastAPI Gateway
Write-Host "Starting API Gateway..." -ForegroundColor Cyan
# Opens in a new window so you can see the logs
Start-Process -FilePath "venv\Scripts\python.exe" -ArgumentList "main.py" -WorkingDirectory $backendDir

# 2. Start ASR Worker
Write-Host "Starting ASR Worker..." -ForegroundColor Cyan
# Opens in a new window so you can see the logs
Start-Process -FilePath "venv\Scripts\python.exe" -ArgumentList "asr_worker.py start" -WorkingDirectory $backendDir

Write-Host "✅ All services started in new windows!" -ForegroundColor Green
Write-Host "Gateway: http://localhost:8000"
Write-Host "Press Ctrl+C in the new windows to stop them."
