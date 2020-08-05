const User = require("../models/user.models");
const Articles = require("../models/articles.models");
const Likes = require("../models/likes.models");

exports.get_all_articles = (req, res) => {
  Articles.find()
    .exec()
    .then((article) => {
      res.status(200).json({ articles: article });
    })
    .catch((err) => {
      res.status(400).json({ err: err.message });
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
      res.status(400).json({
        err: err.message,
      });
    });
};

exports.get_any_article = (req, res) => {
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
      res.status(400).json({ err: err.message });
    });
};

exports.get_all_articles_by_any_user = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .exec()
    .then((user) => {
      if (!user) {
        res.status(404).json({ err: "This user does not exists !!" });
      } else {
        Articles.find({ user: userId })
          .select("_id title content articleImage createdAt updatedAt")
          .exec()
          .then((article) => {
            res
              .status(200)
              .json({ message: `Articles posted by user ${userId}`, article });
          })
          .catch((err) => {
            res.status(400).json({ err: err.message });
          });
      }
    })
    .catch((err) => {
      res.status(400).json({ err: err.message });
    });
};

exports.get_user_profile_article = (req, res) => {
  const { userId } = req.user;
  Articles.find({ user: userId })
    .exec()
    .then((article) => {
      res.status(200).json({ message: "All your article", articles: article });
    })
    .catch((err) => {
      err: err.message;
    });
};

exports.delete_user_profile_article = (req, res) => {
  const { articleId } = req.params;
  const { userId } = req.user;
  Articles.deleteOne({ $and: [{ _id: articleId }, { user: userId }] })
    .exec()
    .then((article) => {
      res
        .status(200)
        .json({ message: "Article deleted successfully", article });
    })
    .catch((err) => {
      res.status(400).json({ err: err.message });
    });
};

exports.update_user_profile_article = (req, res) => {
  const { articleId } = req.params;
  const { userId } = req.user;

  Articles.updateOne({
    $and: [
      { _id: articleId },
      { user: userId },
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          updatedAt: new Date(),
        },
      },
    ],
  })
    .exec()
    .then((article) => {
      res.status(200).json({
        message: "Article details updated succesfully",
        article,
      });
    })
    .catch((err) => {
      res.status(400).json({
        err: err.message,
      });
    });
};

exports.delete_any_article = (req, res) => {
  const { articleId } = req.params;
  Articles.deleteOne({ _id: articleId })
    .exec()
    .then((article) => {
      res
        .status(200)
        .json({ message: "Article deleted successfully", article });
    })
    .catch((err) => {
      res.status(400).json({ err: err.message });
    });
};

exports.like_any_article = (req, res) => {
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
      res.status(400).json({ err: err.message });
    });
};

exports.unlike_any_article = (req, res) => {
  const { articleId, likeId } = req.params;

  Articles.updateOne(
    { _id: articleId },
    { $pull: { likes: likeId }, $inc: { likeCount: -1 } }
  )
    .exec()
    .then((article) => {
      res.status(200).json({ article: article });
    })
    .catch((err) => {
      res.status(400).json({ err: err.message });
    });
};
