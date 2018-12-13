# Discover® Data

This folder contains raw and processed data about **Discover Deals** and **Discover Cashback Offers**. This data is required for the extension to function.

## Directory Structure

```
.
├── cashback
│   ├── fixedInputData.json     # Predefined data that need to be included in addition to parsed data
│   ├── data.json               # Processed cashback data
│   ├── raw                     # Raw cashback data directory (see section below)
│   │   ├── 1.html
│   │   ├── 2.html
│   │   ├── ...
│   │   └── n.html
│   └── schema.json             # Schema defintion of a single cashback offer
└── deal
    ├── data.json               # Proccessed deals data
    ├── raw.html                # Raw deals data html file (see section below)
    └── schema.json             # Schema definition of a single discover deal
```

## Workflow

Currently, we have no way of automatically retrieving data from www.discover.com.
Users must login to the website to access the Discover Deals and Discover Cashback Offers, and we have no authorization mechanism (yet).
This makes it impossible for the Chrome Extension to make retrieve data directly from www.discover.com at run-time.

Hopefully this mechanism will change in the future. [See Issue #21](https://github.com/nareddyt/discover-rewards-notifier/issues/21)

Instead, developers manually **download** and **pre-process** the data ahead of time.
The data is then stored in two places:

- This directory: For developer use
- **The `../docs` directory**: Served to the **end-users** via Github Pages

When end-users download the extension, the extension periodically retrieves the latest data from Github pages.
By serving the data via Github pages, we completely decouple the data from the extension.
Therefore, we no longer need to create a release or push out a new version of the extension when we need to update the data.
Instead, we just push the latest changes to `master` and allow Github pages to serve the data.

This means users won't have to wait for Chrome Web Store to push the latest data to them.
Users can retrieve the latest Discover data at any time.

Serving the data via Github pages was added in [#20](https://github.com/nareddyt/discover-rewards-notifier/issues/20).
Previously, the data was included directly in the extension. So each version of the extension had different data.
The only way to retrieve the latest data was to update the extension to the newest version.
**This was very problematic**, as our statistics indicated that users were not receiving the latest data for up to a week!

## Updating the Data

We'll go over how to actually run the data update.

### Acquire raw data

This assumes you are using Chrome Web Browser to access the raw data on Discover's Website.

**NOTE:** You must have access to www.discover.com to acquire the data

#### Deals

**OUTDATED**

*The documentation in this Deals section is outdated.
Discover has decided to retire Discover Deals in November 2018.
This data is no longer updated. Please skip this section and follow the instructions for the Cashback Offers.*


~~1. Login to www.discover.com
.2. Visit [this page](https://card.discover.com/cardmembersvcs/deals/app/home#/deals)
.3. Click on the `All Deals` button in the top-right corner.
.4. Right Click -> Inspect Element
.5. Find the following element in the Elements tree: `<div class="row deals">`. When you hover over this element, you should see all the deal cards become highlighted in blue.
.6. Right Click -> Copy -> Copy Element
.7. Delete the contents in `/data/deal/raw.html`.
.8. Paste data into this file. Don't worry about any errors in the file.
.9. Delete `<div class="row deals">` from the file. This should be the first html element in the file.
.10. Copy the entire last line of the file and paste it right at the beginning of the file.
.11. Ensure there are no empty lines at the end of the file. Once again, don't worry about errors your IDE reports.~~

#### Cashback Offers

Login to www.discover.com

Here's the annoying part. You'll need to visit a series of web pages and save the html for each page.
Discover uses server-side rendering for their cashback data (yes, that's horrible). So a GET request to their cashback endpoint returns a HTML file...

Here is the base endpoint URL: https://card.discover.com/cardmembersvcs/rewards/app/getSearchResults?sort=az&page=1

Notice the last query parameter in the url (`page`).
Essentially, you'll have to hit this url multiple times. Each time, you'll increment the page number and download the html.

Currently, only page numbers from `1` to `6` return useful data. Any other number returns a "empty" html.

So for numbers `1` to `6`, repeat the following steps:

1. Visit https://card.discover.com/cardmembersvcs/rewards/app/getSearchResults?sort=az&page=PAGE_NUM_HERE, replacing PAGE_NUM_HERE with the page number
2. Right Click -> View Page Source
3. Copy the html
4. Delete the contents in `/data/cashback/raw/<page-number>.html`, where `<page-number>` is the current page number.
5. Paste the html into the file. No other changes to the file are needed. The file should be valid html.

Congrats! You have now retrieved the latest raw data. This is the hardest part of the process.

Just to double check, you might want to visit `page 7` for the URL above and ensure there are no cashback offers on that page. The html should be fairly short if there are no offers.

In addition to the above, there is also a user-defined file, `/data/cashback/fixedInputData.json` where you can modify offers that cannot be parsed normally. As an example, Discover allows $1 cashback to be redeemed for $1 to spend on Amazon.

### Process the data

Processing the data is abstracted away into a node.js script. All you have to do is run two commands.

Ensure you are in the root directory of this project. Note the following commands will take a few minutes to run:

```bash
npm run updateCashback
```

Now all the processed data (in JSON format) should be in the following files:
- `/data/cashback/data.json`

**Note:** 
*Previously, this section had instructions for processing Discover Deal data.
This has been removed because Discover Deals were retired by Discover.
Processing this data is no longer required.*

Note that this data is also duplicated in the `../docs` directory.
The extension actually retrieves the data directly from Github pages.
So end-users actually receive the data in the `../docs` directory on the `master` branch.

And you're done! This is ALL the data that is used by the extension at run-time.

## Viewing historical data

Since the data is kept under version control, you can view all previous Discover Deals and Discover Cashback Offers by looking at the git commit history. It's interesting to see which retailers Discover adds/removes over the months.
