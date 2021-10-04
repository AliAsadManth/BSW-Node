const express = require("express");
const router = express.Router();

//TODO: Get all methods from controllers
const {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    updatePassword
} = require("../controllers/user");

//TODO: User Routes
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/create", createUser);
router.put("/update/:id", updateUser);
router.put("/update/password/:id", updatePassword);

module.exports = router;