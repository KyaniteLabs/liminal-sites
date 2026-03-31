#!/bin/bash
# Run all dogfood generations in parallel foreground processes
# Each provider gets its own process

set -e

mkdir -p examples/logs

echo "🚀 Starting parallel dogfood generation..."
echo ""

# Provider configs
run_provider() {
    local provider=$1
    local models=$2
    
    echo "[$provider] Starting with models: $models"
    for model in $models; do
        for domain in p5 glsl three strudel hydra; do
            logfile="examples/logs/${provider}-${model//[^a-zA-Z0-9]/_}-${domain}.log"
            echo "[$provider] $model/$domain -> $logfile"
            
            # Run in subshell
            (
                npx tsx scripts/generate-single.ts "$provider" "$model" "$domain" > "$logfile" 2>&1
                exit_code=$?
                if [ $exit_code -eq 0 ]; then
                    echo "✅ $provider/$model/$domain"
                else
                    echo "❌ $provider/$model/$domain (exit: $exit_code)"
                fi
            ) &
        done
    done
}

# MiniMax
run_provider "minimax" "MiniMax-M2.7 MiniMax-M2.5 MiniMax-M2.1" &

# LM Studio
run_provider "lmstudio" "Qwen3.5-9B Qwen3-Coder-40B" &

# Ollama
run_provider "ollama" "Gemma3-4B Kimi-K2.5" &

echo ""
echo "All providers launched in background. Waiting for completion..."
wait

echo ""
echo "═".repeat(60)
echo "All tasks complete!"
echo "Logs: examples/logs/"
