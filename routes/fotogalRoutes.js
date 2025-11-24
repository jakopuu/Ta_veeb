const express = require("express");
const loginCheck = require("../src/checklogin");

const router = express.Router();
router.use(loginCheck.isLogin);

//kontrollerid
const {galleryHome,
		galleryPage} = require("../controllers/fotogalleryController");

router.route("/").get(galleryHome);

router.route("/:page").get(galleryPage);

module.exports = router;

