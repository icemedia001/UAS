const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const configureMiddleware = (app) => {
    app.use(express.json());
    app.use(cookieParser());
    app.use(
        session({
            secret: "whatisyoursecretfirst",
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: false,
                maxAge: 24*60*60*1000
            }
        })
    );
};
module.exports = configureMiddleware;