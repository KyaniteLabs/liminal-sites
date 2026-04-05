#!/bin/bash
# git-hygiene.sh: One-command cleanup for stale worktrees, merged branches, and stray files
# Usage: npm run git:hygiene
#        Or: bash scripts/utils/git-hygiene.sh [--dry-run]

set -euo pipefail

DRY_RUN=false
[ "${1:-}" = "--dry-run" ] && DRY_RUN=true

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "  ${BLUE}i${NC} $1"; }
log_ok() { echo -e "  ${GREEN}ok${NC} $1"; }
log_warn() { echo -e "  ${YELLOW}!${NC} $1"; }

REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || { echo "Not in a git repo"; exit 1; })
cd "$REPO_ROOT"

# Counters
branches_deleted=0
remote_deleted=0
dirs_cleaned=0
strays_removed=0
stashes_dropped=0

echo ""
echo "  Git Hygiene Cleanup"
echo "  ==================="
[ "$DRY_RUN" = true ] && echo "  (DRY RUN — no changes will be made)"
echo ""

# --- Step 1: Prune stale worktree metadata ---
log_info "Pruning stale worktree metadata..."
[ "$DRY_RUN" = false ] && git worktree prune 2>/dev/null
log_ok "Worktree metadata pruned"

# --- Step 2: Delete merged local branches ---
log_info "Checking for merged local branches..."
merged=$(git branch --merged main 2>/dev/null | \
    grep -v '^\*' | grep -v 'main' | grep -v 'master' | \
    sed 's/^[+ ]*//' | grep -v '^$' || true)

if [ -n "$merged" ]; then
    for branch in $merged; do
        if [ "$DRY_RUN" = true ]; then
            echo "    Would delete local: $branch"
        else
            if git branch -d "$branch" 2>/dev/null; then
                echo "    Deleted local: $branch"
                ((branches_deleted++)) || true
            fi
        fi
    done
else
    log_info "No merged local branches to delete"
fi

# --- Step 3: Delete merged remote branches ---
log_info "Checking for merged remote branches..."
merged_remote=$(git branch -r --merged main 2>/dev/null | \
    grep -v 'origin/main' | grep -v 'origin/master' | grep -v 'origin/HEAD' | \
    sed 's/^[+ ]*//' | sed 's|^origin/||' | grep -v '^$' || true)

if [ -n "$merged_remote" ]; then
    for branch in $merged_remote; do
        if [ "$DRY_RUN" = true ]; then
            echo "    Would delete remote: origin/$branch"
        else
            if git push origin --delete "$branch" 2>/dev/null; then
                echo "    Deleted remote: origin/$branch"
                ((remote_deleted++)) || true
            fi
        fi
    done
else
    log_info "No merged remote branches to delete"
fi

# --- Step 4: Remove orphaned worktree directories ---
log_info "Checking for orphaned worktree directories..."
for wt_base in ".claude/worktrees" ".worktrees"; do
    wt_dir="$REPO_ROOT/$wt_base"
    [ -d "$wt_dir" ] || continue
    for dir in "$wt_dir"/*/; do
        [ -d "$dir" ] || continue
        dirname=$(basename "$dir")
        # Check if this directory is a registered worktree
        if ! git worktree list --porcelain 2>/dev/null | grep -q "$dir"; then
            if [ "$DRY_RUN" = true ]; then
                echo "    Would remove orphan: $wt_base/$dirname"
            else
                rm -rf "$dir"
                echo "    Removed orphan: $wt_base/$dirname"
                ((dirs_cleaned++)) || true
            fi
        fi
    done
done
[ "$dirs_cleaned" -eq 0 ] 2>/dev/null && log_info "No orphaned worktree directories found" || true

# --- Step 5: Remove stray files ---
log_info "Checking for stray files..."

# Pattern 1: Shell redirect artifacts ([0-9]+timeout:, etc.)
for f in "$REPO_ROOT"/[0-9]*timeout:*; do
    [ -e "$f" ] || continue
    if [ "$DRY_RUN" = true ]; then
        echo "    Would remove stray: $(basename "$f")"
    else
        rm -f "$f"
        echo "    Removed stray: $(basename "$f")"
        ((strays_removed++)) || true
    fi
done

# Pattern 2: verify-*.png in root
for f in "$REPO_ROOT"/verify-*.png; do
    [ -e "$f" ] || continue
    if [ "$DRY_RUN" = true ]; then
        echo "    Would remove stray: $(basename "$f")"
    else
        rm -f "$f"
        echo "    Removed stray: $(basename "$f")"
        ((strays_removed++)) || true
    fi
done

[ "$strays_removed" -eq 0 ] 2>/dev/null && log_info "No stray files found" || true

# --- Step 6: Stash cleanup ---
stash_count=$(git stash list 2>/dev/null | wc -l | tr -d ' ')
if [ "$stash_count" -gt 0 ]; then
    log_info "Found $stash_count stash(es). Review with: git stash list"
    log_info "Drop old stashes with: git stash drop stash@{N}"
fi

# --- Summary ---
echo ""
echo "  ==================="
echo "  Cleanup Summary"
echo "  ==================="
if [ "$DRY_RUN" = true ]; then
    echo "  (DRY RUN — no changes made)"
fi
echo "  Merged local branches:  $branches_deleted"
echo "  Merged remote branches: $remote_deleted"
echo "  Orphaned directories:   $dirs_cleaned"
echo "  Stray files removed:    $strays_removed"
echo ""

exit 0
