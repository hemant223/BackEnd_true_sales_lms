path = require("path");
multer = require("multer");
const moment = require("moment");

var dateee = moment().format("YYYY-MM-DD HH:mm:ss");
var storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "public/images/");
  },
  filename: function (req, file, cb) {
    //console.log("File in Multer=====9", file);
    //console.log("Req body in Multer=====9", req.body);
    //console.log("File Name in Multer=====9", file.originalname);
    var finalName = dateee + file.originalname;
    //console.log("finalName in multer", finalName);
    var filename = finalName.replace(/[^a-z0-9]/gi, "-.").toLowerCase();
    //console.log("final_name= =====> 15", filename);
    // cb(null, file.originalname);
    cb(null, filename);
  },
});

var upload = multer({ storage: storage });
module.exports = upload;

// let dateee = new Date().valueOf();
//     let final_name = st_id + dateee + file.originalname;
//     var filename = final_name.replace(/[^a-z0-9]/gi, "_.").toLowerCase();
//     // //console.log("final_name========23232323232323", filename);
//     cb(null, filename);
