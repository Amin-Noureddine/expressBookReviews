const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  //------ Write your code here -----------------------------------------
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(409).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
  //---------------------------------------------------------------------
  //return res.status(300).json({message: "Yet to be implemented"});
});
// Get the book list available in the shop
public_users.get('/lu', function (req, res) {
  //Write your code here ------------------------------------------------
  res.send(JSON.stringify(users, null, 4));
  //---------------------------------------------------------------------
  //return res.status(300).json({message: "Yet to be implemented"});
});
//================================================================================
//==   TASK 10::    Get the book list available in the shop USING promise       ==
//================================================================================
public_users.get('/', function (req, res) {
  //Write your code here ------------------------------------------------
  //=== Creating a promise method. The promise will get resolved when timer times out after 6 seconds. =========
  let myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(JSON.stringify(books, null, 4));
    }, 500)
  })
  //=== Console log before calling the promise ==================================================================
  console.log("-----Before calling promise .....");
  //=== Call the promise and wait for it to be resolved and then print a message.
  myPromise.then((successMessage) => {
    res.send(successMessage)
  })
  //=== Console log after calling the promise ===================================================================
  console.log("----- After calling promise !!!!!...");
});
//================================================================================
//==   TASK 11::    book details based on ISBN USING promise                    ==
//================================================================================
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here ------------------------------------------------
  const isbn = req.params.isbn;
  //=== Creating a promise method. The promise will get resolved when timer times out after 6 seconds. =========
  let myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books[isbn]);
    }, 500)
  })
  //=== Console log before calling the promise ==================================================================
  console.log("-----Before calling promise .....");
  //=== Call the promise and wait for it to be resolved and then print a message.
  myPromise.then((successMessage) => {
    res.send(successMessage)
  })
  //=== Console log after calling the promise ===================================================================
  console.log("----- After calling promise !!!!!...");
});
//================================================================================
//==   TASK 12::     Get book details based on author USING promise             ==
//================================================================================
public_users.get('/author/:author', function (req, res) {
  //Write your code here ------------------------------------------------
  const author = req.params.author;
  //--- Loop on books array and get book by author
  let myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      let result = [];
      for (let x in books) {
        if (books[x]["author"] === author) {
          result.push(books[x]);
        }
      }
      resolve(result);
    }, 500)
  })
  //=== Console log before calling the promise ==================================================================
  console.log("-----Before calling promise .....");
  //=== Call the promise and wait for it to be resolved and then print a message.
  myPromise.then((successMessage) => {
    res.send(successMessage)
  })
  //=== Console log after calling the promise ===================================================================
  console.log("----- After calling promise !!!!!...");
});
//================================================================================
//==   TASK 14::     Get all books based on title USING promise                 ==
//================================================================================
public_users.get('/title/:title', function (req, res) {
  //Write your code here ------------------------------------------------
  const title = req.params.title;
  //--- Loop on books array and get book by author
  let myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      let result = [];
      for (let x in books) {
        if (books[x]["title"] === title) {
          result.push(books[x]);
        }
      }
      resolve(result);
    }, 500)
  })
  //=== Console log before calling the promise ==================================================================
  console.log("-----Before calling promise .....");
  //=== Call the promise and wait for it to be resolved and then print a message.
  myPromise.then((successMessage) => {
    res.send(successMessage)
  })
  //=== Console log after calling the promise ===================================================================
  console.log("----- After calling promise !!!!!...");
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here ------------------------------------------------
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews)
  //---------------------------------------------------------------------
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
