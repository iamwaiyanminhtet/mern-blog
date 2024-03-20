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