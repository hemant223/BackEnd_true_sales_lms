var express = require("express");
var router = express.Router();
var pool = require("./pool");
var upload = require("./config/multer");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("company");
});

// router.post("/add", function (req, res, next) {
//   pool.query("insert into company set ?", req.body, function (error, result) {
//     if (error) {
//       res.status(500).json({ status: false, message: error.sqlMessage });
//     } else {
//       res.status(200).json({
//         status: true,
//         message: "Company added successfully",
//         data: req.body,
//       });
//     }
//   });
// });

router.post('/add_new_company_data', upload.single('companyPicture'), function (req, res, next) {
  console.log("BODY:", req.body)
  console.log("FILE:", req.file)
  var pic
  if(req.file==undefined){
    pic=''
  }else{
    pic=req.file.filename
  }
  pool.query("insert into company(name,address,licence,authorised_person_name,auth_emailid,created_at,company_phone,company_picture)values(?,?,?,?,?,?,?,?)", [req.body.name,req.body.address,req.body.licence,req.body.authorisedPersonName,req.body.authorEmail,req.body.createdAt,req.body.companyPhone,pic], function (error, result) {
      if (error) {
          console.log(error)
          return res.status(500).json({ result: false })
      }
      else {
          return res.status(200).json({ result: true })
      }

  })
});



router.post('/delete_all_all_company', function(req, res, next) {
  console.log("req body ",req.body.id)
  pool.query("delete from company where id in (?)",[req.body.id],function(error,result){

    if(error){
        console.log("in error")
        return res.status(500).json({status:false,error:error})
    }
    else{
      console.log("in success")

     return res.status(200).json({status:true})
    }
  })
});

router.get("/display/:id", function (req, res, next) {
  const qry = `select * from company where id="${req.params.id}";`;
  pool.query(qry, function (error, result) {
    if (error) {
      return res.status(400).json({ status: false, message: error.sqlMessage });
    } else {
      return res
        .status(200)
        .json({ status: true, message: "Record Found", result });
    }
  });
});

router.get("/display_all_company_data", function (req, res, next) {
  pool.query(
    "select * from company",
    function (error, result) {
      if (error) {
        console.log(error);
        return res.status(500).json({ data: [] });
      } else {
        return res.status(200).json({ data: result  });
      }
    }
  );
});




router.put("/update/:id", function (req, res, next) {
  pool.query("update company set ? where id=?",
    [req.body, req.params.id],
    function (error, result) {
      if (error) {
        res.status(500).json({ status: false, message: error.sqlMessage });
      } else {
        res.status(200).json({
          status: true,
          message: "Company updated successfully",
          data: req.body,
        });
      }
    }
  );
});

router.delete("/delete/:id", function (req, res, next) {
  pool.query(
    "delete from company where id=?",
    [req.params.id],
    function (error, result) {
      if (error) {
        res.status(500).json({ status: false, message: error.sqlMessage });
      } else {
        res
          .status(200)
          .json({ status: true, message: "Company deleted successfully" });
      }
    }
  );
});

router.post(
  "/add_new_company_data",
  upload.single("companyPicture"),
  function (req, res, next) {
    //console.log("BODY:", req.body);
    //console.log("FILE:", req.file);
    pool.query(
      "insert into company(name,address,licence,authorised_person_name,auth_emailid,created_at,updated_at,company_phone,company_picture)values(?,?,?,?,?,?,?,?,?)",
      [
        req.body.name,
        req.body.address,
        req.body.licence,
        req.body.authorisedPersonName,
        req.body.authorEmail,
        req.body.createdAt,
        req.body.updatedAt,
        req.body.companyPhone,
        req.file.filename,
      ],
      function (error, result) {
        if (error) {
          //console.log(error);
          return res.status(500).json({ result: false });
        } else {
          return res.status(200).json({ result: true });
        }
      }
    );
  }
);

router.get("/display_all_company", function (req, res, next) {
  pool.query("select * from company", function (error, result) {
    if (error) {
      //console.log(error);
      return res.status(500).json({ data: [] });
    } else {
      return res.status(200).json({ data: result });
    }
  });
});

router.post("/edit_company_data", upload.single('companyPicture'), function (req, res, next) {
   var pic
  if(req.file==undefined){
    pic=''
  }else{
    pic=req.file.filename
  }
  pool.query(
    "update company set name=?,address=?,licence=?,authorised_person_name=?,auth_emailid=?,updated_at=?,company_phone=?, company_picture=? where id=?",
    [
      req.body.name,
      req.body.address,
      req.body.licence,
      req.body.authorisedPersonName,
      req.body.authorEmail,
      req.body.updatedat,
      req.body.companyPhone,
      pic,
      req.body.companyid,
    ],
    function (error, result) {
      if (error) {
        console.log('error',error);
        return res.status(500).json({ status: false });
      } else {
        return res.status(200).json({ status: true });
      }
    }
  );
});

router.post(
  "/update_picture",
  upload.single("companypicture"),
  function (req, res, next) {
    //console.log("FILE:", req.file);
    pool.query(
      "update company set company_picture=? where id=?",
      [req.file.filename, req.body.companyid],
      function (error, result) {
        if (error) {
          //console.log(error);
          return res.status(500).json({ result: false });
        } else {
          return res.status(200).json({ result: true });
        }
      }
    );
  }
);

router.post("/delete_company", function (req, res, next) {
  pool.query(
    "delete from company where id=?",
    [req.body.id],
    function (error, result) {
      if (error) {
        return res.status(500).json({ status: false, error: error });
      } else {
        return res.status(200).json({ status: true });
      }
    }
  );
});

router.post("/delete_all_company", function (req, res, next) {
  //console.log("req body ", req.body.id);
  pool.query(
    "delete from company where id in (?)",
    [req.body.id],
    function (error, result) {
      if (error) {
        //console.log("in error");
        return res.status(500).json({ status: false, error: error });
      } else {
        //console.log("in success");

        return res.status(200).json({ status: true });
      }
    }
  );
});

module.exports = router;
