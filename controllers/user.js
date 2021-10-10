const db = require("../utils/db");
const bcrypt = require("bcrypt");
const User = db.User;
const passport = require("passport");
require("../utils/passportConfig")(passport);

async function getAllUsers(req, res){
    try{
        let users = await User.find();
        res.status(200).json(users);
    }catch(err){
        // console.log("Message: ",err.message);
        res.status(500).json(err);
    }
}
async function getUserById(req, res){
    try{
        let user = await User.findById(req.params.id);
        res.status(200).json(user);
    }catch(err){
        res.status(500).json(err);
    } 
}
async function createUser(req, res) {
    let body = req.body;
    try{
        let email = await User.countDocuments({"email": body.email});
        if(email !== 0){
            res.json({emailErr: "Email Already exist"});
            return;
        }
        let phone = await User.countDocuments({"phone_no": body.phone_no});
        if(phone !== 0){
            res.json({phoneErr: "Phone Number Already exist"});
            return;
        }
        let userObj = new User(body);
        
        if(body.password.length < 8){
            res.json({passErr: "Password must be greater or equal to 8 characters"});
            return;
        }
        userObj.password = bcrypt.hashSync(body.password, 10);
        await User.create(userObj).then(()=> {
            res.status(200).json({message: "User Created!"});   
        });
    }catch(err){
        res.status(500).json(err);
    }
}
//! Update all info insted Password here...
async function updateUser(req, res) {
    let body = req.body;
    try{
        //? All users expet this to check email emails and pass
        let users = await User.find({_id: {$ne: req.params.id}});
        
        //? Current user
        //! let currentUser = await User.findById(req.params.id);

        users.forEach((singleUser) => {
            if(singleUser.phone_no === body.phone_no){
                res.json({phoneErr: "Phone Number Already exist"});
                return;
            }
        });
        //! if phone number did't exist...
        await User.findByIdAndUpdate(req.params.id, body).then(() => {
            res.status(200).json({message: "User updated Sucessfully!"});
        });       
    }catch(err){
        res.status(500).json(err);
    }
}
async function updatePassword(req, res) {
    let body = req.body;
    try{
        let thisUser = await User.findById(req.params.id);

        bcrypt.compare(body.oldPass, thisUser.password, function(err, result) {
            if(result){
                if(body.newPass === body.newPassConfirm){
                    bcrypt.compare(body.newPass, thisUser.password, function(err, result) {
                        if(result){
                            res.json({passErr: "New password cannot be same as Old Password!"});
                            return;
                        }else{
                            // TODO: Change Password here...
                            thisUser.password = bcrypt.hashSync(body.newPass, 10);
                            User.findByIdAndUpdate(req.params.id, thisUser).then(() => {
                                res.status(200).json({message: "Password updated Sucessfully!"});
                            });
                        }
                    });
                }
                else{
                    res.json({passErr: "Please Confirm your Password!"});
                    return;
                }
            }else{
                res.json({passErr: "Password didn't match!"});
                    return;
            }
        });
    }catch(err){
        res.status(500).json(err);
    }
}

async function login(req, res, next) {
    try {
        console.log("login")
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
      console.log("auth")
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.json({ error: "Authenctication Failed" });
    }
  }

  async function loggedIn(req, res) {
      console.log("logged in")
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
    logout
}