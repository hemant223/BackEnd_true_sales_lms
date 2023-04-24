var express = require("express");
const moment = require("moment");
var router = express.Router();
var pool = require("./pool");
var multer = require("./config/multer");
const readXlsxFile = require("read-excel-file/node");

router.post("/add_new_customers_data", function (req, res, next) {
  //console.log("BODY:", req.body);
  pool.query(
    "insert into customers(  name, email, mobile, phone, address, type, status, note, created_at, updated_at, company_id, team_id, user, firmname, firstname, lastname, priority, pincode, outcome, createdBy) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    [
      req.body.name,
      req.body.email,
      req.body.mobile,
      req.body.phone,
      req.body.address,
      req.body.type,
      req.body.status,
      req.body.note,
      req.body.createdat,
      req.body.updated,
      req.body.companyid,
      req.body.teamId,
      req.body.user,
      req.body.firmName,
      req.body.firstName,
      req.body.lastName,
      req.body.priority,
      req.body.pincode,
      req.body.outcome,
      req.body.createdBy,
    ],
    function (error, result) {
      //console.log("BODY:", req.body);
      if (error) {
        //console.log(error);
        return res.status(500).json({ result: false });
      } else {
        return res.status(200).json({ result: true });
      }
    }
  );
});

router.get("/display_all_team", function (req, res, next) {
  //console.log("BODY:", req.body);

  pool.query("select * from team", function (error, result) {
    //console.log("BODY:", req.body);
    if (error) {
      //console.log(error);
      return res.status(500).json({ data: [] });
    } else {
      return res.status(200).json({ data: result });
    }
  });
});

router.get("/display_all_company", function (req, res, next) {
  //console.log("BODY:", req.body);

  pool.query("select * from company", function (error, result) {
    //console.log("BODY:", req.body);
    if (error) {
      //console.log(error);
      return res.status(500).json({ data: [] });
    } else {
      return res.status(200).json({ data: result });
    }
  });
});

