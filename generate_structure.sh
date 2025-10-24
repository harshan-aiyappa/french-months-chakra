#!/bin/bash

# =======================================================
# 💫 Clean Frontend Backup & Structure Generator
# =======================================================

set -e

timestamp=$(date +"%Y-%m-%d_%H-%M-%S")
backup_dir="backups"
backup_name="frontend_backup_${timestamp}.zip"
note_file="note_${timestamp}.txt"
structure_md="structure.md"
structure_txt="structure.txt"

# 🚫 Ignore these folders & files (public included now ✅)
IGNORED_DIRS=("node_modules" "dist" "build" ".git" "backups" ".idea" ".vscode" "logs")
IGNORED_PATTERNS=("*.log" "*.local" ".DS_Store" "*.env.*" "*.suo" "*.swp" "*.sln")

# 🎨 Colors
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
CYAN="\033[0;36m"
BOLD="\033[1m"
RESET="\033[0m"

# 🌀 Spinner
spinner() {
  local pid=$!
  local spin='|/-\\'
  local i=0
  while kill -0 $pid 2>/dev/null; do
    printf "\r${CYAN}${spin:$((i++ % 4)):1}${RESET} $1"
    sleep 0.15
  done
  printf "\r${GREEN}✔${RESET} $1\n"
}

# ✨ Step helper
step() {
  echo -e "\n${YELLOW}▶ $1${RESET}"
}

# ---------------------------
# 1️⃣ Prepare backup folder
# ---------------------------
step "Preparing backup folder..."
rm -rf "$backup_dir"
mkdir -p "$backup_dir" &
spinner "Cleaning up old backups..."

# ---------------------------
# 2️⃣ Generate structure files
# ---------------------------
step "Generating clean project structure..."

# Build find exclusion args
EXCLUDES=()
for dir in "${IGNORED_DIRS[@]}"; do
  EXCLUDES+=(-not -path "./$dir/*")
done
for pattern in "${IGNORED_PATTERNS[@]}"; do
  EXCLUDES+=(-not -name "$pattern")
done

# Plain text structure
{
  echo "📁 Project Structure (Generated: $timestamp)"
  echo "-------------------------------------------"
  find . -type f "${EXCLUDES[@]}" | sed 's|^\./||' | sort
} > "$structure_txt" &
spinner "Creating structure.txt..."

# Markdown structure
{
  echo "## 📦 Project Structure"
  echo '```'
  find . -type f "${EXCLUDES[@]}" | sed 's|^\./||' | sort
  echo '```'
} > "$structure_md" &
spinner "Creating structure.md..."

# ---------------------------
# 3️⃣ Create note file
# ---------------------------
step "Creating note file..."
cat <<EOF > "$note_file"
🗓️ Backup Timestamp: $timestamp
📦 Backup File: $backup_name
📁 Location: backups/
📄 Contains:

- $structure_md
- $structure_txt
- $note_file

🚫 Excluded Folders:
${IGNORED_DIRS[*]}

🚫 Excluded Patterns:
${IGNORED_PATTERNS[*]}
EOF
spinner "Writing note.txt..."

# ---------------------------
# 4️⃣ Create ZIP
# ---------------------------
step "Creating ZIP backup..."
find . -type f "${EXCLUDES[@]}" -exec zip -j "${backup_dir}/${backup_name}" {} + >/dev/null &
spinner "Compressing project files..."

# Add metadata
zip -j "${backup_dir}/${backup_name}" "$note_file" "$structure_md" "$structure_txt" >/dev/null &
spinner "Adding metadata files..."

# ---------------------------
# 5️⃣ Cleanup
# ---------------------------
step "Cleaning up temp files..."
rm -f "$note_file" "$structure_md" "$structure_txt" &
spinner "Removing temporary files..."

# ---------------------------
# ✅ Summary
# ---------------------------
file_count=$(zipinfo -1 "${backup_dir}/${backup_name}" | wc -l)
echo -e "\n${GREEN}✅ Backup Completed Successfully!${RESET}"
echo -e "${BOLD}📦 File:${RESET} ${backup_dir}/${backup_name}"
echo -e "${BOLD}📁 Files in ZIP:${RESET} ${file_count}"
echo -e "${BOLD}🕒 Timestamp:${RESET} ${timestamp}\n"
