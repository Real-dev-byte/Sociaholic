const express = require('express')
const app = express()
const mongoose = require('mongoose')
const {MONGOURI} = require('./config/key')
const PORT=5000 || process.env.PORT


mongoose.connect(MONGOURI,{
     useUnifiedTopology: true,
     useNewUrlParser: true
})
mongoose.connection.on('connected',()=>{
    console.log("Connected to mongo")
})
mongoose.connection.on('error',(error)=>{
    console.log("Error Connecting",error)
})
require('./models/user.js')
require('./models/post.js')

app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))
if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})