router.get("/display_all_customer", function (req, res, next) {
  console.log("BODY:", req.body);

  pool.query("select * from customers", function (error, result) {
    //console.log("BODY:", req.body);
    if (error) {
      //console.log(error);
      return res.status(500).json({ data: [] });
    } else {
      return res.status(200).json({ data: result ,status: true});
    }
  });
});
router.post('/delete_all_all_customer', function(req, res, next) {
  console.log("req body ",req.body.id)
  pool.query("delete from customers where id in (?)",[req.body.id],function(error,result){

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


router.post("/edit_customer_data", function (req, res, next) {
  //console.log("BODY:", req.body);

  pool.query(
    "update customers set  name=?, email=?, mobile=?, phone=?, address=?, type=?, status=?, note=?, created_at=?, updated_at=?, company_id=?, team_id=?, user=?, firmname=?, firstname=?, lastname=?, priority=?, pincode=?, outcome=?, createdBy=? where id=? ",
    [
      req.body.name,
      req.body.email,
      req.body.mobile,
      req.body.phone,
      req.body.address,
      req.body.type,
      req.body.status,
      req.body.note,
      req.body.createdat,
      req.body.updated,
      req.body.companyid,
      req.body.teamId,
      req.body.user,
      req.body.firmName,
      req.body.firstName,
      req.body.lastName,
      req.body.priority,
      req.body.pincode,
      req.body.outcome,
      req.body.createdBy,
      req.body.id,
    ],
    function (error, result) {
      //console.log("BODY:", req.body);
      if (error) {
        //console.log(error);
        return res.status(500).json({ status: false });
      } else {
        return res.status(200).json({ status: true });
      }
    }
  );
});

router.post("/delete_customer_data", function (req, res, next) {
  pool.query(
    "delete from customers where id=?",
    [req.body.id],
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

router.post("/delete_all_all_customer", function (req, res, next) {
  //console.log("req body ", req.body.id);
  pool.query(
    "delete from customers where id in (?)",
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
  res.render("customers");
});

router.post("/add", function (req, res, next) {
  // //console.log("Request body of customer Add", req.body);
  if (!req.body.mobile.startsWith("+91")) {
    var FinalMobile = "+91" + req.body.mobile;
  } else {
    var FinalMobile = req.body.mobile;
  }
  const qryy = `select * from customers where mobile=${FinalMobile};`;
  pool.query(qryy, function (err, reslt) {
    if (err) {
      //console.log("error in customer checking in add customer");
      return res
        .status(400)
        .json({ status: false, message: err.sqlMessage, err });
    } else {
      if (reslt.length != 0) {
        //console.log("in customer checking in add customer API initial if part");
        return res
          .status(200)
          .json({ status: false, message: "This number already register" });
      } else {
        const qry = `insert into customers set name="${req.body.name}", email="${req.body.email}", mobile="${FinalMobile}", phone="${req.body.phone}", address="${req.body.address}", type="${req.body.type}", status="${req.body.status}", note="${req.body.note}", created_at="${req.body.created_at}", company_id="${req.body.company_id}", team_id="${req.body.team_id}", user="${req.body.user}", firstname="${req.body.firstname}", lastname="${req.body.lastname}", priority="${req.body.priority}", pincode="${req.body.pincode}", createdBy="${req.body.createdBy}";`;
        pool.query(qry, function (error, result) {
          if (error) {
            //console.log("Error in Customer", error);
            return res
              .status(400)
              .json({ status: false, message: error.sqlMessage });
          } else {
            //console.log("Result in Customer", result);
            return res.status(200).json({
              status: true,
              message: "Customer added successfully",
              result,
            });
          }
        });
      }
    }
  });
});

router.get("/display", function (req, res, next) {
  pool.query(
    `select C.*, C.name as CustomerName, C.mobile as customer_mobile, (select U.name from user U where U.id=T.team_head) as ManagerName, (select U.name from user U where C.user=U.id) as UserName, (select U.name from user U where C.createdBy=U.id) as CreatedName from customers C join team T on C.team_id=T.id order by C.id desc;`,
    function (error, result) {
      if (error) {
        //console.log("Error in Customer ======= 24", error);
        return res
          .status(400)
          .json({ status: false, message: error.sqlMessage });
      } else {
        // //console.log("Result in Customer ============ 28", result);
        return res.status(200).json({
          status: true,
          data: result,
          message: "Customer Data found!",
        });
      }
    }
  );
});

router.post("/updateCPriority", function (req, res, next) {
  const qry = `update customers set priority='${req.body.priority}' where id='${req.body.id}'`;
  pool.query(qry, function (error, result) {
    if (error) {
      return res
        .status(400)
        .json({ status: false, message: "Something went wrong", error });
    } else {
      return res.status(200).json({
        status: true,
        message: "Task Priority Updated",
        result,
      });
    }
  });
});

router.post("/update/:id", function (req, res, next) {
  //console.log("Request Body in Update", req.body);
  if (!req.body.mobile.startsWith("+91")) {
    var FinalMobile = "+91" + req.body.mobile;
  } else {
    var FinalMobile = req.body.mobile;
  }
  const qry = `update customers set name="${req.body.name}", email="${req.body.email}", mobile="${FinalMobile}", phone="${req.body.phone}", address="${req.body.address}", status="${req.body.status}", note="${req.body.note}", created_at="${req.body.created_at}",updated_at="${req.body.updated_at}", company_id="${req.body.company_id}", team_id="${req.body.team_id}", user="${req.body.user}", firstname="${req.body.firstname}", lastname="${req.body.lastname}", priority="${req.body.priority}", pincode="${req.body.pincode}", createdBy="${req.body.createdBy}", type="", firmname="" where id='${req.params.id}';`;
  pool.query(qry, function (error, result) {
    if (error) {
      // //console.log("Result in Update Customer", error);
      return res.status(400).json({ status: false, message: error.sqlMessage });
    } else {
      // //console.log("Result in Update Customer", result);
      return res.status(200).json({
        status: true,
        result,
        message: "Customer Updated successfully",
      });
    }
  });
});

router.post("/displayfilter/:id/:company_id", function (req, res, next) {
  var temp = [];
  const qry = `select cl.id, cl.call_type,(select U.name from user U where cl.user=U.id) as UserName,cl.created_at as CallsDateTime, cl.duration, cl.user_note, cl.recording_url, cl.call_status, cl.disposition from customers C join calls cl on C.id=cl.customer where cl.customer="${req.params.id}" and cl.company_id="${req.params.company_id}" and date(cl.created_At) between "${req.body.startDate}" and "${req.body.endDate}" group by cl.id order by cl.id desc;`;
  pool.query(qry, function (error, result) {
    if (error) {
      return res.status(400).json({ status: false, message: error.sqlMessage });
    } else {
      // result.map((ram) => {
      //   temp = moment(ram.created_at).format("YYYY-MM-DD HH:mm:ss");
      // })
      return res
        .status(200)
        .json({ status: true, data: result, message: "Call Data found!" });
    }
  });
});

router.post("/customerDetail", function (req, res, next) {
  const qry = `select CL.*, CL.created_at as cr_date, (select U.name from user U where U.id=CUS.createdBy) as Customer_Creator, (select U.name from user U where CL.user=U.id) as ByCallName from calls as CL join customers as CUS on CL.customer=CUS.id where CUS.user='${req.body.user}' and CL.company_id='${req.body.company_id}' and CL.customer='${req.body.customer}' group by CL.id order by CL.created_at desc`;

  //console.log("customerDetail>>>>", qry);
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error in Customer Detail", error);
      return res
        .status(400)
        .json({ status: false, message: "Error Occurred", error });
    } else {
      // //console.log("Result in Customer Detail", result);
      return res
        .status(200)
        .json({ status: true, message: "Record Found", result });
    }
  });
});

router.post("/customerList", function (req, res, next) {
  var qry = `select C.*, C.name as CustomerName, C.mobile as customer_mobile, (select U.name from user U where U.id=C.createdBy) as Customer_Creator, (select U.name from user U where U.id=T.team_head) as ManagerName from customers as C join user as U on C.user=U.id join team as T on C.team_id=T.id where C.user='${req.body.user}' and C.company_id='${req.body.company_id}' order by C.created_at desc LIMIT ${req.body.limit} OFFSET ${req.body.offset};`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error in Customer List", error);
      return res
        .status(400)
        .json({ status: false, message: "Error Occurred", error });
    } else {
      //console.log("Result in Customer List", result);
      return res
        .status(200)
        .json({ status: true, message: "Record Found", result });
    }
  });
});

router.post("/customerListLength", function (req, res, next) {
  // //console.log("Request Body in Customer List", req.body);
  var qry = `select C.*, C.name as CustomerName, C.mobile as customer_mobile, (select U.name from user U where U.id=C.createdBy) as Customer_Creator, (select U.name from user U where U.id=T.team_head) as ManagerName from customers as C join user as U on C.user=U.id join team as T on C.team_id=T.id where C.user='${req.body.user}' and C.company_id='${req.body.company_id}' order by C.created_at desc;`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error in Customer List", error);
      return res
        .status(400)
        .json({ status: false, message: "Error Occurred", error });
    } else {
      //console.log("Result in Customer List", result);
      return res
        .status(200)
        .json({ status: true, message: "Record Found", result: result });
    }
  });
});

