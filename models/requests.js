var mongoose = require("mongoose");

var requestSchema = new mongoose.Schema({
   status: Boolean, // TRUE : WE CAN STILL USE THIS FALSE : DELETE
   time : String,   // TIME OF THE MEETING
   taken : Boolean, // DOES A DOCTOR TOOK THE OFFER
   username: String,
    date : String, // CAN BE THE IMMIDIATE / FUTURE LATER
   phonenumber : String,
   email : String,
   doc_id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Doctor"
   },

});

module.exports = mongoose.model("Request", requestSchema);