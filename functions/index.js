const functions = require("firebase-functions");
const { ApifyClient } = require('apify-client');
const cors = require("cors")({ origin: true });

// This pulls the secret token from the screen you found earlier!
const client = new ApifyClient({
    token: process.env.APIFY_TOKEN 
});

exports.triggerApifyScraper = functions.https.onRequest((req, res) => {
    return cors(req, res, async () => {
        try {
            const { asinList } = req.body;
            // Starts the Amazon crawler with your ASINs
            const run = await client.actor('apify/amazon-crawler').call({
                directUrls: asinList.map(asin => `https://www.amazon.com{asin}`),
            });
            // Grabs the results
            const { items } = await client.dataset(run.defaultDatasetId).listItems();
            res.status(200).send({ success: true, data: items });
        } catch (error) {
            res.status(500).send({ success: false, error: error.message });
        }
    });
})
  ;
