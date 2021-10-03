const db = require("../utils/db");
const bcrypt = require("bcrypt");
const user = require("../models/user");
const User = db.User;

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
    let chk, chk2, chk3 = false;
    try{
        let email = await User.countDocuments({"email": body.email});
        if(email !== 0){
            chk = false;
            res.json({emailErr: "Email Already exist"});
        }else{
            chk = true;
        }
        let phone = await User.countDocuments({"phone_no": body.phone_no});
        if(phone !== 0){
            chk2 = false;
            res.json({phoneErr: "Phone Number Already exist"});
        }else{
            chk2 = true;
        }
        let userObj = new User(body);
        
        if(body.password.length < 8){
            chk3 = false;
            res.json({passErr: "Password must be greater or equal to 8 characters"});
        }else{
            chk3 = true;
            userObj.password = bcrypt.hashSync(body.password, 10);
        }
        if(chk && chk2 && chk3){
            await User.create(userObj).then(()=> {
                res.status(200).json({message: "User Created!"});   
            });
        }
    }catch(err){
        res.status(500).json(err);
    }
}

async function updateUser(req, res) {
    let body = req.body;
    try{
        //? All users expet this to check email emails and pass
        let users = await User.find({_id: {$ne: req.params.id}});
        
        let currentUser = await User.findById(req.params.id);

        users.forEach((singleUser) => {
            if(singleUser.phone_no === body.phone_no){
                res.json({phoneErr: "Phone Number Already exist"});
            }
        });
        res.json({Message: "Haalo"});

        // await User.findByIdAndUpdate(req.params.id, body).then(() => {
        //     res.status(200).json({message: "User updated Sucessfully!"});
        // });
    }catch(err){
        res.status(500).json(err);
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser
}