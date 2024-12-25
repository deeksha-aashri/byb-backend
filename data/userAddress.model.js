var mongoose = require('mongoose');

var UserAddressSchema = new mongoose.Schema({
    user_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref:'Users',
        required : false,
        default:null
    },
    houseNo : {
        type:String,
        default:null
    },
    name : {
        type:String,
        default:null
    },
    telephone : {
        type:String,
        default:null
    },
    alternateMobile : {
        type:String,
        default:null
    },
    email : {
        type:String,
        default:null
    },
    street : {
        type:String,
        default:null
    },
    locality : {
        type:String,
        default:null
    },
    city : {
        type:String,
        default:null
    },
    pincode : {
        type :String,
        default : null
    },
    district : {
        type:String,
        default:null
    },
    state : {
        type:String,
        default:null
    },
    country : {
        type:String,
        default:null
    },
    locationTag: {
        type: String,
        default: null,
    },
    address_type : {
        type:String,
        default:null
      },
    type:{

        type : String,
        enum : ['billing', 'shipping'],
        default:"shipping"
    },
    latitude:{
        type : Number,
        default : null
    },
    longitude:{
        type : Number,
        default : null
    },
   
    created_at : {
        type : Date,
        required : false,
        "default" : Date.now,
    timezone: "Asia/Kolkata"
    }
});
module.exports =  mongoose.model('UserAddress', UserAddressSchema, "UserAddress");