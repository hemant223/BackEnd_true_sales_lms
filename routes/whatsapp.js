var express = require("express");
var router = express.Router();
var pool = require("./pool");

router.post("/add_new_whatsapp_data", function (req, res, next) {
  pool.query(
    "insert into whatsapp(user_id, company_id, customer_id, mobile, date, template)values(?,?,?,?,?,?)",
    [
      req.body.userid,
      req.body.companyid,
      req.body.customerid,
      req.body.mobile,
      req.body.date,
      req.body.template,
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

router.post('/delete_all_all_whatsapp', function(req, res, next) {
  console.log("req body ",req.body.id)
  pool.query("delete from whatsapp where id in (?)",[req.body.id],function(error,result){

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

router.get("/display_all_whatsapp_data", function (req, res, next) {
  pool.query("select W.*,(select U.name from user U where U.id=W.id) as uName,(select Com.name from company Com where Com.id=W.company_id) as ComName,(select C.name from customers C where C.id=W.customer_id) as cName from whatsapp W", function (error, result) {
     
 
    if (error) {
      //console.log(error);
      return res.status(500).json({ data: [] });
    } else {
      return res.status(200).json({ data: result });
    }
  });
});
router.post("/display_all_user_data", function (req, res, next) {
  console.log('lll',req.body);
  pool.query("select * from user where company_id=?", [req.body.comId], function (error, result) {
    if (error) {
      console.log(error);
      return res.status(500).json({ data: [] });
    } else {
      return res.status(200).json({ data: result, status: true });
    }
  });
});

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

router.post("/display_all_customer", function (req, res, next) {
  console.log("BODY:", req.body);

  pool.query("select * from customers where company_id=?",[req.body.id], function (error, result) {
    //console.log("BODY:", req.body);
    if (error) {
      //console.log(error);
      return res.status(500).json({ data: [] });
    } else {
      return res.status(200).json({ data: result ,status: true});
    }
  });
});

router.post("/edit_whatsapp_data", function (req, res, next) {
  pool.query(
    "update whatsapp set user_id=?, company_id=?, customer_id=?, mobile=?, date=?, template=? where id=?",
    [
      req.body.userid,
      req.body.companyid,
      req.body.customerid,
      req.body.mobile,
      req.body.date,
      req.body.template,
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

router.post("/delete_whatsapp", function (req, res, next) {
  pool.query(
    "delete from whatsapp where id=?",
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

router.post("/display_all_Customer_data", function (req, res, next) {
  pool.query(
    "select * from customers where company_id=?",
    [req.body.id],
    function (error, result) {
      if (error) {
        //console.log(error);
        return res.status(500).json({ data: [] });
      } else {
        return res.status(200).json({ data: result });
      }
    }
  );
});

router.post("/display_all_user_data", function (req, res, next) {
  pool.query(
    "select * from user where company_id=?",
    [req.body.id],
    function (error, result) {
      if (error) {
        //console.log(error);
        return res.status(500).json({ data: [] });
      } else {
        return res.status(200).json({ data: result });
      }
    }
  );
});

router.post("/delete_all__whatsapp", function (req, res, next) {
  //console.log("req body ", req.body.id);
  pool.query(
    "delete from whatsapp where id in (?)",
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
