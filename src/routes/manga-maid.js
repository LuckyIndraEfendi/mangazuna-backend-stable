const { Router } = require("express");
const {
  projectUpdate,
  lastUpdated,
  mangaDetails,
  mangaChapter,
  mangaGenreList,
  mangaByGenres,
  mangaByAdvSearch,
} = require("../controllers/manga-maid");

const router = Router();

router.get("/manga/advsearch", mangaByAdvSearch);
router.get("/manga/project", projectUpdate);
router.get("/manga/lastupdated", lastUpdated);
router.get("/manga/genre-list", mangaGenreList);
router.get("/manga/genres/:genresId", mangaByGenres);
router.get("/manga/:mangaId", mangaDetails);
router.get("/manga/chapter/:chapterId", mangaChapter);

module.exports = router;
