const functions = require("firebase-functions");
const { ApifyClient } = require('apify-client');
const cors = require("cors")({ origin: true }); // This line allows the connection

const client = new ApifyClient({
    token: process.env.APIFY_TOKEN 
});

exports.triggerApifyScraper = functions.https.onRequest((req, res) => {
    // Wrap your entire logic in the 'cors' function
    return cors(req, res, async () => {
        try {
            const { asinList } = req.body;
            const run = await client.actor('apify/amazon-crawler').call({
                directUrls: asinList.map(asin => `https://www.amazon.com{asin}`),
            });
            const { items } = await client.dataset(run.defaultDatasetId).listItems();
            
            res.status(200).send({ success: true, data: items });
        } catch (error) {
            console.error(error);
            res.status(500).send({ success: false, error: error.message });
        }
    });
})
    ;
