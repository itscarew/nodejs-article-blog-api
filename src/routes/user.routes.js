const express = require("express");
const router = express.Router();

const checkAuth = require("../auth/check-auth");
const checkAdmin = require("../auth/check-admin");
const {
  get_all_users,
  register_user,
  login_user,
  get_a_user,
  delete_a_user,
  update_a_user,
  update_a_user_password,
  get_logged_in_user_profile,
} = require("../controllers/users.controllers");

//route to get all users
router.get("/", checkAuth, checkAdmin, get_all_users);

//route to register a user
router.post("/register", register_user);

//route to login a user
router.post("/login", login_user);

//route to get logged in user profile
router.get("/profile", checkAuth, get_logged_in_user_profile);

//route to find a user
router.get("/:userId", checkAuth, get_a_user);

//route to delete a user
router.delete("/:userId", checkAuth, delete_a_user);

//route to update a users details
router.patch("/:userId", checkAuth, update_a_user);

//route to update a users password
router.patch("/:userId/password", checkAuth, update_a_user_password);

module.exports = router;
