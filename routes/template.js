var express = require("express");
var router = express.Router();
var pool = require("./pool");
var moment = require("moment");

router.post("/add_new_template_data", function (req, res, next) {
  pool.query(
    "insert into template(template_name, company_id, template_description, created_at, updated_at)values(?,?,?,?,?)",
    [
      req.body.templatename,
      req.body.companyid,
      req.body.templatedescription,
      req.body.createdat,
      req.body.updatedat,
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
});

router.get("/display_all_template_data", function (req, res, next) {
  pool.query("select * from template", function (error, result) {
    if (error) {
      //console.log(error);
      return res.status(500).json({ data: [] });
    } else {
      return res.status(200).json({ data: result });
    }
  });
});

router.post("/edit_template_data", function (req, res, next) {
  pool.query(
    "update template set template_name=?, company_id=?, template_description=?, created_at=?, updated_at=? where template_id=?",
    [
      req.body.templatename,
      req.body.companyid,
      req.body.templatedescription,
      req.body.createdat,
      req.body.updatedat,
      req.body.id,
    ],
    function (error, result) {
      if (error) {
        //console.log(error);
        return res.status(500).json({ status: false });
      } else {
        return res.status(200).json({ status: true });
      }
    }
  );
});

router.post("/delete_template", function (req, res, next) {
  pool.query(
    "delete from template where template_id=?",
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

router.post("/delete_all__template", function (req, res, next) {
  //console.log("req body ", req.body.id);
  pool.query(
    "delete from template where template_id in (?)",
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

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("template");
});

router.post("/add", function (req, res, next) {
  pool.query("insert into template set ?", req.body, function (error, result) {
    if (error) {
      res.status(500).json({ status: false, message: error.sqlMessage });
    } else {
      res.status(200).json({
        status: true,
        message: "Template added successfully",
        data: result,
      });
    }
  });
});

router.post("/displayTemplate", function (req, res, next) {
  pool.query("select T.*,(select C.name from company C where C.id=T.company_id) as cName from template T", function (error, result) {
     
 
      if (error) {
        res.status(500).json({ status: false, message: error.sqlMessage });
      } else {
        res.status(200).json({
          status: true,
          data: result,
          message: "template Data found!",
        });
      }
    }
  );
});

router.post("/insertTemplateData", function (req, res, next) {
  pool.query("insert into calls set ?", req.body, function (error, result) {
    if (error) {
      //console.log("error>>35", error);
      res.status(500).json({ status: false, message: error.sqlMessage });
    } else {
      res.status(200).json({
        status: true,
        message: "WhatsApp Data added successfully",
        data: req.body,
      });
    }
  });
});

router.post("/update", function (req, res, next) {
  console.log('fffff',req.body);
  pool.query(
    `update template set template_name="${req.body.template_name}", company_id="${req.body.company_id}", template_description="${req.body.template_description}", updated_at="${req.body.updated_at}" where template_id="${req.body.template_id}";`,
    function (error, result) {
      if (error) {
        res.status(400).json({ status: false, message: error.sqlMessage });
      } else {
        res.status(200).json({
          status: true,
          message: "Template update successfully",
          data: result,
        });
      }
    }
  );
});



router.post('/delete_all_all_template', function(req, res, next) {
  console.log("req body ",req.body.id)
  pool.query("delete from template where template_id in (?)",[req.body.id],function(error,result){

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


router.post('/delete_template', function(req, res, next) {
  console.log('boddyyy:',req.body.id);
  pool.query("delete from customerpriority where template_id=?",[req.body.id],function(error,result){
  if(error){
      console.log(error)
  return res.status(500).json({status:false})
  }
  else{
      return res.status(200).json({status:true})
  }
  
  })
  });
module.exports = router;
