var mongoose = require("mongoose");

var User= require('../data/users.model')
var cartDatabase= require('../data/addtocarts.model')
var jwt = require("jsonwebtoken");

const { default: async } = require("async");
require("dotenv").config();
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 60 * 60 });
var common =require('../common')

function uniqueId(length) {
  var result = "";
  var characters = "0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function refferID(length) {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}



module.exports.updateCustomers = async function (req,res){
let usersList = await User.find({},'_id')
let count = 999
for(let i of usersList){
  count ++
  await User.findByIdAndUpdate(i._id,{uniqueID:String(count)})
  console.log(i._id)

}
res.status(200).json({
  success:true
})
}
module.exports.deleteAccount = async (req,res)=>{
 let UserID =  req.decoded.ID
 await User.findByIdAndUpdate(UserID,{AccountDelete:true})
 res.status(200).json({
  message:"acconunt Deleted"
 })
}



module.exports.SignUp = async function (req, res) {
  var contactNumber = req.body.contactNumber;
  var email = req.body.email;
  var password = req.body.password;
  var name = req.body.name;


  if (!contactNumber) {
    common.formValidate("Phone is", res);
    return false;
  }
  if (!email) {
    common.formValidate("Email", res);
    return false;
  }
  if (!password) {
    common.formValidate("Password", res);
    return false;
  }
  if (!name) {
    common.formValidate("Name", res);
    return false;
  }

  let userData = await User.findOne({
    email: { $regex: new RegExp('^' + email + '$', 'i') }
    }).lean();
  if (userData) {
      return res.status(400).json({ message: "error", data: "Account Already Exists" });    
  } else {
    var cartId = await cartDatabase.create({})
    var cartID =new  mongoose.Types.ObjectId(cartId._id)

    let Userrr = await User.create({ contactNumber,email, password,cartID, name});
    await cartDatabase.findByIdAndUpdate(cartId._id,({user_id:Userrr._id}))


    let  token = jwt.sign({ ID: Userrr._id }, "hyhelrtmfhosidfyfohr", {
      expiresIn: 3600000 * 60,
    });
    

    return res.status(200).json({
      message: "ok",
      Userrr,
      token,
      code: 1,
    });  }
};
module.exports.Login = async function (req, res) {
  var email = req.body.email;
  var password = req.body.password;
  if (!email) {
    common.formValidate("Email", res);
    return false;
  }
  if (!password) {
    common.formValidate("Password", res);
    return false;
  }

  // let userData = await User.findOne({ email,password}).populate('cartID').lean();
  let userData = await User.findOne({
    email: { $regex: new RegExp('^' + email + '$', 'i') },
    password: password
  }).populate('cartID').lean();
  if (userData) {
    if(!userData.cartID){
      var cartId = await cartDatabase.create({user_id:userData._id})
      var cartID = new mongoose.Types.ObjectId(cartId._id)
  
      let Userrr = await User.findByIdAndUpdate({ _id:userData._id}, {$set:{cartID:cartID}},{new:true}).populate('cartID').lean();
      userData = Userrr;
    }
      let  token = jwt.sign({ ID: userData._id }, "hyhelrtmfhosidfyfohr", {
        expiresIn: 3600000 * 60,
      });
      return res.status(200).json({
        message: "ok",
        token,
        user:userData,
        cart:userData.cartID,
        code: 1,
      });    
  } else {
    return res.status(400).json({ message: "Invalid Credentials", code: 1 });
  }
};
module.exports.changePassword = async (req,res)=>{
  let UserID =  req.decoded.ID
  if(!req.body.currentPassword || !req.body.newPassword){
    return res.status(309).json({
      message:'It is mandatory to send both current and new passwords'
    })
  }
 let user=await User.findById(UserID);
 if(user.password!=req.body.currentPassword){
  return res.status(403).json({
    message:"The current password is incorrect"
  })
 }
else{
  await User.findByIdAndUpdate(UserID,{password:req.body.newPassword})
  // var params = {}
  // params.to = user.email // receiver
  // params.subject = 'Password Changed'
  // params.message = 'Your Flora India password has been changed'
  // common.sendDynamicEmail(params);
  var keys = {
    userName: common.toTitleCase(user.name) || '',
    // userMobile: mobile,
    type: "user",
    template_name: "password change mail to user",
    userEmail: user.email,

  };
  common.dynamicEmail(keys);
  return res.status(200).json({
    message:"Password has been updated"
  })
}
 }







module.exports.usersGetAll = async (req, res) => {
  try {
    const users = await User.find({}, 'name email contactNumber createdAt').sort({ createdAt: -1 }).lean(); // Get name, email, phone, created date

    return res.status(200).json({ message: 'Users fetched successfully', users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
