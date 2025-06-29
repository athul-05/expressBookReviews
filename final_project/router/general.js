const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (users.find(user => user.username === username)) {
    return res.status(400).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

// Task 1 & Task 10: Get the book list available in the shop using async/await
public_users.get('/', async function (req, res) {
  try {
    const getBooks = () => {
      return new Promise((resolve) => {
        resolve(books);
      });
    };
    const allBooks = await getBooks();
    res.status(200).send(JSON.stringify(allBooks, null, 4));
  } catch (err) {
    res.status(500).json({ message: "Error retrieving books" });
  }
});

// Task 2 & Task 11: Get book details based on ISBN using async/await
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const getBookByISBN = () => {
      return new Promise((resolve, reject) => {
        if (books[isbn]) {
          resolve(books[isbn]);
        } else {
          reject("Book not found");
        }
      });
    };
    const book = await getBookByISBN();
    res.status(200).send(book);
  } catch (err) {
    res.status(404).json({ message: err });
  }
});

// Task 3 & Task 12: Get book details based on author using async/await
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const getBooksByAuthor = () => {
      return new Promise((resolve) => {
        const matchingBooks = Object.values(books).filter(book => book.author === author);
        resolve(matchingBooks);
      });
    };
    const authorBooks = await getBooksByAuthor();
    res.status(200).send(authorBooks);
  } catch (err) {
    res.status(500).json({ message: "Error finding books by author" });
  }
});

// Task 4 & Task 13: Get book details based on title using async/await
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const getBooksByTitle = () => {
      return new Promise((resolve) => {
        const matchingBooks = Object.values(books).filter(book => book.title === title);
        resolve(matchingBooks);
      });
    };
    const titleBooks = await getBooksByTitle();
    res.status(200).send(titleBooks);
  } catch (err) {
    res.status(500).json({ message: "Error finding books by title" });
  }
});

// Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
