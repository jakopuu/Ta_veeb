const express =  require("express");
const multer = require("multer");
const router = express.Router();
//seadistame vahevara fotode yleslaadimiseks kindlasse kataloogi
const uploader = multer({dest: "./public/gallery/orig/"});

const {
	fotouploadPage,
	fotouploadPagePost
} = require("../controllers/fotouploadController");

router.route("/").get(fotouploadPage);

router.route("/").post(uploader.single("fotoInput"),fotouploadPagePost);

module.exports = router;