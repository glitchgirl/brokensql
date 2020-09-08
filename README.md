# brokensql - week 11 homework 3

Uses node, express, pug, body-parser, mysql, and express-validator.

Pug templates have conditional lists to show error and success messages, as well as conditionals on whether or not to prepopulate the form based on the error state.  I would have left that as comments in the template but I seem to be doing comments wrong.

There is also a secret page to dump all the users in the database into a nicely formatted table.

Missing data is in ./config/config.json, which should never be synced with git.  It is formatted like so:

{
    "host": "",
    "user": "",
    "database": "",
    "password": "",
    "port" : "",
    "seekrit" : ""
}

SQL is no longer broken.
