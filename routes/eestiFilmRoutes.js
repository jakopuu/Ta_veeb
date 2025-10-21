const express =  require("express");
const router = express.Router();

//kontrollerid
const {
    eestifilm,
    inimesed,
    inimesedAdd,
    inimesedAddPost,
    position,
    filmPositionAdd,
    filmPositionAddPost,
    movies,
    moviesGet,
    movieAddPost,
} = require("../controllers/eestiFilmController");

router.route("/").get(eestifilm);

router.route("/inimesed").get(inimesed);

router.route("/filmiinimesed_add").get(inimesedAdd)

router.route("/filmiinimesed_add").post(inimesedAddPost)

router.route("/position").get(position);

router.route("/position_add").get(filmPositionAdd);

router.route("/position_add").post(filmPositionAddPost);

router.route("/movies").get(movies);

router.route("/movies_add").get(moviesGet);

router.route("/movies_add").post(movieAddPost);

module.exports = router;



