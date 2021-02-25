const mongoose = require("mongoose");
const crypto = require("crypto");
const uuidv1 = require("uuid/v1");

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
			unique: false,
			minLength: 3,
			maxLength: 15,
		},
		lastName: {
			type: String,
			required: true,
			unique: false,
			minLength: 3,
			maxLength: 15,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		phone: {
			type: String,
			required: true,
			unique: true,
			min: 10,
			max: 10,
		},
		passwordHash: {
			type: String,
			// required: true,
		},
		salt: {
			type: String,
			// required: true,
		},
		role:{
		    type:Number,
			default:0
		}
	},
	{ timestamps: true }
);

userSchema.virtual("password").set(function (password) {
	this._password = password;
	this.salt = uuidv1();
	this.passwordHash = this.securePassword(password);
});

userSchema.methods = {
	autheticate: function (plainpassword) {
		return this.securePassword(plainpassword) === this.passwordHash;
	},

	securePassword: function (plainpassword) {
		if (!plainpassword) return "";
		try {
			return crypto
				.createHmac("sha256", this.salt)
				.update(plainpassword)
				.digest("hex");
		} catch (err) {
			return "";
		}
	},
};

//Export the model
module.exports = mongoose.model("Users", userSchema);
