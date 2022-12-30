const axios = require("axios");
const TiktokScraper = require("tiktok-scraper");

const main = async () => {
  try {
    const scrape = await TiktokScraper.trend("", {
      number: 1,
      sessionList: ["sid_tt=8c2b85a4e7351d1bb2f785ae29a6ad7d"],
    });
    await console.log(scrape);
  } catch (err) {
    console.log(err);
  }
};

main();
