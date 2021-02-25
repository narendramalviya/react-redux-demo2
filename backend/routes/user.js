const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { isSignedIn, isAuthenticated ,isAdmin} = require("../controllers/auth");
const {
	createUser,
	getUserById,
	getAllUsers,
	updateUser,
	deleteUser,
} = require("../controllers/user");
// run this middleware for

// get user
// get user by id
// create user
// update user
// delete user
router.param("userid", getUserById);
// get user by id
router.get("/user/:userid", isSignedIn, isAuthenticated,(req, res) => {
	console.log("user details and auth", req.auth);
	if (!req.user) {
		return res.status(400).json({
			msg: "user not found",
		});
	}
	return res.json({ user: req.user });
});
// get all users
router.get("/users/:userid",isSignedIn,isAdmin, getAllUsers);
// create new user
router.post(
	"/user",
	check("firstName", "name should be at least 3 char").isLength({ min: 3 }),
	check("lastName", "name should be at least 3 char").isLength({ min: 3 }),
	check("email", "email is required").isEmail(),
	check("password", "password should be at least 3 char").isLength({
		min: 3,
	}),
	check("phone", "phone number should be at least 10 char").isLength({
		min: 10,
	}),
	createUser
);
// update user
router.put(
	"/user/:userid",
	check("firstName", "name should be at least 3 char").isLength({ min: 3 }),
	check("lastName", "name should be at least 3 char").isLength({ min: 3 }),
	check("email", "email is required").isEmail(),
	check("password", "password should be at least 3 char").isLength({
		min: 3,
	}),
	check("phone", "phone number should be at least 10 char").isLength({
		min: 10,
	}),
	isSignedIn,
	isAuthenticated,
	updateUser
);
router.delete("/user/:userid",isSignedIn,isAdmin,deleteUser);

module.exports = router;
