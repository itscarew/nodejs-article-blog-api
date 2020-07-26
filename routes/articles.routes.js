const express = require("express");

const multer = require("multer");
const router = express.Router();
const {
  get_all_articles,
  create_an_article,
  get_an_article,
  delete_an_article,
  update_an_article,
  get_all_articles_by_a_user,
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
router.get("/", checkAuth, checkAdmin, get_all_articles);

//route to create an article
router.post("/", upload.single("articleImage"), checkAuth, create_an_article);

//route to get an article
router.get("/:articleId", checkAuth, get_an_article);

//route to get all articles posted by a user
router.get("/user/:userId", checkAuth, get_all_articles_by_a_user);

//route to delete an article
router.delete("/:articleId", checkAuth, delete_an_article);

//route to update an article
router.patch("/:articleId", checkAuth, update_an_article);

module.exports = router;
