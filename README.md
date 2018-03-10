<img src="icon/store-icon-128-border.png" align="right" alt="Chrome Web Store Icon" />

# Discover® Deals and Cashback Rewards Notifier

[![CircleCI Build](https://circleci.com/gh/nareddyt/discover-rewards-notifier/tree/master.svg?style=svg)](https://circleci.com/gh/nareddyt/discover-rewards-notifier/tree/master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/c196a657cab442c98672c7b52fafe1f9)](https://www.codacy.com/app/nareddyt/discover-rewards-notifier?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=nareddyt/discover-rewards-notifier&amp;utm_campaign=Badge_Grade)
[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badge/)

A Chrome Extension that shows a notification when visiting sites that qualify for Discover® Deals or Cashback Rewards.

The intended end-users are customers of [Discover® Card](https://www.discover.com/).

<p align="center">
    <img src="img/screenshots/jcrew.jpg" width="654" height="450" alt="Screenshot of extension in use" />
</p>

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.
The extension comes with the latest Discover® Deals and Cashback Rewards data, so you don't have to download those manually.

For information on how the deals and cashback data is obtained and processed, view the **Obtaining and Processing the Data** section.

For information on Continuous Deployment, view the **Continuous Deployment** section.

### Prerequisites

You'll need:

- `git` to clone the repo and make contributions
- `npm` to install developer dependencies and build the extension
- `Chrome Web Browser` to test the extension

### Installing

#### Clone the repo

```bash
git clone https://github.com/nareddyt/discover-rewards-notifier.git
cd discover-rewards-notifier/
```

#### Install `npm` dependencies

Run the command below to install the packages needed to build the extension.

**Note:** We use npm to manage *developer* dependencies. None of these dependencies are required when running the extension as a regular user.

```
npm install
```

#### Compile *handlebars templates* using `npm`

[Handlebars](http://handlebarsjs.com/) is a templating engine the extension uses for the UI. Run the command below to compile the required templates.

```
npm run compileTemplates
```

#### Load the extension in Chrome

The extension is now fully-built and ready to use. It needs to be loaded into the Chrome Web Browser so you can use it.

Follow the short list of steps from the [Chrome Developer Guide](https://developer.chrome.com/extensions/getstarted#unpacked) under the **Load the extension** section.

The extension should work now!

**Note:** You'll see a special *developer icon* when you load the extension. This helps differentiate between the production build and the developers' custom builds.

## Obtaining and Processing the Data

See [data/README.md](data/README.md)

## Continuous Deployment

See [.circleci/README.md](.circleci/README.md)

## Built With

* [npm](https://www.npmjs.com/) - Developer dependency management
* [CircleCI](https://circleci.com/) - Continuous Deployment

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on submitting pull requests.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [releases for this repository](https://github.com/nareddyt/discover-deals-notifier-extension/releases).

**Note:** Anytime a release is created, CircleCI automatically deploys the corresponding code to the Chrome Web Store.

## Authors

* **Tejasvi Nareddy** - *Creator and Maintainer* - [nareddyt](https://github.com/nareddyt)

See also the list of [contributors](https://github.com/nareddyt/discover-rewards-notifier/graphs/contributors) who participated in this project.

## License

This project is licensed under the GPLv3 License - see the [LICENSE](LICENSE) file for details

## Acknowledgments

See the [ACKNOWLEDGMENTS](ACKNOWLEDGMENTS) file for details
