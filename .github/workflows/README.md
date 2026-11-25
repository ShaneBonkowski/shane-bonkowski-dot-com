# Workflows Overview

GitHub Actions workflows are automated processes defined in YAML files that run when specific events occur, such as merging into a branch. Workflows allow for task automation, such as building and deploying a project as a website.

## Deploy Website Workflow

The `deploy-website.yml` workflow in this folder is responsible for building and deploying the Shane's Games website to Google Firebase.

This workflow is triggered on pushes to the `main` branch of the repository. Whenever code is pushed to the `main` branch, this workflow is automatically executed to deploy the website.

The workflow checks out the repository, installs dependencies, builds the static site to `out`, removes unnecessary files from that output, and deploys it to Google Firebase.

For more information on GitHub Actions and how to configure workflows, refer to the [GitHub Actions documentation](https://docs.github.com/en/actions).
