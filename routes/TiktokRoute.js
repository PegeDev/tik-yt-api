const { getTrending, getUser } = require("../controllers/Tiktok");

const router = require("express").Router();

router.get("/tiktok/trending", getTrending);
router.get("/tiktok/user/feed/", getUser);

module.exports = router;
