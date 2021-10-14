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
      res.json({ emailErr: "Email Already exist" });
      return;
    }
    let phone = await User.countDocuments({ phone_no: "+61" + body.phone_no });
    if (body.phone_no.length !== 9) {
      res.json({
        phoneErr: "Wrong Phone Number Format, Phone number must be 9 digits.",
      });
      return;
    }
    if (phone !== 0) {
      res.json({ phoneErr: "Phone Number Already exist" });
      return;
    }
    let userObj = new User(body);

    if (body.password.length < 8) {
      res.json({
        passErr: "Password must be greater or equal to 8 characters",
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
      let verificationUrl = `${hostName}/api/user/userverification/${createdUser._id}/${otp}?Please_DONOT_CHANGE_THIS_URL`;

      //TODO: SEND Verification Email...
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "cafeperks.falcon@gmail.com",
          pass: "cafeperks123",
        },
      });
      transporter.sendMail(
        {
          from: "cafeperks.falcon@gmail.com",
          to: req.body.email,
          subject: "Hello",
          html: "<b>Hello world?</b>Najam ki maa ki chut",
        },
        function (err, info) {
          if (err) {
            console.log(err);
            res.status(500).json({ msg: "Something Went Wrong" });
          } else {
            res.status(200).json({
              msg: "User Created!",
              verificationUrl: verificationUrl,
            });
          }
        }
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
            }
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
                "<title>BSW-Engineering | Verification</title><script>alert('Account Verified'); window.location.href='/';</script>"
              );
          });
        } else {
          res.send(
            "<title>BSW-Engineering | ERROR 404</title><script>alert('URL Modified'); window.location.href='/';</script>"
          );
        }
      } else {
        res
          .status(200)
          .send(
            "<title>BSW-Engineering | Verification</title><script>alert('Account Verified'); window.location.href='/';</script>"
          );
      }
    } else {
      res.send(
        "<title>Error 404 | URL Modified</title><script>alert('URL Modified'); window.location.href='/';</script>"
      );
    }
  } catch (err) {
    res.status(500).json(err);
  }
}
async function login(req, res, next) {
  try {
    console.log("login");
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

function checkAuth(req, res, next) {
  console.log("auth");
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.json({ err: "Authenctication Failed" });
  }
}

async function loggedIn(req, res) {
  console.log("logged in");
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
  checkAuth,
  loggedIn,
  logout,
  verification,
};
