#!/bin/bash

echo "Setting up development environment..."

if [ -f "package.json" ]; then
    echo "Installing dependencies with Bun..."
    bun install
    echo "Bun environment configured. Projects installed via Bun."
fi

bun install -g turbo @anthropic-ai/claude-code @google/gemini-cli

echo "Development environment ready!"
echo "Installed tools:"
echo "  - Bun: $(bun --version)"