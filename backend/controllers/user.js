const User = require("../models/user");
const { check, validationResult } = require("express-validator");
// create user
// update user 
// delete user
// getAll users
// getUser By id

//middleware get user by document id
exports.getUserById = (req, res, next, id) => {
	User.findById(id).exec((err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: "No user was found in DB",
			});
		}
		// console.log("user by id", user);
		// make undefined varibales that no needed
		user.passwordHash = undefined;
		user.salt = undefined;
		req.user = user;
		next();
	});
};
exports.createUser = (req, res) => {
	console.log("req body", req.body);
	const errors = validationResult(req);
	// check errors
	if (!errors.isEmpty()) {
		return res.status(400).json({ error: errors.array() });
	}
	// create new user
	User.create(req.body, (err, data) => {
		if (err) {
			return res.json({
				msg: "getting error",
				error: err,
			});
		}
		console.log("user created ", data);
		// return response
		return res.json({
			msg: "User created!!",
			User: data,
		});
	});
};
// update user by id
exports.updateUser = (req, res) => {
	// console.log("req user", req.user);
	// console.log("req body", req.body);
	User.findByIdAndUpdate(
		{ _id: req.user._id },
		{ $set: req.body },
		{ new: true },
		(err, user) => {
			if (err) {
				return res.status(400).json({
					error: "Getting  error to update this user :" + err,
				});
			}
			user.salt = undefined;
			user.passwordHash = undefined;
			res.json({ result: user });
		}
	);
};

exports.deleteUser = (req, res) => {
	User.deleteOne({ _id:req.body.userId}, function (err) {
        if (err) return res.status(400).json({error:'failed to delete user error:'+err});
        res.status(200).json('user deleted successfully');
      });
};
// get user by email
exports.getUser = (req, res, next) => {
	User.findOne({ email: req.body.email }, (err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: "No user was found in DB",
			});
		}
		req.user = user;
		next();
	});
};
// get all users
exports.getAllUsers = (req, res) => {
	// console.log("process.env.SECRET ",process.env.SECRET);
	User.find({}, (err, users) => {
		if (err) {
			return res.json({
				msg: "error in get all users",
				error: err,
			});
		}
		return res.json({ msg: "All users", users });
	});
};
