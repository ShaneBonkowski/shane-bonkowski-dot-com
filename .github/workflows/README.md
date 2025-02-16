# Workflows Overview

This folder contains GitHub Actions workflows, which are automated processes defined in YAML files. Workflows allow for task automation, such as building and deploying a project as a website.

## Deploy Website Workflow

The `deploy-website.yml` workflow in this folder is responsible for building and deploying the Shane's Games website to Google Firebase.

This workflow is triggered on pushes to the `main` branch of the repository. Whenever code is pushed to the `main` branch, this workflow is automatically executed to deploy the website.

At a high level, the workflow copies everything from the `main` branch of the repository, and starts "building" by performing optimizations or modifications such as code minification, image compression, and adding features like Google Analytics tracking. A great reason for this setup is that it allows for private things such as API keys, or a Google Analytics key to be added as a GitHub Secret. That way it can be called as a variable during building, preventing sensitive information from being public.

Finally after building, the contents of the `deploy` folder where the build lives are then sent to Google Firebase!

For more information on GitHub Actions and how to configure workflows, refer to the [GitHub Actions documentation](https://docs.github.com/en/actions).
