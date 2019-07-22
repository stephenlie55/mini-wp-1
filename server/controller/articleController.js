const article = require('../models/article')

class articleController{
    static find(req,res){
        article
            .find()
            .populate('author')
            .then((data)=>{
                console.log("get articles")
                res.status(200).json(data)
            })
            .catch((err)=>{
                res.status(400).json(err)
            })
    }
    static findAll(req,res){
        article
            .find({author: req.decoded._id})
            .populate('author')
            .then((data)=>{
                console.log("get articles")
                res.status(200).json(data)
            })
            .catch((err)=>{
                res.status(400).json(err)
            })
    }
    static findOne(req,res){
        let id = req.params.id
        article
            .findById(id)
            .then((data)=>{
                res.status(200).json(data)
            })
            .catch( err => {
                res.status(500).json({error: err})
            })
            
    }
    static create(req,res){
        console.log('create article controller')
        console.log(req)
        let image = null
        if(req.file){
            image = req.file.cloudStoragePublicUrl
        }
        let objInput = {
            title: req.body.title,
            content: req.body.content,
            created_at: new Date(),
            image: image,
            author: req.decoded._id,
            tags: req.body.tags
        }
        article
            .create(objInput)
            .then((data)=>{
                res.status(200).json(data)
            })
            .catch((err)=>{
                console.log(err)
                res.status(400).json(err)
            })
    }
    static update(req,res){
        let id = req.params.id
        console.log(req.body)
        article
            .findById(id)
            .then(user =>{
                const update =req.body
                update.created_at = new Date()
                if(req.file){
                    update.image=req.file.cloudStoragePublicUrl
                }
                user.set(update)
                return user.save()
            })
            .then(updated =>{
                res.status(200).json(updated)
            })
            .catch(err=>{
                console.log('error')
                console.log(err)
                res.status(500).json(err)
            })
    }
    static delete(req,res){
        let id = req.params.id
        article
            .findByIdAndRemove(id)
                .then( deleted => {
                    res.status(200).json(deleted)
                })
                .catch( err => {
                    res.status(404).json({error: err})
                })
    }
}
module.exports= articleController