#!/bin/bash

# NPM Token Verification Script
# This script helps verify that your NPM token is properly configured

set -e

echo "🔍 NPM Token Verification Script"
echo "================================="
echo

# Check if NPM_TOKEN is provided
if [ -z "$NPM_TOKEN" ]; then
    echo "❌ Error: NPM_TOKEN environment variable is not set."
    echo
    echo "Usage:"
    echo "  NPM_TOKEN=your_token_here ./scripts/verify-npm-token.sh"
    echo
    echo "Or set it in your environment:"
    echo "  export NPM_TOKEN=your_token_here"
    echo "  ./scripts/verify-npm-token.sh"
    echo
    exit 1
fi

echo "✅ NPM_TOKEN environment variable is set"

# Create a temporary .npmrc file
TEMP_NPMRC=$(mktemp)
echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > "$TEMP_NPMRC"

echo "🔍 Testing NPM authentication..."

# Test the token
if npm whoami --userconfig="$TEMP_NPMRC" > /dev/null 2>&1; then
    USERNAME=$(npm whoami --userconfig="$TEMP_NPMRC")
    echo "✅ NPM token is valid! Authenticated as: $USERNAME"
    
    # Check package publish permissions
    PACKAGE_NAME=$(node -p "require('./package.json').name")
    echo "🔍 Checking publish permissions for package: $PACKAGE_NAME"
    
    if npm access list packages --userconfig="$TEMP_NPMRC" 2>/dev/null | grep -q "$PACKAGE_NAME"; then
        echo "✅ You have access to publish $PACKAGE_NAME"
    else
        echo "⚠️  Warning: You may not have publish access to $PACKAGE_NAME"
        echo "   This could be because:"
        echo "   - The package doesn't exist yet (first publish)"
        echo "   - You don't have publish permissions"
        echo "   - The package is scoped to a different organization"
    fi
    
    echo
    echo "🎉 NPM token verification completed successfully!"
    echo "   Your token should work with semantic-release."
    
else
    echo "❌ NPM token is invalid!"
    echo
    echo "Common causes:"
    echo "  - Token has expired"
    echo "  - Token doesn't have the 'publish' scope"
    echo "  - Two-factor authentication is set to 'Authorization and writes'"
    echo "    (should be 'Authorization only' for CI/CD)"
    echo
    echo "Please see NPM_TOKEN_SETUP.md for detailed instructions."
    rm -f "$TEMP_NPMRC"
    exit 1
fi

# Cleanup
rm -f "$TEMP_NPMRC"