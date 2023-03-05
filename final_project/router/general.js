const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const doesExist = (username)=>{
    let usersamename = users.filter((user)=>{
      return user.username === username
    });
    if(usersamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User " +username+ " successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User " +username+ " already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  await res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {

  const isbn = req.params.isbn
  await res.send(JSON.stringify(books[isbn]));
 });
  
// Get book details based on author
public_users.get('/author/:author',async (req, res) =>{
    const author = req.params.author;
    const booksByAuthor = [];
    for (const key in books) {
      if (books[key].author === author) {
        await booksByAuthor.push(books[key]);
      }
    }
    if (booksByAuthor.length === 0) {
        return res.status(404).json({message: "Books not found"});
    }
    return res.status(200).json({booksByAuthor});
    
});

// Get all books based on title
public_users.get('/title/:title',async (req, res) =>{
    const title = req.params.title;
    const booksByTitle = [];
    for (const key in books) {
      if (books[key].title === title) {
        await booksByTitle.push(books[key]);
      }
    }
    if (booksByTitle.length === 0) {
        return res.status(404).json({message: "Books not found"});
    }
return res.status(200).json({booksByTitle});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  res.send(JSON.stringify(book.reviews));
});

module.exports.general = public_users;
