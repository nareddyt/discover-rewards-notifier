# Discover® Data

This folder contains raw and processed data about **Discover Deals** and **Discover Cashback Offers**. This data is required for the extension to function.

## Directory Structure

```
.
├── cashback
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

This makes it impossible for the Chrome Extension to make API calls to retrieve data at run-time.
Instead, developers manual download the process the data ahead of time.
This data is bundled into the Chrome Extension, allowing users to be notified when they visit specific web sites.

Hopefully this mechanism will change in the future. [See Issue #21](https://github.com/nareddyt/discover-rewards-notifier/issues/21)

### Pros

- **Simplified Runtime Logic:** The extension is very simple, it just needs to read the data from a file.
- **Super-fast Load Times:** End-users don't notice any delay between visiting a website and the extension's icon lighting up.

### Cons

- **Data Updates:** The data expires about twice a month, so we need to manually update the data then. This could take up a lot of the developers' time.
- **Delay in Updates:** The data is bundled into an extension's release, so we need to create a new release every time we update the data. End-users might not receive this update for a couple of days.

Note that **Delay in Updates** is an issue that out-weighs all the pros...

## Updating the Data

We'll go over how to actually run the data update.

### Acquire raw data

This assumes you are using Chrome Web Browser to access the raw data on Discover's Website.

**NOTE:** You must have access to www.discover.com to acquire the data

#### Deals

1. Login to www.discover.com
2. Visit [this page](https://card.discover.com/cardmembersvcs/deals/app/home#/deals)
3. Click on the `All Deals` button in the top-right corner.
4. Right Click -> Inspect Element
5. Find the following element in the Elements tree: `<div class="rows deals">`. When you hover over this element, you should see all the deal cards become highlighted in blue.
6. Right Click -> Copy -> Copy Element
7. Delete the contents in `/data/deal/raw.html`.
8. Paste data into this file. Don't worry about any errors in the file.
9. Delete `<div class="row deals">` from the file. This should be the first html element in the file.
10. Copy the entire last line of the file and paste it right at the beginning of the file.
11. Ensure there are no empty lines at the end of the file. Once again, don't worry about errors your IDE reports.

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

### Process the data

Processing the data is abstracted away into a node.js script. All you have to do is run two commands.

Ensure you are in the root directory of this project. Note the following commands will take a few minutes to run:

```bash
npm run updateDeal
npm run updateCashback
```

Now all the processed data (in JSON format) should be in the following files:
- `/data/deal/data.json`
- `/data/cashback/data.json`

And you're done! This is ALL the data that is used by the extension at run-time.

## Viewing historical data

Since the data is kept under version control, you can view all previous Discover Deals and Discover Cashback Offers by looking at the git commit history. It's interesting to see which retailers Discover adds/removes over the months.