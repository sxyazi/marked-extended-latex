# NPM Token Setup Guide

This document explains how to fix the "Invalid npm token" error that causes automated releases to fail.

## The Problem

If you see this error in your GitHub Actions:
```
SemanticReleaseError: Invalid npm token.
```

This means the `NPM_TOKEN` secret in your GitHub repository is either invalid, expired, or incorrectly configured.

## Solution

### Step 1: Generate a New NPM Token

1. Log in to [npmjs.com](https://www.npmjs.com/)
2. Go to your profile settings
3. Click on "Access Tokens" in the left sidebar
4. Click "Generate New Token"
5. Choose "Automation" type (recommended for CI/CD)
6. Copy the generated token (you won't be able to see it again)

### Step 2: Configure Two-Factor Authentication (If Enabled)

If you have 2FA enabled on your npm account:

1. Go to your npm account settings
2. Navigate to "Two-Factor Authentication"
3. Set the level to **"Authorization only"** (not "Authorization and writes")
   
   **Important**: semantic-release cannot publish with the "Authorization and writes" 2FA level.

### Step 3: Update GitHub Secret

1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Find the `NPM_TOKEN` secret (or create it if it doesn't exist)
4. Update the value with your new npm token
5. Save the changes

### Step 4: Test the Fix

1. Push a new commit to the main branch or manually re-run the failed workflow
2. The release job should now succeed

## Additional Notes

- NPM tokens can expire, so you may need to repeat this process periodically
- Make sure your npm account has publish permissions for the package
- The token should have the "publish" scope enabled

## Troubleshooting

### Quick Token Verification

This repository includes a verification script to test your NPM token locally:

```bash
NPM_TOKEN=your_token_here ./scripts/verify-npm-token.sh
```

This script will:
- Verify your token is valid
- Check your npm username
- Test package publish permissions
- Provide specific error messages if something is wrong

### Manual Verification

If you continue to see errors:

1. Verify the token is correct by testing it locally:
   ```bash
   npm config set //registry.npmjs.org/:_authToken YOUR_TOKEN
   npm whoami
   ```

2. Check that your npm account has the necessary permissions for the package

3. Ensure the package name in `package.json` matches your npm package name

4. Review the [semantic-release npm plugin documentation](https://github.com/semantic-release/npm#npm-registry-authentication) for more details