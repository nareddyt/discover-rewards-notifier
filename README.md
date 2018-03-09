<img src="icon/store-icon-128-border.png" align="right" alt="Chrome Web Store Icon" />

# Discover® Deals and Cashback Rewards Notifier

[![CircleCI Build](https://circleci.com/gh/nareddyt/discover-rewards-notifier/tree/master.svg?style=svg)](https://circleci.com/gh/nareddyt/discover-rewards-notifier/tree/master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/c196a657cab442c98672c7b52fafe1f9)](https://www.codacy.com/app/nareddyt/discover-rewards-notifier?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=nareddyt/discover-rewards-notifier&amp;utm_campaign=Badge_Grade)
[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badge/)

A Chrome Extension that shows a notification when visiting sites that qualify for Discover® Deals or Cashback Rewards! The intended end-users are customers of [Discover® Card](https://www.discover.com/).

<p align="center">
    <img src="img/screenshots/jcrew.jpg" width="654" height="450" alt="Screenshot of extension in use" />
</p>

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.
TODO see other sections for notes on TODO

### Prerequisites

You'll need:

- `git` to clone the repo and make contributions
- `npm` to compile the UI
- `Chrome Web Browser` to test the extension

### Installing

#### Clone the repo

```bash
git clone https://github.com/nareddyt/discover-rewards-notifier.git
cd discover-rewards-notifier/
```

#### Install `npm` dependencies

```
npm install
```

#### Compile *handlebars templates* using `npm`

[Handlebars](http://handlebarsjs.com/) is a templating engine the extension uses for the UI.
Note that the previous step automatically installed the handlebars CLI.

```
npm run compileTemplates
```

#### Load the extension in your `Chrome Web Browser`

The extension is now fully-built and ready. Follow this short list of steps from the [Chrome Developer Guide](https://developer.chrome.com/extensions/getstarted#unpacked):

**Note:** You'll see a special *developer icon* when you load the extension. This helps differentiate between the production extension and the developers' custom builds.

## Running the tests

Explain how to run the automated tests for this system

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* [Dropwizard](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
* [Maven](https://maven.apache.org/) - Dependency Management
* [ROME](https://rometools.github.io/rome/) - Used to generate RSS Feeds

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags).

## Authors

* **Billie Thompson** - *Initial work* - [PurpleBooth](https://github.com/PurpleBooth)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone who's code was used
* Inspiration
* etc
