const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/checkAuth");
const checkGuest = require("../middlewares/checkGuest");
const checkAdmin = require("../middlewares/checkAdmin");

//TODO: Get all methods from controllers
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  updatePassword,
  login,
  loggedIn,
  logout,
  verification,
  forgetPassword,
  contactUs,
  createGuest,
  guestLoggedin,
  guestLogout,
  adminLogin,
} = require("../controllers/user");

//TODO: User Routes
router.get("/", getAllUsers);
router.get("/contact", contactUs);
router.post("/create", createUser);
router.put("/update/:id", updateUser);
router.put("/forgetpassword", forgetPassword);
router.put("/update/password/:id", updatePassword);
router.get("/userverification/:id/:otp", verification);
router.post("/login", login);
router.post("/admin/login", adminLogin);
router.patch("/loggedin", checkAuth, loggedIn); //! not working with get
router.patch("/admin/loggedin", checkAdmin, loggedIn); //! not working with get
router.delete("/logout", logout);
router.post("/createguest", createGuest);
router.patch("/guestloggedin", checkGuest, guestLoggedin); //! not working with get
router.delete("/guestLogout", guestLogout);
router.get("/:id", getUserById);

module.exports = router;
