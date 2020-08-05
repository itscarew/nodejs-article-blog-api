const express = require("express");

const multer = require("multer");
const router = express.Router();
const {
  get_all_articles,
  create_an_article,
  get_any_article,
  delete_any_article,
  get_all_articles_by_any_user,
  like_any_article,
  unlike_any_article,
} = require("../controllers/articles.controllers");

const checkAuth = require("../auth/check-auth");
const checkAdmin = require("../auth/check-admin");

//path where the images are going to be stored
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/[\/\\:]/g, "_") + file.originalname
    );
  },
});

//specify file size and storage
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

//route to get all articles
router.get("/", checkAuth, get_all_articles);

//route to create an article
router.post("/", upload.single("articleImage"), checkAuth, create_an_article);

//route to get any article
router.get("/:articleId", checkAuth, get_any_article);

//route to delete any article (admin priviledges)
router.delete("/:articleId", checkAuth, checkAdmin, delete_any_article);

//route to get all articles posted by any user
router.get("/user/:userId", checkAuth, get_all_articles_by_any_user);

//route for a user to like any article
router.post("/:articleId/like", checkAuth, like_any_article);

//route for a user to unlike any article
router.post("/:articleId/unlike/:likeId", checkAuth, unlike_any_article);

module.exports = router;
