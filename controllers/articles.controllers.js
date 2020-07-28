const Articles = require("../models/articles.models");
const Likes = require("../models/likes.models");

exports.get_all_articles = (req, res) => {
  Articles.find()
    .exec()
    .then((article) => {
      res.status(200).json({ article });
    })
    .catch((err) => {
      res.status(404).json({ err: err });
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
        err: err,
      });
    });
};

exports.get_an_article = (req, res) => {
  const { articleId } = req.params;
  Articles.findOne({ _id: articleId })
    .populate("user", "_id username name email joined ")
    .exec()
    .then((article) => {
      if (!article) {
        res.status(404).json({ err: "Article does not exist" });
      } else
        res.status(200).json({ message: "Article found", article: article });
    })
    .catch((err) => {
      res.status(400).json({ err: err });
      console.log(err);
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
      res.status(404).json({ err: err });
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
      res.status(500).json({ err: err });
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
        err: err,
      });
    });
};

exports.like_an_article = (req, res) => {
  const { articleId } = req.params;
  const like = new Likes({
    article: articleId,
    user: req.user.userId,
  });

  Articles.updateOne(
    { _id: articleId },
    { $push: { likes: like }, $inc: { likeCount: +1 } }
  )
    .exec()
    .then((article) => {
      res.status(201).json({ article: article });
    })
    .catch((err) => {
      res.status(500).json({ err: err });
    });
};

exports.unlike_an_article = (req, res) => {
  const { articleId, likeId } = req.params;

  Articles.updateOne(
    { _id: articleId },
    { $pull: { likes: likeId }, $inc: { likeCount: -1 } }
  )
    .exec()
    .then((article) => {
      res.status(201).json({ article: article });
    })
    .catch((err) => {
      res.status(500).json({ err: err });
    });
};
