const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const {createUser} = require('../controllers/user');
const {signIn,signout} = require('../controllers/auth')
router.post(
	"/signup",
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
router.post(
	"/signin",
	check("email", "valid email is required").isEmail(),
	check("password", "password should be at least 3 char").isLength({
		min: 3,
	}),
	signIn
);

router.post(
	"/signout",
	signout
);
module.exports = router;
