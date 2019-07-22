require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const baseRoute = require('./router/index')
const cors = require('cors')
const mongoose = require('mongoose')
const connection = process.env.MONGODB_CONNECTION ||'mongodb://localhost:27017/mini-wp'  

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use('/', baseRoute)

app.listen(port, ()=> {
   console.log('Running on port :3000') 
   mongoose.connect(connection, {useNewUrlParser: true})
   .then( () => {
       console.log(`DB Connected to: ${connection}`)
   })
})
