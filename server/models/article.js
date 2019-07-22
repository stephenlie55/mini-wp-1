const mongoose = require('mongoose')
//port = 27017
//dbName = mini-wp
// mongoose.connect(process.env.MONGODB_CONNECTION, {useNewUrlParser: true})

const {Schema} = mongoose
const articleSchema = new Schema({
    title:String,
    content:String,
    created_at:Date,
    image:String,
    tags:[],
    author:{ type: Schema.Types.ObjectId, ref: 'User'}
})

const Article = mongoose.model('Article', articleSchema)
module.exports = Article