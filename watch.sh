#!/bin/bash

# Monitors filesystem changes and runs 'npm run build' when changes are detected

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
WATCH_DIRS=(
    "editing"
    "layouts"
    "pages"
    "partials"
    "assets"
    "scripts"
    "package.json"
)

# Build in progress flag
BUILD_IN_PROGRESS=false

# Function to print colored output
print_status() {
    local color=$1
    local message=$2
    echo -e "${color}[$(date '+%H:%M:%S')] ${message}${NC}"
}

# Function to run build based on file extension
run_build() {
    local file="$1"
    
    if [ "$BUILD_IN_PROGRESS" = true ]; then
        print_status $YELLOW "Build already in progress, skipping..."
        return
    fi
    
    BUILD_IN_PROGRESS=true
    
    # Determine which build command to run based on file extension
    case "$file" in
        *.scss|*.sass)
            print_status $BLUE "SCSS/SASS file changed, running sass build..."
            if npm run sass-build; then
                print_status $GREEN "Sass build completed successfully"
            else
                print_status $RED "Sass build failed"
            fi
            ;;
        *.html|*.hbs|*.js|*.json|*.md)
            print_status $BLUE "Template/content file changed, running metadata update..."
            if npm run update-metadata; then
                print_status $GREEN "Metadata update completed successfully"
            else
                print_status $RED "Metadata update failed"
            fi
            ;;
        *)
            print_status $BLUE "Other file changed, running full build..."
            if npm run build; then
                print_status $GREEN "Full build completed successfully"
            else
                print_status $RED "Full build failed"
            fi
            ;;
    esac
    
    BUILD_IN_PROGRESS=false
}

# Function to check if inotifywait is available
check_dependencies() {
    if ! command -v inotifywait &> /dev/null; then
        print_status $RED "inotifywait is not installed. Please install inotify-tools:"
        print_status $YELLOW "  sudo apt-get install inotify-tools  # Ubuntu/Debian"
        print_status $YELLOW "  sudo yum install inotify-tools      # CentOS/RHEL"
        print_status $YELLOW "  sudo pacman -S inotify-tools        # Arch Linux"
        exit 1
    fi
}

# Function to check if file should be ignored
should_ignore_file() {
    local file="$1"
    
    # Check if it's a directory
    if [ -d "$file" ]; then
        return 0
    fi
    
    # Check file extension
    case "$file" in
        *.html|*.hbs|*.js|*.css|*.scss|*.sass|*.json|*.md)
            # Check if it's in an ignored directory
            case "$file" in
                */node_modules/*|*/.git/*|*/assets/css/*.min.css|*/assets/js/*.min.js|*/assets/js/*.bundle.*)
                    return 0
                    ;;
                *)
                    return 1
                    ;;
            esac
            ;;
        *)
            return 0
            ;;
    esac
}

# Main function
main() {
    print_status $GREEN "Starting file watcher for the ex:oh cms theme..."
    print_status $BLUE "Watching directories: ${WATCH_DIRS[*]}"
    print_status $YELLOW "Press Ctrl+C to stop"
    echo
    
    check_dependencies
    
    # Start watching
    while true; do
        # Use inotifywait to monitor changes with simpler syntax
        inotifywait -r -e modify,create,delete,move \
            --exclude 'node_modules|\.git|\.min\.|\.bundle\.|\.log$|\.tmp$|\.temp$' \
            "${WATCH_DIRS[@]}" 2>/dev/null | while read -r line; do
            
            # Extract the event and file path
            local event=$(echo "$line" | cut -d' ' -f2)
            local file=$(echo "$line" | cut -d' ' -f3-)
            
            # Remove trailing tilde if present
            file=$(echo $file | sed s/~$//)
            echo $file

            # Skip if file should be ignored
            if should_ignore_file "$file"; then
                continue
            fi
            
            print_status $YELLOW "File change detected: $event $file"
            
            # Run build with a small delay to batch multiple changes
            sleep 0.5
            run_build "$file"
        done
        
        # If inotifywait exits, wait a moment and restart
        print_status $YELLOW "inotifywait exited, restarting in 2 seconds..."
        sleep 2
    done
}

# Handle Ctrl+C gracefully
trap 'print_status $GREEN "File watcher stopped"; exit 0' INT

# Run main function
main
