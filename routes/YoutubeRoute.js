const { uploadYoutube } = require("../controllers/Youtube");
const { userLogged } = require("../middleware/Auth");
const router = require("express").Router();

router.post("/youtube/upload", userLogged, uploadYoutube);

module.exports = router;
