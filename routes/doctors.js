var express = require("express");
var router  = express.Router();
var passport = require("passport");

//get date
var datetime = new Date();


var Request     = require("../models/requests");
var Doctor      = require("../models/doctor");
var multer      = require("multer");
var storage     = multer.diskStorage({
    destination : function (req, file, cb ) {
        cb(null, 'stylesheets/img');
    },
    filename : function (req, file, cb) {
        cb(null, new Date.toString() + file.filename);
    }
});

var fileFilter =(req, file, cb) => {
    //reject a file
    if (file.mimeType ===  'image/jpeg'  || file.mimeType ===  'image/png') {
        cb(null, true);
    }else {
        cb(null, false);
    }
};
var upload      = multer({
    // storage : storage,
    // limit : {
    //     fileSize: 1024 * 1024 * 5 // 5MB
    // },
    // fileFilter : fileFilter
    dest : 'public/stylesheets/img'
});

// send all the doctors
router.get("/doctors", function(req, res){
    // Get all doctors from DB
    Doctor.find({}, function(err, allDoctors){
        if(err){
            console.log(err);
        } else {
            //res.redirect('/main');
            res.render("doctors",{doctors:allDoctors});
        }
    });
});

// show all the doctors that match to the user's description
router.post("/doctors", function (req,res) {

    var availability = req.body.Availability;
    var user_specialty = req.body.Specialty;
    var user_price = req.body.Price;
    var user_range = req.body.Range;

    var date= req.body.future_date; // for future development

    console.log("availability "+availability);
    console.log("speciality "+user_specialty);
    console.log("price "+ user_price);
    console.log("range "+user_range);

    console.log("date "+date);

    Doctor.find({
         specialty : user_specialty, // NEED TO BE CHOSEN FROM SEVERAL OPTIONS
        // availability : availability,
         price : {$lt : user_price}, // NEED TO BE LESS THEN THE USER CHOICE

        // range : function(){
        //     get_Distance(location_lat, location_lng) < user_range
        // }

    }, function(err, allDoctors){
        if(err){
            console.log(err);
        } else {
            //res.redirect('/main');
            res.render("doctors",{doctors:allDoctors, user_range: user_range});
        }
    });

});


router.get("/newdoc", function(req, res){
    res.render("doctors/newdoctor");
});

//CREATE - add new doctor to DB
router.post("/doctors/create", upload.single('product_image'),  function(req, res){
    // get data from form and add to exercises array
    console.log(req.file);

    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;
    var phonenumber = req.body.phonenumber;
    var sex = req.body.sex;
    var specialty = req.body.specialty;
    var availability = req.body.availability;
    var address = req.body.address;
    var price = req.body.price;
    var location_lat = req.body.lat;
    var location_lng = req.body.lng;



    var newDoctor = {
        product_image: req.file.path,
        firstname: firstname,
        lastname: lastname,
        email:email,
        phonenumber:phonenumber,
        sex:sex,
        specialty:specialty,
        availability:availability,
        address:address,
        price:price,
        location_lat: location_lat,
        location_lng: location_lng
    };

    // res.send(req.files);

    //console.log(req.user);
    // contains the information about the user

    // Create a new exercise and save to DB
    Doctor.create(newDoctor, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to main page
            res.redirect("/main");
        }
    });
});

// CREATE A  NEW REQUEST FOR THE DOCTOR
router.post("/doctor/:id", function(req, res){
    var name = req.body.name;
    var phonenumber = req.body.phonenumber;
    var email = req.body.email;
    var doc_id = req.params.id;

    //NEW REQUEST OBJECT
    var newRequest = {
        status: true,
        taken : false,
        time : "00:00",
        username : name,
        date: datetime,
        phonenumber : phonenumber,
        email : email,
        doc_id : doc_id
    };

    Request.create(newRequest, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to exercises page
            console.log("Added a new Request");
            res.redirect('/main');
        }
    });

});

