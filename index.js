//use path module
const path = require("path");
//use express module
const express = require("express");
//use hbs view engine
const hbs = require("hbs");
//use bodyParser middleware
const bodyParser = require("body-parser");
//use mysql database
const mysql = require("mysql");
//session for login and other
const session = require("express-session");
//multipart form
const multiparty = require("multiparty");
const mescoursRouter = require("./routers/mescours.routes");
const app = express();

var router = express.Router();

var conn = require("./public/config/database.js");
const connection = require("./public/config/database.js");

// let cache = app.cache();
// let segment = cache.segment();
// let deletePromise = segment.delete('Name');
// deletePromise.then((entity) => { console.log(entity); });

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//set views file
app.set("views", path.join(__dirname, "views"));
//set view engine
app.set("view engine", "hbs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//set public folder as static folder for static file
// app.use('/assets',express.static(__dirname + '/public'));
app.use(express.static(__dirname + "/public"));

//authentification user
// http://localhost:3000/auth
app.post("/auth", function (request, response) {
  let form = new multiparty.Form();

  form.parse(request, function (err, fields, files) {
    var tableName = fields["tableName"];
    console.log("tableName", tableName);

    // Capture the input fields
    let username = fields["username"];
    let password = fields["password"];

    var email = "email";
    var isStudent = true;
    if (tableName != "etudiant") {
      email = "e_mail";
      isStudent = false;
    }

    // console.log('username ', username, 'password', password, 'tableName', tablename);

    // Ensure the input fields exists and are not empty
    if (username && password) {
      // Execute SQL query that'll select the account from the database based on the specified username and password
      conn.query(
        "SELECT * FROM " +
          tableName +
          " WHERE " +
          email +
          " = ? AND password = ?",
        [username, password],
        function (error, results, fields) {
          // If there is an issue with the query, output the error
          if (error) throw error;
          // If the account exists
          if (results.length > 0) {
            console.log("correct");
            // Authenticate the user
            request.session.loggedin = true;
            request.session.username = username;
            request.session.isStudent = isStudent;
            request.session.code = isStudent
              ? results[0].matricule
              : results[0].code_prof;
            // Redirect to home page
            response.header(
              "Cache-Control",
              "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
            );
            response.redirect("/home");

            //response.send('Success');
          } else {
            console.log("inccorect");
            response.send("Incorrect Username and/or Password!");
          }
          response.end();
        }
      );
    } else {
      response.send("Please enter Username and Password!");
      response.end();
    }
  });
});

app.get("/", function (request, response) {
  response.redirect("/home");
});

// http://localhost:3000/home
app.get("/home", function (request, response) {
  // If the user is loggedin
  if (request.session.loggedin) {
    // Output username
    if (request.session.isStudent) {
      response.render("student-dashboard");
    } else {
      console.log("prof");
      response.render("instructor-dashboard");
    }
    //response.send('Welcome back, ' + request.session.username + '!');
  } else {
    // Not logged in
    // response.send('Please login to view this page!');
    response.render("sign-in");
  }

  //response.end();

  return response;
});

/**select query**/
app.post("/selectData", function (req, res) {
  var query = req.body.query;
  console.log(query);
  connection.query(query, function (err, results) {
    if (err) throw err;
    res.send(results);
  });
});

/**insert query**/
app.post("/insertData", function (req, res) {
  var sessionInfos = req.session();
  let form = new multiparty.Form();
  let newID = undefined;
  createdBy = sessionInfos.userID;
  form.parse(req, function (err, fields, files) {
    /*INSERT DATA FORM*/

    /*get table name, file path and file content*/
    var tableName = fields["tableName"];
    var filePath = fields["filePath"];
    var fileContent = fields["fileContent"];
    /*remove table name, file path and file content from array Fields, Files*/
    delete fields["tableName"];
    delete fields["filePath"];
    delete files["fileContent"];
    /*create querry*/
    var sql = "INSERT INTO " + tableName + " SET ? " + fields;
    /*execute querry*/
    conn.query(sql, async function (err, result) {
      if (err) throw err;
      /**Get return ID after insert**/
      newID = result.insertId;
      console.log(result.insertId);
      if (files && newID) {
        /*INSERT FILES*/
        var sqlFiles =
          "INSERT INTO Files (name, types, parentId, createdBy, lastModifiedBy) VALUES ?";
        var values = [];
        files.forEach((element) => {
          values.push([
            element.originalFilename,
            path.extname(element.originalFilename),
            newID,
            createdBy,
            createdBy,
          ]);

          var file_name = path.extname(element.originalFilename);
          var tmp_path = element.path;
          var target_path = __dirname + "/public/file_cours/" + file_name;
          upload_file(tmp_path, target_path);
        });

        conn.query(sqlFiles, [values], function (err) {
          if (err) throw err;
          /**rename file with id files inserted**/
        });
      }
      res.send(result);
      // conn.end();
    });
  });
});

app.use(mescoursRouter);

/***define root***/
//

//server listening
app.listen(8002, () => {
  console.log("Server is running at port 8002");
});
