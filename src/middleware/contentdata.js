const UploadContent = require("../models/content");

const carousel = async (req, res, next) =>{
    try{

        const Carousel = await UploadContent.find();
        req.carousel = Carousel;

        next();

    }catch(error){
        res.status(401).send("not able to fetch")
    }
}

module.exports = carousel;