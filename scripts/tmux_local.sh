#!/usr/bin/env sh

WINDOW_NAME="memory-cache-local"
MEMORY_CACHE_BROWSER_CLIENT_DIR="$(pwd)"
MEMORY_CACHE_HUB_DIR="$(pwd)/../memory-cache-hub"

sleep 0.1
tmux kill-window -t $WINDOW_NAME 2>/dev/null
sleep 1
tmux new-window -n $WINDOW_NAME
sleep 1
tmux split-window -h
sleep 0.1
tmux select-pane -t 0
tmux split-window -v
sleep 0.1
tmux select-pane -t 2
tmux split-window -v
sleep 1

tmux select-pane -t 3
tmux send-keys "cd $MEMORY_CACHE_HUB_DIR" C-m
sleep 1

tmux select-pane -t 2
tmux send-keys "cd $MEMORY_CACHE_HUB_DIR" C-m
tmux send-keys "./scripts/watch-dev.sh" C-m
sleep 5 # Wait long enough for the hub to start

tmux select-pane -t 0
tmux send-keys "cd $MEMORY_CACHE_BROWSER_CLIENT_DIR" C-m
tmux send-keys "./scripts/watch-dev.sh" C-m
sleep 1

tmux select-pane -t 1
tmux send-keys "cd $MEMORY_CACHE_BROWSER_CLIENT_DIR" C-m
sleep 1
