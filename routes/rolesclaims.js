var express = require("express");
var router = express.Router();
var pool = require("./pool");

// router.post("/add_new_rolesclaims_data", function (req, res, next) {
//   console.log("BODY:", req.body);

//   pool.query(
//     "insert into roleclaims(  role_id, claim_id, created_at, updated_at, company_id) values(?,?,?,?,?)",
//     [
//       req.body.roleId,
//       req.body.claimId,
//       req.body.createdAt,
//       req.body.updatedAt,
//       req.body.companyId,
//     ],
//     function (error, result) {
//       //console.log("BODY:", req.body);
//       if (error) {
//         console.log(error);
//         return res.status(500).json({ result: false });
//       } else {
//         return res.status(200).json({ result: true });
//       }
//     }
//   );
// });

router.post("/display_all_roles", function (req, res, next) {
  //console.log("BODY:", req.body);

  pool.query(
    "select * from roles where company_id=?",
    [req.body.comId],
    function (error, result) {
      console.log("BODY:", req.body);
      if (error) {
        //console.log(error);
        return res.status(500).json({ data: [] });
      } else {
        return res.status(200).json({ data: result });
      }
    }
  );
});
router.post('/delete_all_all_roleclaims', function(req, res, next) {
  console.log("req body ",req.body.id)
  pool.query("delete from roleclaims where id in (?)",[req.body.id],function(error,result){

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

// router.post("/display_all_claims", function (req, res, next) {
//   //console.log("BODY:", req.body);

//   pool.query(
//     "select * from claims where company_id=?",
//     [req.body.cid],
//     function (error, result) {
//       console.log("BODY:", req.body);
//       if (error) {
//         //console.log(error);
//         return res.status(500).json({ data: [] });
//       } else {
//         return res.status(200).json({ data: result });
//       }
//     }
//   );
// });


/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("rolesclaims");
});

router.post("/add", function (req, res, next) {
  //console.log("Req. body in Roles And Claims", req.body);
  pool.query(
    "insert into roleclaims (role_id, claim_id, created_at, updated_at, company_id) values(?,?,?,?,?)",
    [
      req.body.map((item) => [
        item.role_id,
        item.claim_id,
        item.created_at,
        item.updated_at,
        item.company_id,
      ]),
    ],
    function (error, result) {
      //console.log("Qry ===========>");
      if (error) {
        //console.log("Error in role claims", error);
        return res
        .status(400)
        .json({ status: false, message: error.sqlMessage });
      } else {
        return res.status(200).json({
          status: true,
          message: "Role claim added successfully",
          result,
        });
      }
    }
    );
  });

  router.post('/add_new_rolesclaims_data', function(req, res, next) {
    console.log("BODY:",req.body)
   
pool.query("insert into roleclaims(role_id, claim_id, created_at, company_id) values(?,?,?,?)",[req.body.roleId,req.body.claimId,req.body.createdAt,req.body.companyId
    ],function(error,result){
// console.log("BODY:",req.body)
if(error)
{console.log('errorrrr',error)
    return res.status(500).json({status:false})
}
else
{console.log('gggggg')
    return res.status(200).json({status:true})
}

})


}); 

  router.get("/display_all_rolesclaims", function (req, res, next) {
    //console.log("BODY:", req.body);
  
    pool.query("select RC.*,(select R.name from roles R where R.id=RC.role_id) as rName,(select C.name from claims C where C.id=RC.claim_id) as cName,(select Com.name from company Com where Com.id=RC.company_id) as ComName from roleclaims RC", function (error, result) {
      console.log("BODY:", req.body);
      if (error) {
        //console.log(error);
        return res.status(500).json({ data: [] });
      } else {
        return res.status(200).json({ data: result,status:true });
      }
    });
  });

  router.post('/display_all_claims',  function(req, res, next) {
    console.log("BODY:",req.body)

pool.query("select * from claims where company_id=?",[req.body.id],function(error,result){
console.log("BODY:",req.body)
if(error)
{console.log(error)
    return res.status(500).json({data:[]})
}
else
{
    return res.status(200).json({data:result})
}
})
});
  
  router.get("/display", function (req, res, next) {
    pool.query("select RC.*,(select R.name from roles R where R.id=RC.role_id) as rName,(select C.name from claims C where C.id=RC.role_id) as cName from roleclaims RC", function (error, result) {
    if (error) {
      res.status(500).json({ status: false, message: error.sqlMessage });
    } else {
      res.status(200).json({
        status: true,
        data: result,
        message: "RoleClaims data found!",
      });
    }
  });
});

// router.get("/display/:id", function (req, res, next) {
//   pool.query(
//     "select * from roleclaims where role_id=?",
//     [req.params.id],
//     function (error, result) {
//       if (error) {
//         res.status(500).json({ status: false, message: error.sqlMessage });
//       } else {
//         res.status(200).json({
//           status: true,
//           data: result,
//           message: "RoleClaims data found!",
//         });
//       }
//     }
//   );
// });

router.get("/display/:cid/:rid", function (req, res, next) {
  pool.query(
    "select claim_id from roleclaims where role_id=? and company_id=?",
    [req.params.rid, req.params.cid],
    function (error, result) {
      if (error) {
        res.status(500).json({ status: false, message: error.sqlMessage });
      } else {
        res.status(200).json({
          status: true,
          data: result,
          message: "RoleClaims data found!",
        });
      }
    }
  );
});

// router.post("/update/:id/:company_id", function (req, res, next) {
//   //console.log("Req. body in Roles And Claims", req.body);
//   var qry = "";
//   req.body.map((item, index) => {
//     if (index == 0) {
//       qry = `delete from roleclaims where role_id='${item.role_id}' and company_id='${item.company_id}';`;
//     }
//     qry += `insert into roleclaims set claim_id='${item.claim_id}', created_at='${item.updated_at}', role_id='${item.role_id}', company_id='${item.company_id}';`;
//   });
//   pool.query(qry, function (error, result) {
//     //console.log("Qry ===========>");
//     if (error) {
//       //console.log("Error in role claims", error);
//       return res.status(400).json({ status: false, message: error.sqlMessage });
//     } else {
//       return res.status(200).json({
//         status: true,
//         message: "Role claim added successfully",
//         result,
//       });
//     }
//   });
// });

router.delete("/delete/:id", function (req, res, next) {
  pool.query(
    "delete from roleclaims where role_id=?",
    [req.params.id],
    function (error, result) {
      if (error) {
        res.status(500).json({ status: false, message: error.sqlMessage });
      } else {
        res
          .status(200)
          .json({ status: true, message: "RoleClaims deleted successfully" });
      }
    }
  );
});

router.get("/newPenalForCompare/:role_id/:company_id",
  function (req, res, next) {
    //console.log("request params", req.params);
    pool.query(
      `select GROUP_CONCAT(RC.claim_id separator ', ') as ClaimsId, GROUP_CONCAT(C.slug separator ', ') as ClaimName from roleclaims RC right join claims C on C.id=RC.claim_id where RC.role_id="${req.params.role_id}" and RC.company_id="${req.params.company_id}";;`,
      function (error, result) {
        if (error) {
          return res
            .status(400)
            .json({ status: false, message: error.sqlMessage, error });
        } else {
          return res
            .status(200)
            .json({ status: true, message: "record found", result });
        }
      }
    );
  }
);

router.post('/edit_roles_data',  function(req, res, next) {
  console.log("BODY:",req.body.role_Id)

pool.query("update roleclaims set role_id=?,claim_id=?,updated_at=?,company_id=? where id =?",
[req.body.role_id,req.body.claim_id,req.body.updated_at,req.body.company_id,req.body.id],function(error,result){
console.log("BODY:",req.body)
if(error)
{console.log(error)
  return res.status(500).json({status:false})
}
else
{
  return res.status(200).json({status:true})
}

})


});
router.post('/delete_roleclaims', function(req, res, next) {
  console.log('boddyyy:',req.body.id);
  pool.query("delete from roleclaims where id=?",[req.body.id],function(error,result){
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
