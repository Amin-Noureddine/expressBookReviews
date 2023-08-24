const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid ---------------------------------
    let userswithsamename = users.filter((user)=>{
        return user.username === username 
    });
     return (userswithsamename.length > 0);

}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });
    return (validusers.length > 0);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here -------------------------------------------------------
  const username = req.body.username;
  const password = req.body.password; 

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
    }

    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization.username; // Get the username from the session

  // Check if the book exists in the database
  if (books[isbn]) {
    // Initialize the reviews array if it doesn't exist
    if (!books[isbn].reviews) {
      books[isbn].reviews = [];
    }

    // Create a new review object
    const newReview = {
      username: username,
      review: review
    };

    // Add the new review to the book's reviews
    books[isbn].reviews.push(newReview);

    // Return success response
    return res.status(200).json({ message: "Review added successfully." });
  } else {
    // Book not found
    return res.status(404).json({ message: "Book not found." });
  }

});


// DELETE request: Delete a friend by email id
// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username; // Get the username from the session

  // Check if the book exists in the database
  if (books[isbn]) {
    // Check if the book has reviews
    if (books[isbn].reviews) {
      // Filter out reviews by the session username
      const filteredReviews = books[isbn].reviews.filter(review => review.username === username);

      // If there are no reviews left after filtering, remove the reviews property
      if (filteredReviews.length === 0) {
        delete books[isbn].reviews;
      } else {
        // Update the book's reviews with the filtered reviews
        books[isbn].reviews = filteredReviews;
      }

      // Return success response
      return res.status(200).json({ message: "Review deleted successfully." });
    } else {
      // No reviews for this book
      return res.status(404).json({ message: "No reviews found for this book." });
    }
  } else {
    // Book not found
    return res.status(404).json({ message: "Book not found." });
  }
});

  


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
