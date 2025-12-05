
const mongoose = require("mongoose");
const schema = mongoose.Schema;

const passportLocalMongooe =require("passport-local-mongoose");
//passportLocalMongooe.  it automatically generates user and password.and hashing salting.

const userSchema = new schema({
    email:{
        type: String,
        required:  true 
    }
});
userSchema.plugin(passportLocalMongooe);
module.exports = mongoose.model("User",userSchema);