// SHOW - shows the doctor page and all the requests he has
router.get("/doctor/:id", function(req, res){
    //find the doctor with provided ID
    Doctor.findById(req.params.id).exec(function(err, foundDoctor){
        if(err){
            console.log("err 1");
        } else {
            // find all the requests that have the same DOCTOR ID
            Request.find({

                status: true,
                doc_id : req.params.id

            } , function (err, allRequests) {
                if(err){
                    console.log("err 2");
                } else {
                    //render show template with that doctor
                    res.render("doctors/show", {doctor: foundDoctor, request: allRequests});
                }
            });
        }
    });
});

// gets from the show.ejs page
// the id is the Request's id
// the goals is to get time from the user & doctor's id and change the taken & time propertiees
router.get("/requestcheck/:id", function(req, res){

    id=req.params.id;// Request Id

    time =req.query['clock'];

   // I STEAL NEED THE TIME

    Request.findById(id).exec(function(err, foundReq){

        if(foundReq.taken==true){
            console.log("Im sorry the oppointment taken");
            res.redirect("/doctor/"+ foundReq.doc_id);// redirect to the old page
        }
        else {
            console.log("taken value was false so now the doctor can take the appointment");

            Request.findByIdAndUpdate(id, {
                $set: {
                    taken: true,
                    time: time
                }
            },function (err) {
                if(err){console.log(err);}
                else {
                    //send email
                    var str = "שלום רב, פגישתך עם הרופא אושרה והיא בשעה "+ time + " בברכה והמשך יום נעים " ;
                    sendemail("WeRDoctors@gmail.com",foundReq.email,str);

                    console.log("sucess");
                }

            });

            res.redirect("/main");
        }
    });



});


router.get("/", function(req, res){
    res.render("landing");
});

router.get("/main", function(req, res){
    res.render("main");
});


//  ===========
// AUTH ROUTES
//  ===========

// show register form
router.get("/register", function(req, res){
    res.render("register");
});

//handle sign up logic
// router.post("/register", function(req, res){
//     var newUser = new User({username: req.body.username});
//     User.register(newUser, req.body.password, function(err, user){
//         if(err){
//             console.log(err);
//             return res.render("register");
//         }
//         passport.authenticate("local")(req, res, function(){
//             res.redirect("/exercises");
//         });
//     });
// });

// show login form
router.get("/login", function(req, res){
    res.render("login");
});


// handling login logic
// router.post("/login", passport.authenticate("local",
//     {
//         successRedirect: "/exercises",
//         failureRedirect: "/login"
//     }), function(req, res){
// });

// logic route
router.get("/logout", function(req, res){
    //req.logout();
    res.redirect("/exercises");
});


module.exports = router ;


// function get_Distance(lat, lng){
//     navigator.geolocation.getCurrentPosition(function (position) {
//         console.log(position);
//         var lat_loc= position.coords.latitude;
//         var lng_loc= position.coords.longitude;
//
//         //my location
//         var user_location = {lat: lat_loc, lng: lng_loc};
//         //doctor location
//         //taken from the user variables input
//         var  doctor_location = new google.maps.LatLng(lat, lng);
//         var service = new google.maps.DistanceMatrixService();
//         service.getDistanceMatrix(
//             {
//                 origins: [user_location],
//                 destinations: [doctor_location],
//                 travelMode: 'DRIVING',
//             }, callback);
//
//         function callback(response, status) {
//             if (status == 'OK') {
//                 console.log("in the callback")
//                 var origins = response.originAddresses;
//                 var destinations = response.destinationAddresses;
//
//                 for (var i = 0; i < origins.length; i++) {
//                     var results = response.rows[i].elements;
//                     for (var j = 0; j < results.length; j++) {
//                         var element = results[j];
//                         var distance = element.distance.text;
//                         var duration = element.duration.text;
//                         var from = origins[i];
//                         var to = destinations[j];
//                     }
//                 }
//             }
//         }
//
//     });
// }
