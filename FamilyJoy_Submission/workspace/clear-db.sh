#!/bin/bash
# Quick database clear script for FamilyJoy development

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"
node tools/db-clear.js
