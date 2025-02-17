# API Keys Documentation

This documentation outlines how API keys are utilized for Shane's Games, and where they are stored for reference. Some of these APIs rely on one another and interact with eachother in complex ways. See the `.github/workflows/README.md` for more details on how the APIs are used during the build and deploy process.

## Google Analytics API

**Uses/description:**

- Tracking user activity (view count, duration, etc.) on the website.
- Add this to Google Firebase (or whichever webhost I am using) so that it can be safely injected while hosting the website without revealing it to users in the source code.

**How to generate/find:**

- Search "tracking ID" on Google Analytics. This may also be called "Measurement ID".

**Storage Location:**

- GitHub > settings > secrets > actions > `GA_TRACKING_ID`.
- Google Firebase > Project > Project settings > Integrations > Google Analytics.

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

- Call `firebase login:ci`.

**Storage Location:**

- GitHub > settings > secrets > actions > `FIREBASE_TOKEN`.