router.post("/CustomersFiltering", function (req, res, next) {
  //console.log(
  //   "Request body of disposition==CustomersFiltering=====137",
  //   req.body
  // );
  var startDateAhead = moment(req.body.startDate).format("YYYY-MM-DD");
  var EndDateAhead = moment(req.body.endDate).format("YYYY-MM-DD");
  if (
    req.body.disposition != "" &&
    req.body.startDate != "" &&
    req.body.endDate != "" &&
    req.body.order == ""
  ) {
    //console.log("In--->>>>364");
    {
      var qry = `select C.*, C.name as CustomerName, C.mobile as customer_mobile, (select U.name from user U where U.id=C.createdBy) as Customer_Creator, (select U.name from user U where U.id=T.team_head) as ManagerName from customers as C join user as U on C.user=U.id join team as T on C.team_id=T.id where C.user='${req.body.user}' and C.company_id='${req.body.company_id}' and C.priority='${req.body.disposition}' and date(C.created_at) between '${startDateAhead}' and '${EndDateAhead}' order by C.created_at asc`;
    }
  } else if (
    req.body.disposition != "" &&
    req.body.startDate != "" &&
    req.body.endDate != "" &&
    req.body.order != ""
  ) {
    //console.log("In--->>>>375");
    {
      var qry = `select C.*, C.name as CustomerName, C.mobile as customer_mobile, (select U.name from user U where U.id=C.createdBy) as Customer_Creator, (select U.name from user U where U.id=T.team_head) as ManagerName from customers as C join user as U on C.user=U.id join team as T on C.team_id=T.id where C.user='${req.body.user}' and C.company_id='${req.body.company_id}' and C.priority='${req.body.disposition}' and date(C.created_at) between '${startDateAhead}' and '${EndDateAhead}' order by C.name ${req.body.order}`;
    }
  } else if (
    req.body.disposition == "" &&
    req.body.startDate != "" &&
    req.body.endDate != "" &&
    req.body.order == ""
  ) {
    //console.log("In--->>>>385");
    var qry = `select C.*, C.name as CustomerName, C.mobile as customer_mobile, (select U.name from user U where U.id=C.createdBy) as Customer_Creator, (select U.name from user U where U.id=T.team_head) as ManagerName from customers as C join user as U on C.user=U.id join team as T on C.team_id=T.id where C.user='${req.body.user}' and C.company_id='${req.body.company_id}' and date(C.created_at) between '${startDateAhead}' and '${EndDateAhead}' order by C.created_at asc;`;
  } else if (
    req.body.disposition == "" &&
    req.body.startDate != "" &&
    req.body.endDate != "" &&
    req.body.order != ""
  ) {
    //console.log("In--->>>>426");
    var qry = `select C.*, C.name as CustomerName, C.mobile as customer_mobile, (select U.name from user U where U.id=C.createdBy) as Customer_Creator, (select U.name from user U where U.id=T.team_head) as ManagerName from customers as C join user as U on C.user=U.id join team as T on C.team_id=T.id where C.user='${req.body.user}' and C.company_id='${req.body.company_id}' and date(C.created_at) between '${startDateAhead}' and '${EndDateAhead}' order by C.name ${req.body.order};`;
  } else {
    //console.log("In Else Part--->>>>430");
    var qry = `select C.*, C.name as CustomerName, C.mobile as customer_mobile, (select U.name from user U where U.id=C.createdBy) as Customer_Creator, (select U.name from user U where U.id=T.team_head) as ManagerName from customers as C join user as U on C.user=U.id join team as T on C.team_id=T.id where C.user='${req.body.user}' and C.company_id='${req.body.company_id}' and date(C.created_at) between '${startDateAhead}' and '${EndDateAhead}' order by C.created_at asc `;
  }
  //console.log("conditionsssss");
  pool.query(qry, function (error, result) {
    //console.log("qry", qry);
    if (error) {
      //console.log("Error in Filter by A to Z", error);
      return res
        .status(400)
        .json({ status: false, message: "Error Occurred", error });
    } else {
      //console.log("Result in Filter by A to Z===164", result);
      return res
        .status(200)
        .json({ status: true, message: "Record Found", result });
    }
  });
});

router.post("/customerHistoryFiltering", function (req, res, next) {
  var startDateAhead = moment(req.body.startDate).format("YYYY-MM-DD");
  var EndDateAhead = moment(req.body.endDate).format("YYYY-MM-DD");
  if (
    req.body.startDate != "" &&
    req.body.endDate != "" &&
    req.body.disposition != "" &&
    req.body.order != ""
  ) {
    //console.log("in----------->>>503");
    var qry = `select CL.*, CL.created_at as cr_date,CUS.* from calls as CL join customers as CUS on CL.customer=CUS.id where date(CL.created_at) between '${startDateAhead}' and '${EndDateAhead}' and CL.user='${req.body.user}' and CL.company_id='${req.body.company_id}' and CL.customer='${req.body.customer}' and CL.call_type='${req.body.disposition}' order by CL.duration ${req.body.order};`;
  } else if (
    req.body.startDate != "" &&
    req.body.endDate != "" &&
    req.body.disposition == "" &&
    req.body.order != ""
  ) {
    //console.log("in----------->>>539");
    var qry = `select CL.*, CL.created_at as cr_date,CUS.* from calls as CL join customers as CUS on CL.customer=CUS.id where date(CL.created_at) between '${startDateAhead}' and '${EndDateAhead}' and CL.user='${req.body.user}' and CL.company_id='${req.body.company_id}' and CL.customer='${req.body.customer}'order by CL.duration ${req.body.order};`;
  } else if (
    req.body.startDate != "" &&
    req.body.endDate != "" &&
    req.body.disposition != "" &&
    req.body.order == ""
  ) {
    //console.log("in----------->>>547");
    var qry = `select CL.*, CL.created_at as cr_date,CUS.* from calls as CL join customers as CUS on CL.customer=CUS.id where date(CL.created_at) between '${startDateAhead}' and '${EndDateAhead}' and CL.user='${req.body.user}' and CL.company_id='${req.body.company_id}' and CL.call_type='${req.body.disposition}' and CL.customer='${req.body.customer}' order by CL.created_at asc`;
  } else {
    //console.log("in----------->>>550");
    var qry = `select CL.*, CL.created_at as cr_date,CUS.* from calls as CL join customers as CUS on CL.customer=CUS.id where date(CL.created_at) between '${startDateAhead}' and '${EndDateAhead}' and CL.user='${req.body.user}' and CL.company_id='${req.body.company_id}' and CL.customer='${req.body.customer}'order by CL.created_at asc;`;
  }
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error in Customer filter", error);
      return res
        .status(400)
        .json({ status: false, message: "Error Occurred", error });
    } else {
      //console.log("Result in Customer filter", result);
      return res
        .status(200)
        .json({ status: true, message: "Record Found", result });
    }
  });
});

