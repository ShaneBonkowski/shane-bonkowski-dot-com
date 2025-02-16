# API Keys Documentation

This document outlines the websites where API keys are utilized and where they are stored for reference. For reference, a lot of these API's rely on one another and interact with eachother in complex ways. See the `.github/workflows/README.md` for more details on how many of the API's are used during the build and deploy process.

## Google Analytics API

- **Where to Find Tracking ID**: Search "tracking ID" on Google Analytics. This may also be called "Measurement ID".
- **Storage Location**: GitHub > settings > secrets > actions > `GA_TRACKING_ID`

## GitHub API

- **Where to Find**: Created once in GitHub Developer Settings > Personal Access Tokens
- **Storage Location**: GitHub > settings > secrets > actions > `GH_TOKEN`

## Google Service Accounts

- **Where to Find**: Google Cloud Console > IAM & Admin > Service Accounts
- **Storage Location**: GitHub > settings > secrets > actions > `FIREBASE_SERVICE_ACCOUNT_BLACK_HOLE_REJECT`
