const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  const user = users.find(u => u.username === username);
  return user ? true : false;
}

const authenticatedUser = (username,password)=>{
  const user = users.find(u => u.username === username);
  const userToken = user.token;
  const verifyToken = jwt.verify(userToken, "access");
  return verifyToken ? true : false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {

  const {username, password} = req.body;
  if(!isValid(username)) {
    return res.status(400).json({message: "User doesn't exist."})
  }

  if(authenticatedUser(username, password)) {
    const user = users.find(u => u.username === username);
    req.session.authorization = {accessToken: user.token};
    return res.status(200).json({message: "Successfully logged in.", user})
  }

  return res.status(400).json({message: "Invalid credentials."});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

  const {isbn} = req.params;
  const {review: reviewStr} = req.query;
  const token = req.session.authorization['accessToken']
  const {username} = users.find(u => u.token === token);

  for(i in books[isbn].reviews) {
    if(books[isbn].reviews[i].user === username) {
      books[isbn].reviews[i] = {user: username, review: reviewStr};
      return res.status(200).json({message: "Updated", books})
    }
  }
  const reviewsLength = Object.keys(books[isbn].reviews).length;
  books[isbn].reviews[reviewsLength] = {user: username, review: reviewStr};
  return res.status(200).json({message: "Updated", books});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {

  const {isbn} = req.params;
  const token = req.session.authorization['accessToken']
  const {username} = users.find(u => u.token === token);

  for(i in books[isbn].reviews) {
    if(books[isbn].reviews[i].user === username) {
      books[isbn].reviews = {};
    }
  }
  return res.status(200).json({message: "Deleted", books});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
