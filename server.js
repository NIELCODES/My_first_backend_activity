const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const jwtSecretKey = process.env.JWT_SECRET_KEY || 'your_default_secret_key';
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(cors());


const Books = [
    {
        id: 1,
        BookName: "PHP 8",
        YearPublished: "2023",
        Author: "VicS",
        Category: "Web",
        status: 1,
    },
    {
        id: 2,
        BookName: "React.js",
        YearPublished: "2000",
        Author: "Peter SMith",
        Category: "Web",
        status: 1,
    },
    {
        id: 3,
        BookName: "CSS framework",
        YearPublished: "2005",
        Author: "Jaguar",
        Category: "Web",
        status: 1,
    },
    {
        id: 4,
        BookName: "Data Science",
        YearPublished: "2023",
        Author: "Vic S",
        Category: "Data",
        status: 1,
    },
]

const LoginProfiles = [

  {
      id: 1,
      username: "admin",
      password: "passwd123",
      isAdmin: true,
  },
  {
      id: 2,
      username: "staff",
      password: "123456",
      isAdmin: false,
  },
  {
      id: 3,
      username: "vice",
      password: "abrakadabra",
      isAdmin: false,
  },
{
      id: 4,
      username: "super",
      password: "69843",
      isAdmin: true,
  },
{
      id: 5,
      username: "user",
      password: "123",
      isAdmin: false,
  }
];

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const autHeader = req.headers.authorization;
  //const token = req.header('Authorization');
  
  const token = autHeader.split(" ")[1];
  console.log (token);
  if (!token) {
    return res.status(403).json({ message: 'Access denied. Token missing.' });
  }

  jwt.verify(token, jwtSecretKey, (err, user) => {
 
   console.log (err); 
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token has expired.' });
      }
      return res.status(401).json({ message: 'Invalid token.' });
    }

    req.user = user;
    
    next();
  });
};

 

// Endpoint to return all books
app.get('/books', (req, res) => {
  res.json(Books);
});

// Endpoint to get book details by id
app.get('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const book = Books.find((book) => book.id === bookId);

  if (!book) {
    return res.status(404).json({ message: 'Book not found.' });
  }

  res.json(book);
});

// Login endpoint to generate JWT
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // console.log(username, ' ', password);

  const user = LoginProfiles.find(
    (profile) => profile.username === username && profile.password === password
  );
  console.log(user);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const token = jwt.sign({ username, isAdmin: user.isAdmin }, jwtSecretKey, { expiresIn: '1h' });
  res.json({ token });
});

// Protected endpoint that requires JWT verification
app.get('/protected', verifyToken, (req, res) => {
  const user = req.user;
  res.json({ message: 'Protected endpoint. You are authorized.', user });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
