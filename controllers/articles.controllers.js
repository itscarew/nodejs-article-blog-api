const Articles = require("../models/articles.models");

exports.get_all_articles = (req, res) => {
  Articles.find()
    .exec()
    .then((article) => {
      res.status(200).json({ article });
    })
    .catch((err) => {
      res.status(500).json({ message: "Something went wrong" });
    });
};

exports.create_an_article = (req, res) => {
  const article = new Articles({
    title: req.body.title,
    content: req.body.content,
    articleImage: req.file.path,
    user: req.user.userId,
  });

  return article
    .save()
    .then((article) => {
      res.status(201).json({
        message: "Article created",
        article: article,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Something went wrong , Article not created",
      });
    });
};

exports.get_an_article = (req, res) => {
  const { articleId } = req.params;
  Articles.find({ _id: articleId })
    .populate("user", "_id username name email joined ")
    .exec()
    .then((article) => {
      res.status(200).json({ message: "Article found", article :article[0] });
    })
    .catch((err) => {
      res.status(404).json({ message: "No article found" });
    });
};

exports.get_all_articles_by_a_user = (req, res) => {
  const { userId } = req.params;
  Articles.find({ user: userId })
    .select("_id title content articleImage createdAt updatedAt")
    .exec()
    .then((article) => {
      res
        .status(200)
        .json({ message: `Articles posted by user ${userId}`, article });
    })
    .catch((err) => {
      res.status(404).json({ message: "No article found" });
    });
};

exports.delete_an_article = (req, res) => {
  const { articleId } = req.params;
  Articles.deleteOne({ _id: articleId })
    .exec()
    .then((article) => {
      res
        .status(200)
        .json({ message: "Article deleted successfully", article });
    })
    .catch((err) => {
      res.status(404).json({ message: "Article does not exist" });
    });
};

exports.update_an_article = (req, res) => {
  const { articleId } = req.params;

  Articles.updateOne(
    { _id: articleId },
    {
      $set: {
        title: req.body.title,
        content: req.body.content,
        updatedAt: new Date(),
      },
    }
  )
    .exec()
    .then((article) => {
      res.status(200).json({
        message: "Article details updated succesfully",
        article,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: err,
      });
    });
};
