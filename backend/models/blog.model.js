import mongoose, { Schema } from "mongoose";

const blogSchema = mongoose.Schema({
    title : {
        type : String,
        require : true 
    },
    content : {
        type : String,
        require : true 
    },
    image : {
        type : String,
    },
    defaultImage : {
        type : String,
        default : "https://firebasestorage.googleapis.com/v0/b/blog-mern-4aaf2.appspot.com/o/default-blog-image.png?alt=media&token=4d6430ee-e097-4ec2-b655-f4b692f74f24"
    },
    slug : {
        type : String,
        unique : true
    },
    userId : {
        type : Schema.Types.ObjectId,
        ref  : "User"
    },
    categoryId : {
        type : Schema.Types.ObjectId,
        ref : "Category"
    },
    viewCount : {
        type : Number,
        default : 0
    },
    reactionCount : {
        type : Number,
        default : 0
    },
    reactionCountArray : {
        type : Array,
        default : []
    }
}, {timestamps : true});

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;