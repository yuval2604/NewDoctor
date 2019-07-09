var mongoose = require("mongoose");

var doctorSchema = mongoose.Schema({
    firstname: String,
    lastname:String,
    email:String,
    phonenumber:String,
    sex:String,
    specialty:String, //should choose from a list
    availability:String, // should choosen from schedule
    address :String,
    location_lat: Number,
    location_lng: Number,
    price: Number,
    product_image : {
        type: String
    }
    // ,
    // //FOR FUTURE DEVELOPMENT
    // // REPRESENT ALL THE REQUESTS THE DOCTOR HAVE
    // users_requests: {
    //     username: [String],
    //     phonenumber: [String],
    //     Email: [String]
    // }

});

module.exports = mongoose.model("Doctor", doctorSchema);