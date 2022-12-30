const router = require("express").Router();
const { Download } = require("../controllers/Download");

router.get("/api/download", Download);

module.exports = router;
