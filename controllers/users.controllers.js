const User = require("../models/user.models");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.get_all_users = (req, res) => {
  User.find()
    .exec()
    .then((user) => {
      res.status(200).json({ user });
    })
    .catch((err) => {
      res.status(500).json({ err: err });
    });
};

exports.register_user = (req, res) => {
  User.find({
    $or: [{ email: req.body.email }, { username: req.body.username }],
  })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(401).json({
          err: "Email already exists or username has already been taken",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              err: err,
            });
          } else {
            const user = new User({
              username: req.body.username,
              name: req.body.name,
              email: req.body.email,
              password: hash,
              role: req.body.role,
            });
            return user
              .save()
              .then((user) => {
                res.status(201).json({
                  message: "User created successfully",
                  user,
                });
              })
              .catch((err) => {
                res.status(500).json({
                  err: err,
                });
              });
          }
        });
      }
    });
};

exports.login_user = (req, res) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          err: "This User does not exist !",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            err: "Authentication Failed, Password Incorrect",
          });
        } else if (result) {
          const token = jwt.sign(
            {
              username: user[0].username,
              name: user[0].name,
              email: user[0].email,
              userId: user[0]._id,
              role: user[0].role,
            },
            "secret"
          );
          return res.status(200).json({
            message: "Authentication Successful, Logged In",
            token: token,
            user: user[0],
          });
        } else
          res.status(401).json({
            err: "Authentication Failed",
          });
      });
    })
    .catch((err) => {
      res.status(500).json({
        err: err,
      });
    });
};

exports.get_logged_in_user_profile = (req, res) => {
  User.find({ _id: req.user.userId })
    .exec()
    .then((user) => {
      res.status(200).json({ user: user[0] });
    })
    .catch((err) => {
      res.status(500).json({ err: err });
    });
};

exports.get_a_user = (req, res) => {
  const { userId } = req.params;
  User.find({ _id: userId })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        res.status(404).json({ message: "No user exists" });
      } else res.status(200).json({ message: "User found", user: user[0] });
    })
    .catch((err) => {
      res.status(500).json({ err: err });
    });
};

exports.delete_a_user = (req, res) => {
  const { userId } = req.params;
  User.deleteOne({ _id: userId })
    .exec()
    .then((user) => {
      res.status(200).json({ message: "User has been succesfully deleted" });
    })
    .catch((err) => {
      res.status(500).json({ err: err });
    });
};

exports.update_a_user = (req, res) => {
  const { userId } = req.params;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  User.updateOne({ _id: userId }, { $set: updateOps })
    .exec()
    .then((user) => {
      res.status(200).json({
        message: "User details updated succesfully",
        user,
      });
    })
    .catch((err) => {
      res.status(500).json({
        err: err,
      });
    });
};

exports.update_a_user_password = (req, res) => {
  const { userId } = req.params;
  const { password } = req.body;
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({
        err: err,
      });
    } else {
      User.updateOne({ _id: userId }, { $set: { password: hash } })
        .exec()
        .then((user) => {
          res.status(200).json({
            message: "User password updated succesfully",
            user,
          });
        })
        .catch((err) => {
          res.status(500).json({
            err: err,
          });
        });
    }
  });
};
