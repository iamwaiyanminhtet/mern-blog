import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username : {
        type : String,
        require : true 
    },
    email : {
        type : String,
        require  :true,
        unique : true
    },
    password : {
        type : String,
        require : true
    },
    pfp : {
        type : String
    },
    defaultPfp : {
        type : String,
        default : "https://firebasestorage.googleapis.com/v0/b/blog-mern-4aaf2.appspot.com/o/default-user-avatar.jpg?alt=media&token=a7398f73-a7a0-490a-a97d-3f9edf0e377a"
    },
    isAdmin : {
        type : Boolean,
        default : false
    }
}, {timestamps : true});

const User = mongoose.model('User', userSchema);
export default User;