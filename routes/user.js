const express = require("express");
const router = express.Router();

//TODO: Get all methods from controllers
const {
    createUser,
    getAllUsers,
    getUserById,
    updateUser
} = require("../controllers/user");

//TODO: User Routes
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/create", createUser);
router.put("/update/:id", updateUser);

module.exports = router;