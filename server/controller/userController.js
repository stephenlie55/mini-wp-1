const user = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

class UserController{
    static register(req,res){
        console.log(req.body)
        let inputObj = {
            name : req.body.name,
            email : req.body.email,
            password :req.body.password
        }
        user.create(inputObj)
            .then((newUser)=>{
                res.status(201).json(newUser)
            })
            .catch((err)=>{
                console.log(err)
                res.status(500).json(err)
            })
    }

    static login(req,res){
        let password = req.body.password
        user
        .findOne({email: req.body.email})
        .then(user=>{
            if(user){
                if(bcrypt.compareSync(password, user.password)){
                    let payload = user
                    var token = jwt.sign({payload}, process.env.SECRET);
                    console.log(token)
                    res.status(201).json({data:user,token:token})
                }else{
                    console.log('sini')
                     res.status(400).send({message:'email or password is wrong'})
                 }
            }else{
                res.status(400).send({message:'email or password is wrong'})
            }
        })
        .catch(err=>{
            console.log(err)
            res.status(500).send(err)
        })
    }
}
module.exports= UserController 