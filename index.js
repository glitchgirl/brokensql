// Set up the toolbag
const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const { check, validationResult } = require("express-validator");
const app = express();
const cfg = require("./config/config.json")
const port = cfg.port;


// Set the templating engine
app.set("view engine", "pug");
app.use(bodyParser.urlencoded( { extended: true } ));
app.use(express.static(__dirname + "/public"));


// Connect to the database
const connection = mysql.createConnection({
    host     : cfg.host,
    user     : cfg.user,
    database : cfg.database,
    password : cfg.password
});


// Set up the routes
app.get("/", (req,res) => {
    res.render("home");
});

app.post("/register", [
    check("name")
        // Remove excess whitespace so we can see if we got only spaces
        .trim()
        // Name can't be just empty
        .notEmpty().withMessage("Name is required.")
        // If err, kick the user out to fix it
        .bail()
        // Matches letters spaces hyphens and apostrophes, including unicode characters for people with accents in their names
        .matches(/^[^-']([a-zA-ZÀ-ÖØ-öø-ÿ '-](?!.*''|--|  |- |' | '| -.*))+$/, 'g').withMessage("Name should start with a letter, and may only contain letters with spaces, hyphens, and apostrophes.")
        // If err, kick the user out to fix it
        .bail()
        // Match the length of the database column
        .isLength( { min:2, max:50 }).withMessage("Please enter a name between 2 and 50 characters long."),
    check("username")
        .trim()
        .notEmpty().withMessage("Username is required.")
        .bail()
        // We're allowing numbers now, but exchanged spaces for underscores, and don't care what it starts with
        .matches(/^([0-9a-zA-ZÀ-ÖØ-öø-ÿ_'-](?!.*''|--|__.*))+$/, 'g').withMessage("Username may only contain letters and numbers, with underscores, hyphens, and apostrophes.")
        .bail()
        .isLength( { min:5, max:50 }).withMessage("Please enter a username between 5 and 50 characters long."),
    check("email")
        .trim()
        .notEmpty().withMessage("Email address is required.")
        .bail()
        // There's some hot debate on the usefullness of regex validation for an email address
        // And mostly I agree that it shouldn't be used - after all, the user could just make a typo
        // You should validate an email address with a token that you send to the address
        .matches(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'g').withMessage(`Please enter a valid email address.  If you are receiving this message in error, <a href="mailto:admin@site.com?subject=Help,%20my%20email%20address%20won't%20validate!">click here</a>.`)
        .bail()
        .isLength( { min:5, max:50 }).withMessage(`Please enter an email address between 5 and 50 characters long.  If you have received this message in error, <a href="mailto:admin@site.com?subject=Help,%20my%20email%20address%20is%20too%20long%20(or%20short)!">click here</a>.`),
    ], 
    (req,res) => {
        // Let's check our results
        let result = validationResult(req);
        // Let's assign our fields to variables, trimming excess whitespace
        let name = req.body.name.trim();
        let username = req.body.username.trim();
        let email = req.body.email.trim();
        // If errors, send back to form with errors
        if (!result.isEmpty()) {
            // Stuff the errors in an object
            let error = result.errors;  
            // Show me the errors in the console
            // for (let key in validationError) {
            //     console.log(validationError[key].value);
            // }
            res.render("home", { error, name, username, email })
        }
        // If no validation errors, proceed
        else {
            // We need to make sure new user doesn't already exist in the database
            // Username and email must be unique, names not so much
            // So prepare a statement
            let count = "select count(1) as count from users where ?? = ?";
            // Check the username
            connection.query(count, ["username", username], (err, result) => {
                // If no matches, check the email
                if (result[0].count === 0) {
                    // console.log("clean username");
                    connection.query(count, ["email", email], (err, result) => {
                        // If no matches, insert record
                        if (result[0].count === 0) {
                            // console.log("clean email");
                            let insert = "insert into users(??, ??, ??) values (?, ?, ?)";
                            connection.query(insert, ["regname", "username", "email", name, username, email], (err, result) => {
                                // If err on insert for some raisin, pitch a fit
                                if (err) {
                                    console.log(err);
                                    let error = [{ "msg" : "There was an error, please try again later." }];
                                    res.render("home", { error });
                                }
                                // Success!
                                else {
                                    // console.log("new user!");
                                    let success = "Woo!"
                                    res.render("home", { success, name, username, email });
                                }
                            });
                        }
                        // If exist, request new email
                        else {
                            // console.log("Duplicate email")
                            let error = [{ "msg" : "This email address is already in use.  Choose another?" }];
                            res.render("home", { error, name, username, email });
                        }
                    });
                }
                // If exist, request new username
                else {
                    // console.log("Duplicate username")
                    let error = [{ "msg" : "This username is already in use.  Choose another?" }];
                    res.render("home", { error, name, username, email });
                }
            });
        }
});

app.get("/:text", (req,res) => {
    if (req.params.text === cfg.seekrit) {
        connection.query("select * from users", (err, result) => {
            if (err) {
                console.log(err);
                res.render("seekrit", { err });
            }
            else {
                res.render("seekrit", { result })
            }
        });
    }
    else {
        res.send("Nope.")
    }
});


// And we're running
app.listen(port, () => {
    console.log(`Server running on ${port}`);
})