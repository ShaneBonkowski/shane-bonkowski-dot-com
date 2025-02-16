# API Keys Documentation

This document outlines the websites where API keys are utilized and where they are stored for reference. For reference, a lot of these API's rely on one another and interact with eachother in complex ways. See the `.github/workflows/README.md` for more details on how many of the API's are used during the build and deploy process.

## Google Analytics API

- **Uses:** Tracking users on the website.
- **How to generate/find:** Search "tracking ID" on Google Analytics. This may also be called "Measurement ID".
- **Storage Location**: GitHub > settings > secrets > actions > `GA_TRACKING_ID`

## GitHub API

- **Uses:** Interacting with GitHub, specifically during the deployment process.
- **How to generate/find:** Created once in GitHub Developer Settings > Personal Access Tokens
- **Storage Location**: GitHub > settings > secrets > actions > `GH_TOKEN`

## Firebase Service Account

- **Uses:** Interacting with Google Firebase when deploying the website.
- **How to generate/find:** Call `firebase init hosting` when instantiating a project.
- **Storage Location**: GitHub > settings > secrets > actions > `FIREBASE_SERVICE_ACCOUNT_BLACK_HOLE_REJECT`
