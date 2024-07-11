require('dotenv').config();
const express = require("express");
const multer = require("multer");
const path = require("path");
const app = express();
require("./db/connection");
const Register = require("./models/registration");
const UploadContent = require("./models/content");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");
const contentdata = require("./middleware/contentdata");
const watchingdata = require("./middleware/watchingdata");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// Providing Environment for the Server

const port = process.env.PORT || 8000;



// Creating Static Path for Public dir

const static_path = path.join(__dirname, "../public");

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));

app.set('view engine', 'hbs');
app.use(express.static(static_path));

// Setting storage for the images

const storage = multer.diskStorage({
    destination : "public/images/",
    filename : (req, file, cb)=>{
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage : storage,
});


// Routing for users

app.get("", contentdata, async (req, res)=>{
    try{

        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        console.log(verifyUser);

        const user = await Register.findOne({_id:verifyUser._id});
        console.log(user.name);
        res.redirect("/Home");

    }catch{
        var Carousel = req.carousel;
        res.status(201).render("index",{ Carousel });
    }
});

// User Registration

app.post("", async(req, res)=>{

    try {

        const password = req.body.pass;
        const cpassword = req.body.cpass;

        if (password === cpassword){
            const user = new Register({

                name : req.body.name,
                mobile : req.body.num,
                password : req.body.pass

            })

            const token = await user.generateAuthToken();

            // Creating Cookies of the user

            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 15791616 * 1000),
                httpOnly: true
            });

            const usersaved = await user.save();
            res.status(201).redirect("/Home");
        }
        else{
            res.send("Password does not match");
        }

    } catch(error) {
        res.status(400).send("User Already exist!");
    }
    
});

// Login 

app.post("/Home", async(req, res)=>{

    try {

        console.log("hello");

        const mobile = req.body.num;
        const password = req.body.pass;

        const usermobile = await Register.findOne({mobile:mobile});

        const passmatch = await bcrypt.compare(password, usermobile.password);

        const token = await usermobile.generateAuthToken();
        console.log("token part" + token);

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 600000),
            httpOnly: true
        });

        if (passmatch){

            if(usermobile.isAdmin){
                res.status(201).redirect("/Admin");
            }
            else{
                res.status(201).redirect("/Home");
            }

        }else{
            res.send("Invalid Login Detailsqqqqq")
        }

    }catch(error) {
        res.status(400).send("Invalid Login Details");
    }
    
});

//Logout

app.get("/Logout", auth, async(req, res)=>{
    try{

        console.log(req.user.name);

        req.user.tokens = req.user.tokens.filter((currentToken) => {
            return currentToken.token != req.token
        })

        res.clearCookie("jwt");
        console.log("logout Successfully");

        await req.user.save();
        res.redirect("/");

    }catch(error){
        res.status(500).send("unable to logout");
    }
});

app.get("/Logoutall", auth, async(req, res)=>{
    try{

        console.log(req.user.mobile);

        req.user.tokens = [];

        res.clearCookie("jwt");
        console.log("logout Successfully");

        await req.user.save();
        res.redirect("/");

    }catch(error){
        res.status(500).send("unable to logoutall");
    }
});


// Routing

app.get("/Watching/:_id", watchingdata, (req, res)=>{

    var Watchdetails = req.watchdetails;
    console.log(Watchdetails.episodes);
    episode = Watchdetails.episodes;
    episodeno = Watchdetails.episodes[0];
    res.render("Watching",{ Watchdetails, episode, episodeno});

});

app.get("/Genres", (req, res)=>{
    res.render("Genres");
});

app.get("/Home", auth , contentdata, (req, res)=>{
    var Carousel = req.carousel;
    res.render("Home",{
        Username: req.user.name,
        Carousel 
    });
});

app.get("/Watchlist", auth , (req, res)=>{
    res.render("Watchlist");
});

app.get("/History", auth , (req, res)=>{
    res.render("History");
});

app.get("/Account", auth , (req, res)=>{
    res.render("Account",{
        Username: req.user.name,
    });
});

app.get("/Search", (req, res)=>{
    res.render("Search");
});

// Routing for users Ends here 

// Routing for Admin

app.get("/Admin", contentdata, async(req, res)=>{

    try{

        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);

        const user = await Register.findOne({_id:verifyUser._id});
        console.log(user.name);

        if(user.isAdmin){

            var Carousel = req.carousel;
            res.render("Admin",{ Carousel });

        }
        else{

            res.redirect("/Home");

        }

    }catch(err){
        res.redirect("/");
    }
    
});

app.post("/upload", upload.fields([{ name: 'episodes', maxCount:3}, { name: 'poster', maxCount:1}, { name: 'vcard', maxCount:1}, { name: 'hcard', maxCount:1}]), async(req, res)=>{
    try {

        const Content = new UploadContent({

            title : req.body.title,
            description : req.body.desc,
            sub : req.body.sub,
            dub : req.body.dub,
            duration : req.body.duration,
            genres : req.body.genres,
            iscarousel : req.body.iscarousel,
            episodes : req.files['episodes'][2].filename,
            poster : req.files['poster'][0].filename,
            vcard : req.files['vcard'][0].filename,
            hcard : req.files['hcard'][0].filename

        })

        const contentsaved = await Content.save();
        res.status(201).redirect("/Admin");

    } catch(error) {
        res.status(400).send(error);
    }
    
});

app.post("/update", upload.array('episode', 3), async(req, res)=>{
    try {

        const title = req.body.title;
        const episodes = req.files.map(file => file.originalname);
        const genres = req.body.genres;
        
        if(genres){

            const result = await UploadContent.updateOne({title},{
                $push : {
                    episodes : episodes,
                    genres : genres
                }
            });

            console.log(result);

            res.status(201).redirect("/Admin");

        }else{

            const result = await UploadContent.updateOne({title},{
                $push : {
                    episodes : episodes,
                }
            });

            console.log(result);

            res.status(201).redirect("/Admin");

        }

    } catch(error) {
        res.status(400).send(error);
    }
    
});

// Routing for Admin ends here 

// If invalid url entered

app.get("*", (req, res)=>{
    res.send("Error");
})

// Checking wheather the server is running or not

app.listen(port, () =>{
    console.log(`Server running on port ${port}`);
})