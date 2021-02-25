const User = require("../models/user");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
// sign in
exports.signIn = (req, res) => {
	const errors = validationResult(req);
	const { email, password } = req.body;
	//   if have input validation error send error response
	if (!errors.isEmpty()) {
		return res.status(400).json({
			error: errors.array()[0],
		});
	}
	//   find user by email and check password ,then send token in cookie
	User.findOne({ email }, (err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: "USER email does not exists " + err,
			});
		}
		//   check password is valid
		if (!user.autheticate(password)) {
			return res.status(400).json({
				error: "Email and password do not match",
			});
		}

		//create token
		const token = jwt.sign({ _id: user._id }, process.env.SECRET);
		//put token in cookie
		res.cookie("token", token, { expire: new Date() + 3600000 });
		//send response to front end
		const { _id, firstName, lastName, email, phone,role } = user;
		return res.json({ token, user: { _id, firstName, email,role } });
	});
};
// middleware extract token from auth header if not available throws error also for invalid
exports.isSignedIn = expressJwt({
	secret: process.env.SECRET,
	userProperty: "auth",
	algorithms: ["HS256"],
});
// middleware user is authenticated 
// example: user can update only it's own profile 
exports.isAuthenticated = (req, res, next) => {
	let checker = req.user && req.auth && req.user._id == req.auth._id;
	if (!checker) {
		return res.status(403).json({
			error: "ACCESS DENIED",
		});
	}
	next();
};
exports.isAdmin = (req, res, next) => {
    console.log('isaAdmin req.user ',req.user)
    if (!(req.user.role === 1 && req.auth._id == req.user.id)) {
      return res.status(403).json({
        error: "You are not ADMIN, Access denied"
      });
    }
    next();
  };
// sign out ,clear cookies
exports.signout = (req, res) => {
	res.clearCookie("token");
	res.json({
		message: "User signout successfully",
	});
};
