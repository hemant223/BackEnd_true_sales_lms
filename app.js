var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var errorHandler = require("./routes/config/error-handler");
// var jwt = require("./routes/config/jwt");
const port = 8002;

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var companyRouter = require("./routes/company");
var teamRouter = require("./routes/team");
var customerRouter = require("./routes/customer");
var callsRouter = require("./routes/calls");
var briefingsRouter = require("./routes/briefings");
var attendenceRouter = require("./routes/attendence");
var taskRouter = require("./routes/task");
var trackerRouter = require("./routes/tracker");
var rolesRouter = require("./routes/roles");
var claimsRouter = require("./routes/claims");
var usersrolesRouter = require("./routes/usersroles");
var rolesclaimsRouter = require("./routes/rolesclaims");
var dispositionRouter = require("./routes/disposition");
var breakRouter = require("./routes/break");
var priorityRouter = require("./routes/priority");
var templateRouter = require("./routes/template");
var taskTypeRouter = require("./routes/tasktype");
var taskPriorityRouter = require("./routes/taskpriority");
var customerPriorityRouter = require("./routes/customerpriority");
var abandonedRouter = require("./routes/abandoned");
var salesforceRouter = require("./routes/salesforce");
var sf_integrationRouter = require("./routes/sf_integration");
var taskstatusRouter = require("./routes/taskstatus");
var whatsappRouter = require("./routes/whatsapp");
var calllivestatusRouter = require("./routes/calllivestatus");
var forgotPasswordRouter = require("./routes/forgotpassword");
var breakTypeRouter = require("./routes/breaktype");

var app = express();
var path = require('path');
app.set('port', 8002);
var server = require("http").Server(app);
const io = require("socket.io")(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
// app.use(jwt());

app.use("/", indexRouter);
app.use("/usersR", usersRouter);
app.use("/company", companyRouter);
app.use("/team", teamRouter);
app.use("/customers", customerRouter);
app.use("/calls", callsRouter);
app.use("/briefings", briefingsRouter);
app.use("/attendence", attendenceRouter);
app.use("/task", taskRouter);
app.use("/tracker", trackerRouter);
app.use("/roles", rolesRouter);
app.use("/claims", claimsRouter);
app.use("/usersroles", usersrolesRouter);
app.use("/rolesclaims", rolesclaimsRouter);
app.use("/disposition", dispositionRouter);
app.use("/break", breakRouter);
app.use("/priority", priorityRouter);
app.use("/abandoned", abandonedRouter);
app.use("/sf_integration", sf_integrationRouter);
app.use("/template", templateRouter);
app.use("/tasktype", taskTypeRouter);
app.use("/taskpriority", taskPriorityRouter);
app.use("/customerpriority", customerPriorityRouter);
app.use("/salesforce", salesforceRouter);
app.use("/taskstatus", taskstatusRouter);
app.use("/whatsapp", whatsappRouter);
app.use("/calllivestatus", calllivestatusRouter);
app.use("/forgotpass", forgotPasswordRouter);
app.use("/breaktype", breakTypeRouter)

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

app.use(errorHandler);

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

io.on("connection", (socket) => {
  //console.log(`user connected : ${socket.id}`);

  // insert call live status //
  socket.on("addcalllive", (data) => {
    socket.broadcast.emit("displaycalllive", data);
    //console.log("Inside addcalllivestatus",data)
    // socket.emit("displaycalllive",data)
  })

  // update call live status for wrapping up //
  socket.on("wrappingup", (data) => {
    socket.broadcast.emit("displaywrapping", data)
  })

  // Idle call live status //
  socket.on("Idle", (data) => {
    socket.broadcast.emit("displayIdle", data)
  })
})

server.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);

module.exports = app;