router.get("/newPenalDisplay/:user_id/:company_id", function (req, res, next) {
  pool.query(
    `select C.*, T.refrence_from as Refrence from customers C left join task T on T.customer=C.id where C.user="${req.params.user_id}" and C.company_id="${req.params.company_id}" group by C.id order by C.id desc;   select C.id as ID, C.firstname as FirstName, C.lastname as LastName, C.mobile as MobileNumber, C.email as Email, T.refrence_from as Refrence, C.created_at as AddedOn from customers C left join task T on T.customer=C.id where C.user="${req.params.user_id}" and C.company_id="${req.params.company_id}" group by C.id order by C.id desc;`,
    function (error, result) {
      if (error) {
        //console.log("error in customer display", error);
        return res
          .status(400)
          .json({ status: false, message: error.sqlMessage });
      } else {
        let tempData = result[0];
        let tempExcel = result[1];
        let Data = [tempData];
        let Excel = [tempExcel];
        return res.status(200).json({
          status: true,
          Data,
          Excel,
          message: "Customer Data found!",
        });
      }
    }
  );
});

router.post("/FilterDisplay/:user_id/:company_id", function (req, res, next) {
  //console.log("req in filter customer", req.params);
  const qry = `select * from customers where user="${req.params.user_id}" and company_id="${req.params.company_id}" and date(created_at) between "${req.body.startDate}" and "${req.body.endDate}" group by id order by id desc;  select C.id as ID, C.firstname as FirstName, C.lastname as LastName, C.mobile as MobileNumber, C.email as Email, T.refrence_from as Refrence, C.created_at as AddedOn from customers C left join task T on T.customer=C.id where C.user="${req.params.user_id}" and C.company_id="${req.params.company_id}" and date(C.created_at) between "${req.body.startDate}" and "${req.body.endDate}" group by C.id order by C.id desc;`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("error in customer FilterDisplay", error);
      return res.status(400).json({ status: false, message: error.sqlMessage });
    } else {
      // //console.log("result in customer filter", result);
      var tempData = result[0];
      var tempExcel = result[1];
      var resultData = [tempData];
      var excelData = [tempExcel];
      return res.status(200).json({
        status: true,
        message: "Call Data found!",
        resultData,
        excelData,
      });
    }
  });
});

router.get(
  "/customerDetail/:CustomerId/:company_id",
  function (req, res, next) {
    //console.log("request params in customer display for new penal", req.params);
    //console.log("innnn");
    const qry = `select C.*, (select U.name from user U where U.id=C.user) as UserName from customers C where C.id="${req.params.CustomerId}" and C.company_id="${req.params.company_id}" order by C.id desc;`;
    pool.query(qry, function (error, result) {
      if (error) {
        return res
          .status(400)
          .json({ status: false, message: error.sqlMessage });
      } else {
        return res
          .status(200)
          .json({ status: true, data: result, message: "Call Data found!" });
      }
    });
  }
);

///////////////////////////// CUSTOMER SEARCHING IN MANAGER CREATE TASK //////////////////////////////

router.post("/CustomerSearching", function (req, res, next) {
  pool.query(
    `select * from customers where company_id='${req.body.company_id}' and (user='${req.body.user}' or team_id in (Select id from team where team_head='${req.body.user}'))`,
    function (error, result) {
      if (error) {
        //console.log("error in customersearching", error);
        res.status(400).json({ status: false, message: error.sqlMessage });
      } else {
        res.status(200).json({
          status: true,
          message: "Customer search successfully",
          result,
        });
      }
    }
  );
});

router.get("/displayAll/:companyId", function (req, res, next) {
  pool.query(
    `select C.*, C.name as CustomerName, C.mobile as customer_mobile, T.team_name as TeamName, TS.refrence_from, (select U.name from user U where U.id=T.team_head) as ManagerName, (select U.name from user U where C.user=U.id) as UserName, (select U.name from user U where C.createdBy=U.id) as CreatedName from customers C join team T on C.team_id=T.id or C.team_id=0 left join task TS on C.id=TS.customer where C.company_id="${req.params.companyId}" group by C.id order by C.id desc;   select C.firstname, C.lastname, C.mobile, C.email, TS.refrence_from as Reference, C.created_at, C.created_at as LastActivity, (select U.name from user U where C.user=U.id) as AssignedExecutive, T.team_name as TeamName from customers C join team T on C.team_id=T.id or C.team_id=0 left join task TS on C.id=TS.customer where C.company_id="${req.params.companyId}" group by C.id order by C.id desc;`,
    function (error, result) {
      if (error) {
        //console.log("Error in Customer ======= 24", error);
        return res
          .status(400)
          .json({ status: false, message: error.sqlMessage });
      } else {
        // //console.log("Result in Customer ============ 28", result);
        let tempData = result[0];
        let tempExcel = result[1];
        let Data = [tempData];
        let Excel = [tempExcel];
        return res.status(200).json({
          status: true,
          message: "Customer Data found!",
          Data,
          Excel,
        });
      }
    }
  );
});

