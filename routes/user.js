const express = require("express");
const router = express.Router();

//TODO: Get all methods from controllers
const {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    updatePassword,
    login,
    checkAuth,
    loggedIn,
    logout,
    verification
} = require("../controllers/user");

//TODO: User Routes
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/create", createUser);
router.put("/update/:id", updateUser);
router.put("/update/password/:id", updatePassword);
router.get("/userverification/:id/:otp", verification);
router.post("/login", login);
router.patch("/loggedin", checkAuth, loggedIn);//! not working with get
router.delete("/logout", logout);

module.exports = router;