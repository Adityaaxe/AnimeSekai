const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://adityaadikhit:AHkk6WwHHCJKydmu@cluster0.4pzvytp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/test", {
    useUnifiedTopology: true,
}).then(() => {
    console.log(`Connection Successful`);
}).catch((e) => {
    console.log(`No Connection ${e}`);
})