router.post("/ContactDisplayAll", function (req, res, next) {
  pool.query(
    `select C.*, C.name as CustomerName, C.mobile as customer_mobile, T.team_name as TeamName, TS.refrence_from, (select U.name from user U where U.id=T.team_head) as ManagerName, (select U.name from user U where C.user=U.id) as UserName, (select U.name from user U where C.createdBy=U.id) as CreatedName from customers C join team T on C.team_id=T.id or C.team_id=0 left join task TS on C.id=TS.customer where C.company_id="${req.body.companyId}" group by C.id order by C.id desc LIMIT ${req.body.limit} OFFSET ${req.body.offset};`,
    function (error, result) {
      if (error) {
        //console.log("Error in Customer ======= 24", error);
        return res
          .status(400)
          .json({ status: false, message: error.sqlMessage });
      } else {
        // //console.log("Result in Customer ============ 28", result);
        return res.status(200).json({
          status: true,
          data: result,
          message: "Customer Data found!",
        });
      }
    }
  );
});

router.post("/Customer", function (req, res, next) {
  //console.log("req body in customer>>>>>>>>>>>", req.body);
  const qry = `select C.*, (select U.name from user as U where U.id=C.user)as ManagerName,(select U.mobile from   user as U where U.id=C.user)as ManagerMobile from customers as C where (C.user='${req.body.user}' or C.team_id in (Select id from team where team_head='${req.body.user}'))`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error in Customer", error);
      return res
        .status(400)
        .json({ status: false, message: "Error Occurred", error });
    } else {
      // //console.log("Result in Customer", result);
      return res
        .status(200)
        .json({ status: true, message: "Record Found", result });
    }
  });
});

router.post("/CustomerByTeam", function (req, res, next) {
  const qry = `select C.*, (select U.name from   user as U where U.id=C.user)as ManagerName, (select U.mobile from   user as U where U.id=C.user)as ManagerMobile from customers as C where C.company_id='${req.body.company_id}' and C.team_id in (${req.body.team_id});`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error in Customer", error);
      return res
        .status(400)
        .json({ status: false, message: "Error Occurred", error });
    } else {
      // //console.log("Result in Customer", result);
      return res
        .status(200)
        .json({ status: true, message: "Record Found", result });
    }
  });
});

router.post("/CustomerById", function (req, res, next) {
  const qry = `select C.*, (select U.name from   user as U where U.id=C.user)as ManagerName, (select U.mobile from   user as U where U.id=C.user)as ManagerMobile from customers as C where C.user in (${req.body.user})`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error in Customer", error);
      return res
        .status(400)
        .json({ status: false, message: "Error Occurred", error });
    } else {
      // //console.log("Result in Customer", result);
      return res
        .status(200)
        .json({ status: true, message: "Record Found", result });
    }
  });
});

router.post("/CustomerByDate", function (req, res, next) {
  //console.log("req body in customer>>>>>>>>>>>", req.body);
  const qry = `select C.*, (select U.name from   user as U where U.id=C.user)as ManagerName,(select U.mobile from   user as U where U.id=C.user)as ManagerMobile from customers as C where (C.user='${req.body.user}' or C.team_id in (Select id from team where team_head='${req.body.user}')) order by created_at`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error in Customer", error);
      return res
        .status(400)
        .json({ status: false, message: "Error Occurred", error });
    } else {
      // //console.log("Result in Customer", result);
      return res
        .status(200)
        .json({ status: true, message: "Record Found", result });
    }
  });
});

router.post("/CustomerByIdAndDate", function (req, res, next) {
  //console.log("req body in customer by id>>>>>>>>>>>", req.body);
  const qry = `select C.*, (select U.name from   user as U where U.id=C.user)as ManagerName, (select U.mobile from   user as U where U.id=C.user)as ManagerMobile from customers as C where C.user in (${req.body.user}) order by created_at`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error in Customer", error);
      return res
        .status(400)
        .json({ status: false, message: "Error Occurred", error });
    } else {
      // //console.log("Result in Customer", result);
      return res
        .status(200)
        .json({ status: true, message: "Record Found", result });
    }
  });
});

router.post("/customerPopSearch", function (req, res, next) {
  //console.log("Request body in customerPopSearch==194", req.body);
  if (!req.body.mobile.startsWith("+91")) {
    var mobileWithC_Code = "+91" + req.body.mobile;
  } else {
    var mobileWithC_Code = req.body.mobile;
  }
  pool.query(
    `select * from abandoned where abandoned_mobile="${mobileWithC_Code}" and abandoned_status="Block";`,
    function (errr, reslt) {
      if (errr) {
        //console.log("error in customerpopup search", errr);
        return res
          .status(400)
          .json({ status: false, message: errr.sqlMessage, errr });
      } else {
        if (reslt.length != 0) {
          //console.log("in else's if part of customer popup search");
          return res.status(200).json({
            status: true,
            message: "Pop up can not open, This number is blocked",
          });
        } else {
          pool.query(
            `select * from customers where mobile ='${mobileWithC_Code}';`,
            function (error, result) {
              if (error) {
                // //console.log("Error in customerPopSearch line no.201===>>", error);
                return res
                  .status(400)
                  .json({ status: false, message: "Error Occurred", error });
              } else {
                if (result.length > 0) {
                  //console.log("in line 217 & result", result);

                  const qrY2 = `select * from calls where company_id='${result[0].company_id}' and customer='${result[0].id}' and id in (select max(id) from calls where company_id='${result[0].company_id}' and customer='${result[0].id}');
              `;
                  pool.query(qrY2, function (err, resultt) {
                    if (error) {
                      // //console.log("Error in customerPopSearch line no.201===>>", error);
                      return res.status(400).json({
                        status: false,
                        message: "Error Occurred",
                        error,
                      });
                    } else {
                      //console.log("at line no.230===>>");

                      return res.status(200).json({
                        status: true,
                        message: "Record Found",
                        CustomerResult: result[0],
                        callResult: resultt.length > 0 ? resultt[0] : "",
                      });
                    }
                  });
                } else {
                  return res.status(200).json({
                    status: false,
                    message: "Record not Found",
                    result,
                  });
                }
              }
            }
          );
        }
      }
    }
  );
});

/// 29 May

