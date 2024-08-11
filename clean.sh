#!/bin/sh

# Check if a directory name was provided as a command-line argument
if [ -z "$1" ]; then
  echo "Error: Directory name not provided"
  exit 1
fi

# Set the directory name to delete
DIR_TO_DELETE="$1"

# Check the operating system and delete the directory using the appropriate command
if [ "$(uname)" = "Darwin" ]; then
  # macOS
  rm -rf "$DIR_TO_DELETE"
elif [ "$(expr substr $(uname -s) 1 5)" = "Linux" ]; then
  # Linux
  rm -rf "$DIR_TO_DELETE"
elif [ "$(expr substr $(uname -s) 1 10)" = "MINGW64_NT" ]; then
  # Windows (Git Bash)
  rm -rf "$DIR_TO_DELETE"
elif [ "$(expr substr $(uname -s) 1 10)" = "MINGW32_NT" ]; then
  # Windows (Git Bash)
  rm -rf "$DIR_TO_DELETE"
else
  # Windows (Command Prompt or PowerShell)
  rmdir /s /q "$DIR_TO_DELETE"
  exit 0
fi
