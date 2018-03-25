# Contributing Guidelines

We don't have formal guidelines! Just respect the maintainers' decisions and follow the items below

## Testing the build

We have no automated tests yet. We just make sure the extension works via manual testing :)

Here is a non-exhaustive list of manual tests to perform:

- Ensure you can view deals and cashback rewards on various sites. Visit various retailers' websites to see if the extension recognizes the deal or cashback reward.
- Look through `/data/deal/data.json` and `/data/cashback/data.json` and ensure that the extension properly displays offers for at least 5 of the sites.
- Try finding a site that has both a deal and a cashback reward. Ensure the extension displays both of them.

## Codacy

We use Codacy to check code style. Codacy automatically runs every time a pull request is submitted.
The Codacy Bot will comment on any code that doesn't match the style guide.

Sometimes it will be very picky, so feel free to only fix the most obvious errors it finds.

