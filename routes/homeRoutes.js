const express = require("express");
const HomeController = require("../controllers/HomeController");

const router = express.Router();

router.get("/", HomeController.search);
router.get("/searchWithoutFilter", HomeController.searchWithoutFilter);

module.exports = router;