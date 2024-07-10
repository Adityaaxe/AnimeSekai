const UploadContent = require("../models/content");

const watchingdata = async (req, res, next) =>{
    try{

        const contentid = req.params;

        const Watchdetails = await UploadContent.findOne({ _id: contentid });

        req.watchdetails = Watchdetails;

        console.log(req.watchdetails.title);

        next();

    }catch(error){
        res.status(401).send("not able to fetch content");
    }
}

module.exports = watchingdata;