const db = require("../utils/db");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const User = db.User;
const passport = require("passport");
require("../utils/passportConfig")(passport);

async function getAllUsers(req, res) {
	try {
		let users = await User.find();
		res.status(200).json(users);
	} catch (err) {
		// console.log("msg: ",err.msg);
		res.status(500).json(err);
	}
}
async function getUserById(req, res) {
	try {
		let user = await User.findById(req.params.id);
		res.status(200).json(user);
	} catch (err) {
		res.status(500).json(err);
	}
}
async function createUser(req, res) {
	var chars = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var otpLength = 15;
	var otp = "";
	let body = req.body;
	try {
		let email = await User.countDocuments({ email: body.email });
		if (email !== 0) {
			res.json({ err: "Email Already exist" });
			return;
		}
		let phone = await User.countDocuments({ phone_no: "+61" + body.phone_no });
		// if (body.phone_no.length !== 9) {
		// 	res.json({
		// 		err: "Wrong Phone Number Format, Phone number must be 9 digits.",
		// 	});
		// 	return;
		// }
		if (phone !== 0) {
			res.json({ err: "Phone Number Already exist" });
			return;
		}
		let userObj = new User(body);

		if (body.password.length < 8) {
			res.json({
				err: "Password must be greater or equal to 8 characters",
			});
			return;
		}
		for (var i = 0; i <= otpLength; i++) {
			var randomNumber = Math.floor(Math.random() * chars.length);
			otp += chars.substring(randomNumber, randomNumber + 1);
		}
		userObj.otp = otp;
		userObj.phone_no = "+61" + body.phone_no;
		userObj.password = bcrypt.hashSync(body.password, 10);

		await User.create(userObj).then((createdUser) => {
			let hostName = `${req.protocol}://${req.headers.host}`;
			let verificationUrl = `${hostName}/api/user/userverification/${createdUser._id}/${otp}?via_email=true`;

			var transporter = nodemailer.createTransport({
				service: "gmail",
				port: "465",
				secure: true,
				auth: {
					user: process.env.EMAIL,
					pass: process.env.EMAIL_PASS,
				},
			});
			const btnStyle = `
				font-family: Helvetica;
				border-radius: 8px;
				background-color: tomato;
				border: none;
				color: white;
				padding: 15px 32px;
				text-align: center;
				text-decoration: none;
				display: inline-block;
				font-size: 16px;`;
			const html = `
				<body style="margin: 0; padding: 0">
					<table role="presentation" style="
								width: 100%;
								border-collapse: collapse;
								border: 0;
								border-spacing: 0;
								background: #ffffff;
							">
						<tr>
							<td align="center" style="padding: 0">
								<table role="presentation" style="
									width: 602px;
									border-collapse: collapse;
									border: 1px solid #cccccc;
									border-spacing: 0;
									text-align: left;
									">
									<tr>
										<td align="center" style="padding: 20px 5px 10px 5px; background: rgb(255, 255, 255)">
											<img src="https://i.dlpng.com/static/png/6748900_preview.png" alt="" width="150"
												style="height: auto; display: block" />
											<h2 style="font-family: Gadugi">Hi ${userObj.name}, Welcome to BSW-Engineerings</h2>
										</td>
									</tr>
									<tr>
										<td align="center" style="padding: 20px 10px 20px 10px;background: rgba(148, 148, 148, 0.164);">
											<h3 style="font-family: Monospace; font-size:  25px;">
												Continue signing up for BSW-Engineerings by clicking the button below:
											</h3>
											<a href="${verificationUrl}" style="${btnStyle}">Confirm Email</a>
										</td>
									</tr>
									<tr align="center" style="padding: 20px 10px 20px 10px;">
										<td>
											<div style="padding-top: 10px;">
												<p style="font-family: Helvetica;">Not able to enter the code? Paste the following link
													into your browser:</p>
												<p style="color: rgb(0, 47, 255); font-family: Helvetica;">${verificationUrl}</p>
											</div>
										</td>
									</tr>
									<tr>
										<td style="padding: 10px 10px 10px 10px; background: #ee4c50">
											<p style="color: white; font-family: Helvetica;">Address: 21 Darlot road, Landsdale, WA 6065</p>
											<p style="color: white; font-family: Helvetica;">
												Call: 
												<a style="color: white; font-family: Helvetica;" href="tel:+610862050609">+61 (08) 62050609</a>
											</p>
											<p style="color: white; font-family: Helvetica;">Email:
												<a style="color: white; font-family: Helvetica;" href="mailto:sales@bswengineering.com">sales@bswengineering.com</a>
											</p>
										</td>
									</tr>
									<tr>
									<td>
										<p align="center" style="color: #6b6b6b; font-family: Helvetica;">This email is generated automatically please do not reply.</p>
									</td>
									</tr>
								</table>
							</td>
						</tr>
					</table>
				</body>
				`;
			transporter.sendMail(
				{
					from: process.env.EMAIL,
					to: req.body.email,
					subject: "Confirm Your Email address",
					text: "This email is generated automatically please do not reply",
					html: html,
				},
				function (err, info) {
					if (err) {
						res.json({ err: err.message });
					} else {
						res.status(200).json({
							msg: "User Created!",
						});
					}
				},
			);
		});
	} catch (err) {
		res.status(500).json(err);
	}
}
//! Update all info insted Password here...
async function updateUser(req, res) {
	let body = req.body;
	try {
		//? All users expet this to check email emails and pass
		let users = await User.find({ _id: { $ne: req.params.id } });

		// ? Current user
		// let currentUser = await User.findById(req.params.id);

		users.forEach((singleUser) => {
			if (singleUser.phone_no === "+61" + body.phone_no) {
				res.json({ phoneErr: "Phone Number Already exist" });
				return;
			}
		});
		if (body.phone_no.length !== 9) {
			res.json({
				phoneErr: "Wrong Phone Number Format, Phone number must be 9 digits.",
			});
			return;
		}
		body.phone_no = "+61" + body.phone_no;
		// * if phone number did't exist...
		await User.findByIdAndUpdate(req.params.id, body).then(() => {
			res.status(200).json({ msg: "User updated Sucessfully!" });
		});
	} catch (err) {
		res.status(500).json(err);
	}
}
async function updatePassword(req, res) {
	let body = req.body;
	try {
		let thisUser = await User.findById(req.params.id);

		bcrypt.compare(body.oldPass, thisUser.password, function (err, result) {
			if (result) {
				if (body.newPass === body.newPassConfirm) {
					bcrypt.compare(
						body.newPass,
						thisUser.password,
						function (err, result) {
							if (result) {
								res.json({
									passErr: "New password cannot be same as Old Password!",
								});
								return;
							} else {
								thisUser.password = bcrypt.hashSync(body.newPass, 10);
								User.findByIdAndUpdate(req.params.id, thisUser).then(() => {
									res
										.status(200)
										.json({ msg: "Password updated Sucessfully!" });
								});
							}
						},
					);
				} else {
					res.json({ passErr: "Please Confirm your Password!" });
					return;
				}
			} else {
				res.json({ passErr: "Password didn't match!" });
				return;
			}
		});
	} catch (err) {
		res.status(500).json(err);
	}
}
async function forgetPassword(req, res) {
	try {
		let userObj = await User.findOne({ email: req.body.email });
		if (userObj === null) {
			res.status(404).json({ err: "User not found!" });
			return;
		}
		var chars =
			"abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		let password = "";
		for (var i = 0; i <= 8; i++) {
			var randomNumber = Math.floor(Math.random() * chars.length);
			password += chars.substring(randomNumber, randomNumber + 1);
		}
		const html = `
    <body style="margin: 0; padding: 0">
      <table role="presentation" style="
                width: 100%;
                border-collapse: collapse;
                border: 0;
                border-spacing: 0;
                background: #ffffff;
              ">
          <tr>
              <td align="center" style="padding: 0">
                  <table role="presentation" style="
                      width: 602px;
                      border-collapse: collapse;
                      border: 1px solid #cccccc;
                      border-spacing: 0;
                      text-align: left;
                    ">
                      <tr>
                          <td align="center" style="padding: 20px 5px 10px 5px; background: rgb(255, 255, 255)">
                              <img src="https://icon-library.com/images/reset-password-icon/reset-password-icon-29.jpg" alt="" width="150"
                                  style="height: auto; display: block" />
                              <h2 style="font-family: Gadugi">Hi ${userObj.name}.</h2>
                          </td>
                      </tr>
                      <tr>
                          <td align="center" style="padding: 20px 10px 20px 10px;background: rgba(184, 183, 183, 0.651);">
                              <h3 style="font-family: Monospace; font-size: 25px;">
                                  Your new Password is below:
                              </h3>
                              <p style="font-family: monospace;
                              font-weight: bold;
                              background-color: rgb(255, 255, 255);
                              border: none;
                              color: rgb(0, 0, 0);
                              padding: 15px 32px;
                              text-align: center;
                              text-decoration: none;
                              display: inline-block;
                              font-size: 20px;">${password}</p>
                              <h3 style="font-family: Monospace; font-size: 15px;">
                                  You can use this password to log into your account.
                              </h3>
                          </td>
                      </tr>
                      <tr>
                          <td style="padding: 10px 10px 10px 10px; background: #ee4c50">
                              <p style="color: white; font-family: Helvetica;">Address: 21 Darlot road, Landsdale, WA 6065</p>
                              <p style="color: white; font-family: Helvetica;">
                                  Call: 
                                  <a style="color: white; font-family: Helvetica;" href="tel:+610862050609">+61 (08) 62050609</a>
                              </p>
                              <p style="color: white; font-family: Helvetica;">Email:
                                  <a style="color: white; font-family: Helvetica;" href="mailto:sales@bswengineering.com">sales@bswengineering.com</a>
                              </p>
                          </td>
                      </tr>
                      <tr>
                        <td>
                          <p align="center" style="color: #6b6b6b; font-family: Helvetica;">This email is generated automatically please do not reply.</p>
                        </td>
                      </tr>
                  </table>
              </td>
          </tr>
      </table>
  </body>
    `;
		userObj.password = bcrypt.hashSync(password, 10);

		User.findByIdAndUpdate(userObj._id, userObj).then(() => {
			var transporter = nodemailer.createTransport({
				service: "gmail",
				port: "465",
				secure: true,
				auth: {
					user: process.env.EMAIL,
					pass: process.env.EMAIL_PASS,
				},
			});
			transporter.sendMail(
				{
					from: process.env.EMAIL,
					to: userObj.email,
					subject: "Password Reset Email",
					html: html,
				},
				function (err, info) {
					if (err) {
						console.log(err.message);
						res.json({ err: err.message });
					} else {
						res.status(200).json({
							msg: "Password Update Email sent.",
						});
					}
				},
			);
		});
	} catch (err) {
		res.status(500).json(err);
	}
}
async function verification(req, res) {
	try {
		let user = await User.findById(req.params.id);
		if (user !== null) {
			if (user.otp === null) {
				res.status(200).send("<script>window.location.href='/';</script>");
			} else if (user.status === false) {
				if (user.otp === req.params.otp) {
					user.status = true;
					user.otp = null;
					await User.findByIdAndUpdate(req.params.id, user).then(() => {
						res
							.status(200)
							.send(
								`<title>BSW-Engineering | Verification</title><script>alert('Account Verified'); window.location.href='${process.env.RETURN_URL}';</script>`,
							);
					});
				} else {
					res.send(
						`<title>BSW-Engineering | ERROR 404</title><script>alert('URL Modified'); window.location.href='${process.env.RETURN_URL}';</script>`,
					);
				}
			} else {
				res
					.status(200)
					.send(
						`<title>BSW-Engineering | Verification</title><script>alert('Account Verified'); window.location.href='${process.env.RETURN_URL}';</script>`,
					);
			}
		} else {
			res.send(
				`<title>Error 404 | URL Modified</title><script>alert('URL Modified'); window.location.href='${process.env.RETURN_URL}';</script>`,
			);
		}
	} catch (err) {
		res.status(500).json(err);
	}
}
async function contactUs(req, res) {
	try {
		var transporter = nodemailer.createTransport({
			service: "gmail",
			port: "465",
			secure: true,
			auth: {
				user: process.env.EMAIL,
				pass: process.env.EMAIL_PASS,
			},
		});
		transporter.sendMail(
			{
				from: process.env.EMAIL,
				to: process.env.CONTACT_EMAIL,
				subject: `Message from ${req.body.name}`,
				text: `From: ${req.body.email}\nMessage: ${req.body.msg}`,
			},
			function (err, info) {
				if (err) {
					console.log(err.message);
					res.json({ err: err.message });
				} else {
					res.status(200).json({
						msg: "Your message has been sent.",
					});
				}
			},
		);
	} catch (err) {
		res.status(500).json(err);
	}
}
async function login(req, res, next) {
	try {
		passport.authenticate("local", (err, user) => {
			if (err) throw err;

			if (!user) {
				res.send("Invalid email or password");
			} else {
				req.logIn(user, (err) => {
					if (err) throw err;
					res.send(user);
				});
			}
		})(req, res, next);
	} catch (err) {
		res.status(500).json(err);
	}
}
async function loggedIn(req, res) {
	res.json({ status: 200, user: req.user });
}

async function logout(req, res) {
	try {
		req.logOut();
		res.status(200).send("Logout successfully");
	} catch (err) {
		res.status(500).json(err);
	}
}

module.exports = {
	getAllUsers,
	getUserById,
	createUser,
	updateUser,
	updatePassword,
	login,
	loggedIn,
	logout,
	verification,
	forgetPassword,
	contactUs,
};