router.post("/AddCustomerByPopUp", multer.any(), function (req, res, next) {
  //console.log("Request body in AddCustomerByPopUp==341", req.body);
  //console.log("Request filess in AddCustomerByPopUp==341", req.files);
  // //console.log(
  //   "Request body in AddCustomerByPopUp==342",
  //   req.files[0].originalname
  // );
  // //console.log(
  //   "Request body in check files new",
  //   req.files[0]
  // );
  //console.log("req.body.cus_createdDate", req.body.cus_createdDate);

  var TaskCreatedAt = JSON.parse(req.body.created_at);
  let FinalTaskCreatedAt = moment(TaskCreatedAt).format("YYYY-MM-DD HH:mm:ss");
  // var finalD = JSON.parse(req.body.duration)
  var TaskDateParse = req.body.task_added_date;
  var TaskDate = moment(TaskDateParse).format("YYYY-MM-DD HH:mm:ss");
  //console.log("TaskDate====>", TaskDate);
  var CustomerCreatedAt = JSON.parse(req.body.cus_createdDate);
  let FinalCustomerCreatedAt = moment(CustomerCreatedAt).format(
    "YYYY-MM-DD HH:mm:ss"
  );
  //console.log("FinalCustomerCreatedAt ===== 361", FinalCustomerCreatedAt);
  if (!req.body.mobile.startsWith("+91")) {
    var mobileWithC_Code = "+91" + req.body.mobile;
  } else {
    var mobileWithC_Code = req.body.mobile;
  }
  var finalName = req.body.firstName + " " + req.body.lastName;
  //console.log("above iffffffffff");
  if (req.body.checkk === "true") {
    //console.log("in if 269 ====== 369 ALL Customer, Task & Callscreated");
    const qry = `insert into customers set name="${finalName}", email="${req.body.email}", mobile="${mobileWithC_Code}", address="${req.body.address}", type="${req.body.cusType}", status="${req.body.status}", note="${req.body.note}", created_at="${FinalCustomerCreatedAt}", company_id="${req.body.company_id}", team_id="${req.body.team_id}", user="${req.body.user}", firmname="${req.body.firmName}", firstname="${req.body.firstName}", lastname="${req.body.lastName}", priority="${req.body.Cpriority}", pincode="${req.body.pincode}", createdBy="${req.body.createdBy}";`;

    pool.query(qry, function (error, Customer_result) {
      if (error) {
        //console.log("Error in AddCustomerByPopUp line no.292===>>", error);
        return res
          .status(400)
          .json({ status: false, message: "Error Occurred", error });
      } else {
        //console.log("Customer_result===>>>>386==>>>", Customer_result);
        if (Customer_result.affectedRows > 0) {
          //console.log("in if at line no . 388====>>McreatedAt>>>");
          const taskQry = `insert into task set firstname="${req.body.firstName}", lastname="${req.body.lastName}", status="${req.body.Tstatus}", customer="${Customer_result.insertId}", user="${req.body.user}", note="${req.body.note}", mobile="${mobileWithC_Code}", created_at="${FinalTaskCreatedAt}", company_id="${req.body.company_id}", refrence_from="${req.body.refrence_from}", task_type="${req.body.task_type}", create_customer_profile="${req.body.create_customer_profile}", csr_read_profile="${req.body.csr_read_profile}", priority="${req.body.Tpriority}",task_created_by="${req.body.Ttask_created_by}", task_added_date="${TaskDate}";`;
          pool.query(taskQry, function (tskError, task_result) {
            if (tskError) {
              //console.log("Error in tskError line no.248===>>", tskError);
              return res
                .status(400)
                .json({ status: false, message: "Error Occurred", error });
            } else {
              //console.log("Task result inserted line no. 399");
              if (
                task_result.affectedRows > 0 &&
                req.body.fromPlusIcon != "fromPlusIcon"
              ) {
                //console.log("at line no. 402");
                const CallsQry = `insert into calls set call_type="${req.body.call_type}", duration="${req.body.duration}", customer="${Customer_result.insertId}", recording_url="${req.files[0].filename}", user="${req.body.user}", user_note="${req.body.note}", disposition="", created_at="${CustomerCreatedAt}", company_id="${req.body.company_id}", call_status="${req.body.CallStatus}", task_id="${task_result.insertId}";`;
                pool.query(CallsQry, function (errr, reslt) {
                  if (errr) {
                    //console.log("error in call", errr);
                    return res
                      .status(400)
                      .json({ status: false, message: "error", errr });
                  } else {
                    //console.log("at line no. 423=====");
                    return res.status(200).json({
                      status: true,
                      message: "Both record Inserted Customer & Call",
                      reslt,
                      rec: req.files[0].filename,
                    });
                  }
                });
              } else {
                return res
                  .status(200)
                  .json({ status: true, message: "Record Submitted" });
              }
            }
          });
        }
      }
    });
  } else {
    //console.log("in else===425 only customer & calls created=>>");
    const qry = `insert into customers set name="${finalName}", email="${req.body.email}", mobile="${mobileWithC_Code}", address="${req.body.address}", type="${req.body.cusType}", status="${req.body.status}", note="${req.body.note}", created_at="${FinalCustomerCreatedAt}", company_id="${req.body.company_id}", team_id="${req.body.team_id}", user="${req.body.user}", firmname="${req.body.firmName}", firstname="${req.body.firstName}", lastname="${req.body.lastName}", priority="${req.body.Cpriority}", pincode="${req.body.pincode}", createdBy="${req.body.createdBy}";`;
    pool.query(qry, function (error, Customer_result_Only) {
      if (error) {
        //console.log("Error in AddCustomerByPopUp line no.292===>>", error);
        return res
          .status(400)
          .json({ status: false, message: "Error Occurred", error });
      } else {
        //console.log("at line no. 440 ==>>>", Customer_result_Only);
        if (
          Customer_result_Only.affectedRows > 0 &&
          req.body.fromPlusIcon != "fromPlusIcon"
        ) {
          //console.log("at line no. 445");
          const CallsQry = `insert into calls set call_type='${
            req.body.call_type
          }', duration= '${req.body.duration}', customer='${
            Customer_result_Only.insertId
          }', recording_url='${req.files[0].filename}', user='${
            req.body.user
          }', user_note='${
            req.body.note
          }', disposition='', created_at='${CustomerCreatedAt}', company_id='${
            req.body.company_id
          }', call_status='${req.body.CallStatus}', task_id='${null}';`;
          pool.query(CallsQry, function (errr, reslt) {
            if (errr) {
              return res
                .status(400)
                .json({ status: false, message: "error", errr });
            } else {
              //console.log("at line no. 465=====");
              return res.status(200).json({
                status: true,
                message: "Both record Inserted Customer & Call",
                reslt,
                rec: req.files[0].filename,
              });
            }
          });
        } else {
          return res.status(200).json({
            status: true,
            message: "Record submit",
            Customer_result_Only,
          });
        }
      }
    });
  }
});

