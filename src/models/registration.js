const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true
    },
    mobile: {
        type: String,
        required:true,
        unique:true
    },
    password: {
        type: String,
        required:true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    tokens:[{
        token:{
            type: String,
            required:true
        }
    }]

}, {timestamps: true});

// Generating Token

userSchema.methods.generateAuthToken = async function(){
    try{
        const token = jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token}); 
        await this.save();
        return token;
    }catch(error){
        res.send("the error is"+error);
        console.log(error);
    }
}

// Hashing Function 

userSchema.pre("save" , async function(next) {

    if (this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
})

// Creating Collection

const Register = new mongoose.model("Users", userSchema);

module.exports = Register;