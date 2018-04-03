# Product Website

This directory contains the markdown and config files for [the product website](https://www.tejunareddy.com/discover-rewards-notifier/).

The items in this directory of origin/master is deployed via GitHub pages.

## Running the site locally

GitHub pages uses Jekyll, which is a static site generator. It essentially turns the markdowns in this directory into a nice looking website.

Follow [these instructions](https://jekyllrb.com/docs/installation/) to install Jekyll on your computer.

Then, in **this directory**, run the following command:

```bash
bundle exec jekyll serve
```

The console should give you a link to visit. Just visit that link in your web browser!

Feel free to explore the website. There's some interesting legal docs...

## Viewing data

As explained in [../data/README.md](../data/README.md), the Discover data is duplicated into this directory.
In production, the extension periodically polls for the latest data from these files via a HTTP call.

To view the data after launching the site, append `/deals.json` or `/cashbacks.json` to the link (from the section above).
Alternatively, you can view the data by just opening the json file in your IDE.