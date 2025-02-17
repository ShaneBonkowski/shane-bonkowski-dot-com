# API Keys Documentation

This document outlines the websites where API keys are utilized and where they are stored for reference. For reference, a lot of these API's rely on one another and interact with eachother in complex ways. See the `.github/workflows/README.md` for more details on how many of the API's are used during the build and deploy process.

## Google Analytics API

**Uses/description:**

- Tracking users on the website.
- Add this to Google Firebase (or whichever hosting website I am using) so that it can be safely injected while hosting the website without revealing it to users in the source code.

**How to generate/find:**

- Search "tracking ID" on Google Analytics. This may also be called "Measurement ID".

**Storage Location:**

- GitHub > settings > secrets > actions > `GA_TRACKING_ID`.
- Project settings > Integrations > Google Analytics.

## GitHub API

**Uses/description:**

- Interacting with GitHub, specifically during the deployment process.

**How to generate/find:**

- Created once in GitHub Developer Settings > Personal Access Tokens.

**Storage Location:**

- GitHub > settings > secrets > actions > `GH_TOKEN`.

## Firebase Service Account

**Uses/description:**

- Interacting with Google Firebase when deploying the website.

**How to generate/find:**

- Call `firebase init hosting` when instantiating a project.

**Storage Location:**

- GitHub > settings > secrets > actions > `FIREBASE_SERVICE_ACCOUNT_BLACK_HOLE_REJECT`.

## Firebase Token

**Uses/description:**

- Interacting with Google Firebase when deploying the website.

**How to generate/find:**

- Call `firebase login:ci` when instantiating a project.

**Storage Location:**

- GitHub > settings > secrets > actions > `FIREBASE_TOKEN`.
