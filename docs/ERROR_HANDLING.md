# Error Handling & Case Catalog

The application uses a categorized error numbering system (M, L, R) to provide precise feedback and recovery paths.

## 1. Microphone & Hardware (M-Series)

| ID | Title | Description | Recovery Path |
|---|---|---|---|
| **M-1** | Mic Ready | Successful stream acquisition. | Proceed to Calibration. |
| **M-2** | Access Denied | User blocked mic permission. | Alert user to check site settings. |
| **M-3** | Not Found | No hardware device detected. | Check physical connections. |
| **M-4** | Access Blocked | OS or Browser-level block. | Check system privacy settings. |
| **M-5** | Insecure Context | Site running on HTTP, not HTTPS. | Deploy to secure environment. |
| **M-6** | Unsupported | Browser lacks Web Speech API. | Update browser or switch to Chrome/Safari. |

## 2. Lifecycle & Start (L-Series)

| ID | Title | Description | Recovery Path |
|---|---|---|---|
| **L-1** | Listening | Recognition service initialized. | Visual confirmation in UI. |
| **L-2** | Detected | VAD has picked up voice signal. | Glowing visual feedback. |
| **L-3** | Start Failed | Engine failed to boot. | Auto-retry logic in Hook. |

## 3. Recognition & Processing (R-Series)

| ID | Title | Description | Recovery Path |
|---|---|---|---|
| **R-1** | No Speech | Listen window closed without result. | Incremental Retry -> Re-calibration. |
| **R-2** | Network Error | Cloud speech engine unreachable. | Check internet connection & retry. |
| **R-3** | Source Lost | Stream interrupted mid-sentence. | Reset microphone and retry. |
| **R-4** | Service Blocked | API usage limit or proxy issue. | Troubleshooting notification. |
| **R-5** | Aborted | Tab became inactive/hidden. | Restart practice button. |

## 4. Recovery Strategy: The "Smart Retry"
- **Failure 1**: App displays a warning toast and keeps `GameScreen` active for a simple retry.
- **Failure 2+**: App triggers the **Re-calibration flow** (M-1) to ensure the environmental noise threshold is still accurate.