router.post("/filterOnCustomerList", function (req, res, next) {
  const qryy =
    "select customer_priority as type_id from customerpriority where company_id=? group by customer_priority";
  pool.query(qryy, [req.body.company_id], function (error, result) {
    if (error) {
      return res.status(400).json({ status: false, message: error.sqlMessage });
    } else {
      // //console.log("qryy=========293", qryy);
      // var output = result[0].concat(result[1]);
      // //console.log("output====292:", output);
      res.status(200).json({
        status: true,
        result,
        message: "Record found successfully",
      });
    }
  });
});

/// 1 june

router.post("/lastInteractionDetail", function (req, res, next) {
  const qry = `select * from calls where company_id='${req.body.company_id}' and customer='${req.body.customer}' and id in (select max(id) from calls where company_id='${req.body.company_id}' and customer='${req.body.customer}');`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error in customerPopSearch line no.201===>>", error);
      return res
        .status(400)
        .json({ status: false, message: "Error Occurred", error });
    } else {
      if (result.length > 0) {
        return res.status(200).json({
          status: true,
          message: "Record Found for last interaction",
          result,
        });
      } else {
        return res.status(200).json({
          status: false,
          message: "Record not found for last interaction",
          result,
        });
      }
    }
  });
});

router.post(
  "/UploadExcel",
  multer.single("customerExcel"),
  function (req, res, next) {
    // //console.log("Request Body In Excel", req.body);
    //console.log("Request file In Excel", req.file);
    readXlsxFile("public/images/" + req.file.filename).then((rows) => {
      rows.shift();
      var qry = "";
      var str = "";
      if (rows.length != 0) {
        rows.map((item) => {
          //console.log("Item in Excel sheet ", item);
          str = "'" + item.join("',   '") + "'";
          var now = moment();
          var tempDate = str.split(",   ")[5];
          var momentDate = moment(tempDate)
            .set({
              hour: now.hour(),
              minute: now.minute(),
              second: now.second(),
            })
            .format("YYYY-MM-DD hh:mm:ss");
          dateFormat = `'${momentDate}'`;
          str = str.split(",   ");
          str[5] = dateFormat;
          str = str.join();
          if (!str.split(",")[2].startsWith("+91")) {
            var k = str.split(",")[2];
            k = k.replace(/['"]+/g, "");
            mob = `'+91${k}'`;
            str = str.split(",");
            str[2] = mob;
            str = str.join();
          }
          qry += `INSERT INTO customers(name,email,mobile,address,note,created_at,updated_at,company_id,team_id, user, firstname, lastname, priority, pincode, createdBy) VALUES(${str});`;
        });
        pool.query(qry, function (error, result) {
          if (error) {
            //console.log("Error In Upload Excel File =====103", error);
            return res.status(400).json({
              status: false,
              message: "Error in Uploading file",
              error,
            });
          } else {
            return res.status(200).json({
              status: true,
              message: "Record Already exist",
              result,
            });
          }
        });
      }
    });
  }
);

router.post("/customerFilter/:companyId", function (req, res, next) {
  let qry = `select C.firstname, C.lastname, C.mobile, C.email, TS.refrence_from as Reference, C.created_at, C.created_at as LastActivity, (select U.name from user U where C.user=U.id) as AssignedExecutive, T.team_name as TeamName from customers C join team T on C.team_id=T.id or C.team_id=0 left join task TS on C.id=TS.customer where date(C.created_at) between "${req.body.startDate}" and "${req.body.endDate}" and C.company_id="${req.params.companyId}" group by C.id order by C.id desc; select C.*, C.name as CustomerName, C.mobile as customer_mobile, T.team_name as TeamName, TS.refrence_from, (select U.name from user U where U.id=T.team_head) as ManagerName, (select U.name from user U where C.user=U.id) as UserName, (select U.name from user U where C.createdBy=U.id) as CreatedName from customers C join team T on C.team_id=T.id or C.team_id=0 left join task TS on C.id=TS.customer where date(C.created_at) between "${req.body.startDate}" and "${req.body.endDate}" and C.company_id="${req.params.companyId}" group by C.id order by C.id desc;`;
  pool.query(qry, function (error, result) {
    if (error) {
      //console.log("Error in user filter", error);
      return res
        .status(400)
        .json({ status: false, message: error.sqlMessage, error });
    } else {
      // //console.log("Result in user filter", result);
      var tempExcelData = result[0];
      var tempData = result[1];
      var ExcelData = [tempExcelData];
      var resultt = [tempData];
      return res
        .status(200)
        .json({ status: true, message: "Record found...", resultt, ExcelData });
    }
  });
});

router.get("/display/:id/:company_id", function (req, res, next) {
  //console.log("innnn");
  const qry = `select C.*,cl.*, (select U.name from user U where C.user=U.id) as UserName from customers C join calls cl on C.id=cl.customer where C.id="${req.params.id}" and C.company_id="${req.params.company_id}" group by cl.created_at order by C.id desc;`;
  pool.query(qry, function (error, result) {
    if (error) {
      return res.status(400).json({ status: false, message: error.sqlMessage });
    } else {
      return res
        .status(200)
        .json({ status: true, data: result, message: "Call Data found!" });
    }
  });
});

router.post("/fetchcustomerpriority", function (req, res, next) {
  pool.query(
    `SELECT customerpriority_id,customer_priority,color FROM customerpriority where company_id='${req.body.company_id}'`,
    function (error, result) {
      if (error) {
        //console.log("error in edit>>>>>>", error);
        res.status(400).json({ result });
      } else {
        res.status(200).json({ result });
      }
    }
  );
});

router.get(
  "/ManagerCustomersDisplayAll/:companyId/:manager_id",
  function (req, res, next) {
    // //console.log("Request body", req.body);
    pool.query(
      `select customers.*, user.name as UserName, team.team_name as TeamName, task.refrence_from from customers inner join user on customers.user=user.id inner join team on customers.team_id=team.id or customers.user="${req.params.manager_id}" left join task on customers.id=task.customer where team.team_head="${req.params.manager_id}" and customers.company_id="${req.params.companyId}" group by customers.id order by customers.id desc; select customers.id, customers.firstname, customers.lastname, customers.mobile, customers.email, task.refrence_from, customers.created_at as Addedon, customers.created_at as LastActivity, user.name as UserName, team.team_name as TeamName from customers inner join user on customers.user=user.id inner join team on customers.team_id=team.id or customers.user="${req.params.manager_id}" left join task on customers.id=task.customer where team.team_head="${req.params.manager_id}" and customers.company_id="${req.params.companyId}" group by customers.id order by customers.id desc;`,
      function (error, result) {
        if (error) {
          //console.log("Error in Customer ======= 24", error);
          return res
            .status(400)
            .json({ status: false, message: error.sqlMessage });
        } else {
          // //console.log("Result in Customer ============ 28", result[0]);
          var tempData = result[0];
          var tempExcelData = result[1];
          var ExcelData = [tempExcelData];
          var resultt = [tempData];
          return res.status(200).json({
            status: true,
            ExcelData,
            resultt,
            message: "Customer Data found!",
          });
        }
      }
    );
  }
);

router.post(
  "/ManagercustomerFilter/:companyId/:manager_id",
  function (req, res, next) {
    //console.log("request body in customer filter", req.body);
    //console.log("request params in customer filter", req.params);
    let qry = `select customers.*, user.name as UserName, team.team_name as TeamName, task.refrence_from from customers inner join user on customers.user=user.id inner join team on customers.team_id=team.id or customers.user="${req.params.manager_id}" left join task on customers.id=task.customer where date(customers.created_at) between "${req.body.startDate}" and "${req.body.endDate}" and team.team_head=${req.params.manager_id} and customers.company_id=${req.params.companyId} group by customers.id order by customers.id desc; select customers.id, customers.firstname, customers.lastname, customers.mobile, customers.email, task.refrence_from, customers.created_at as Addedon, customers.created_at as LastActivity, user.name as UserName, team.team_name as TeamName from customers inner join user on customers.user=user.id inner join team on customers.team_id=team.id   or customers.user="${req.params.manager_id}" left join task on customers.id=task.customer where date(customers.created_at) between "${req.body.startDate}" and "${req.body.endDate}" and team.team_head="${req.params.manager_id}" and customers.company_id="${req.params.companyId}" group by customers.id order by customers.id desc;`;
    pool.query(qry, function (error, result) {
      if (error) {
        //console.log("Error in user filter", error);
        return res
          .status(400)
          .json({ status: false, message: error.sqlMessage, error });
      } else {
        //console.log("Result in user filter", result);
        var tempData = result[0];
        var tempExcelData = result[1];
        var ExcelData = [tempExcelData];
        var resultt = [tempData];
        return res.status(200).json({
          status: true,
          message: "Record found...",
          resultt,
          ExcelData,
        });
      }
    });
  }
);

router.post("/ExcelCallLog/:id/:company_id", function (req, res, next) {
  const qry = `select cl.call_type as CallType,(select U.name from user U where cl.user=U.id) as UserName, cl.created_at as CallsDateTime, if(cl.Duration,sec_to_time(cl.duration),"00:00:00") as Duration,cl.user_note as Note,cl.call_status as CallStatus,cl.disposition as Disposition from customers C join calls cl on C.id=cl.customer where cl.customer="${req.params.id}" and cl.company_id="${req.params.company_id}" and date(cl.created_At) between "${req.body.startDate}" and "${req.body.endDate}" group by cl.id order by cl.id desc;`;
  pool.query(qry, function (error, result) {
    if (error) {
      return res.status(400).json({ status: false, message: error.sqlMessage });
    } else {
      return res
        .status(200)
        .json({ status: true, data: result, message: "Excel Downloaded!" });
    }
  });
});

router.get("/AuditorTeamFilter/:companyId/:team_id", function (req, res, next) {
  pool.query(
    `select C.*, C.name as CustomerName, C.mobile as customer_mobile, T.team_name as TeamName, TS.refrence_from, (select U.name from user U where U.id=T.team_head) as ManagerName, (select U.name from user U where C.user=U.id) as UserName, (select U.name from user U where C.createdBy=U.id) as CreatedName from customers C join team T on C.team_id=T.id or C.team_id=0 left join task TS on C.id=TS.customer where C.team_id=${req.params.team_id} and C.company_id="${req.params.companyId}" group by C.id order by C.id desc;`,
    function (error, result) {
      if (error) {
        //console.log("Error in Customer ======= 24", error);
        return res
          .status(400)
          .json({ status: false, message: error.sqlMessage });
      } else {
        // //console.log("Result in Customer ============ 28", result);
        return res.status(200).json({
          status: true,
          data: result,
          message: "Customer Data found!",
        });
      }
    }
  );
});

module.exports = router;
