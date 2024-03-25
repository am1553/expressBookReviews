const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const jwt = require('jsonwebtoken');
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const {username, password} = req.body;
  if(isValid(username)) {
    return res.status(400).json({message: "username already exists."})
  }
  if(!username || !password) {
    return res.status(400).json({message: "username and password is required."})
  }

  const token = jwt.sign({username, password}, "access")
  users.push({username, password, token});

  return res.status(200).json({message: "User registered.", users});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  const booksPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books)
    },6000)
  })
  const bks = await booksPromise;
  return res.status(200).json({books: bks});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const {isbn} = req.params;
  const bookPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books[isbn])
    },6000)
  })
  const book = await bookPromise;

  return res.status(200).json({book});
});

// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  const {author} = req.params;
  const bookPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      for(i in books) {
        const bk = books[i];
        if(bk.author === author) {
          resolve(bk)
        }
      }

    },6000)
  })

  const book = await bookPromise;

  return res.status(200).json(book);
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  const {title} = req.params;
  const bookPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      for(i in books) {
        const bk = books[i];
        if(bk.title === title) {
          resolve(bk);
        }
      }
    },6000)
  })

  const book = await bookPromise


  return res.status(200).json(book);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {

  const {isbn} = req.params;
  const book = books[isbn];
  return res.status(200).json(book.reviews);
});

module.exports.general = public_users;
