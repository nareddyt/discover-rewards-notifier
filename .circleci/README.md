# Continuous Deployment

We use [CircleCI](https://circleci.com/blog/what-is-continuous-integration/) for CI/CD.

## Workflow

### For Developers

CircleCI runs scripts after every commit to GitHub. These scripts ensure that the extension still "works".

You can see all the builds [here](https://circleci.com/gh/nareddyt/discover-rewards-notifier). The build statuses should also show up on GitHub.

As long as all your builds are green, you should be good. If a build turns red, then you broke something! Read through the logs or ask for help :)

### For Maintainers

The project maintainers can tell CircleCI to release the extension, in which case CircleCI will upload the latest code to the Chrome Web Store.

All they have to do is create a **release** on GitHub!
Within a minute of doing that, CircleCI builds, packages, and uploads the code to the Chrome Web Store.
This allows our end-users to get the latest features and bug-fixes ASAP.

You can view all our GitHub releases [here](https://github.com/nareddyt/discover-rewards-notifier/releases).

**Note:** It may take around a day for all of our users to automatically download the latest update. This is a limitation of the Chrome Web Store.

## Process

Our CircleCI configuration is largely based around [this blog post](https://circleci.com/blog/continuously-deploy-a-chrome-extension/).

For more info, read the link above and take a look at the [config.yml](config.yml) config file.

If developers would like to learn more, please ask **@nareddyt** and he can explain or add more docs.