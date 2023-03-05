const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    {
        username: "user1",
        password: "password1"
    },
    {
        username: "user2",
        password: "password2"
    },
    {
        username: "user3",
        password: "password3"
    },
];

const isValid = (username)=>{ 
return users.some((user) => user.username === username);
}

const authenticatedUser = (username,password)=>{ 
return users.some((user) => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign(
            {
                data: password,
            },
            "access",
            { expiresIn: 60 * 60 }
        );

        req.session.authorization = {
            accessToken,
            username,
        };
        return res.status(200).json({ message:"User successfully logged in" });
    } else {
        return res.status(200).json({ message:"Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;
    let book = books[isbn];
    let review = req.query.review;
    const username = req.session.authorization.username	
    if (book) { 
        book.reviews[username] = review;
        books[isbn] = book;
        return res.status(200).json({message: "The review for the book with ISBN "+isbn+ " has been added/ updated."});
    }
    return res.status(404).json({ message: "Invalid ISBN" });
});
regd_users.delete("/auth/review/:isbn", (req, res) => {

     const isbn = req.params.isbn
     const username = req.session.authorization.username
     if (books[isbn]) {
         let book = books[isbn]
         delete book.reviews[username]
         return res.status(200).send({message: "Review successfully deleted"})
     } else {
         return res.status(404).json({message: "ISBN not found"})
     }
 });
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
