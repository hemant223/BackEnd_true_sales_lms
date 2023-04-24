var express = require('express');
var router = express.Router();
var pool = require('./pool')
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('salesforce');
});

router.post("/SalesforceDB", function (req, res, next) {
  //console.log('req.body???????10', req.body)
    pool.query(`select * from sf_integration where companyid=${req.body.company_id}`, function (error, result) {
        if (error) {
            res.status(500).json({ status: false, message: error.sqlMessage });
        }
        else {
            res.status(200).json({ status: true, data: result, message: "SalesforceDB Data found!" });
        }
    }
    );
});

module.exports = router;