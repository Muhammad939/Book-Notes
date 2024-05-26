const express = require('express');
const path = require('path');
const axios = require('axios');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Define routes
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM books');
    const books = result.rows;

    // Fetch recommended books
    const recommendedBooks = await fetchRecommendedBooks();

    res.render('index', { books, recommendedBooks });
  } catch (err) {
    console.error('Error fetching books:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Define route to handle GET request to /search
app.get('/search', async (req, res) => {
  try {
    const query = req.query.query;
    const searchResults = await searchBooks(query);
    res.render('search', { results: searchResults, query });
  } catch (err) {
    console.error('Error fetching search results:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Function to search books using the Open Library API
async function searchBooks(query) {
  const response = await axios.get(`https://openlibrary.org/search.json?q=${query}`);
  const books = response.data.docs.map(book => {
    return {
      title: book.title,
      author: book.author_name ? book.author_name.join(', ') : 'Unknown Author',
      cover: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : 'https://via.placeholder.com/150',
      readLink: book.key ? `https://openlibrary.org${book.key}` : '#'
    };
  });
  return books;
}

// Function to fetch recommended books
async function fetchRecommendedBooks() {
  // Implement logic to fetch recommended books
  // For example:
  const recommendedBooks = [
    { title: 'Recommended Book 1', author: 'Author 1', cover: 'cover1.jpg' },
    { title: 'Recommended Book 2', author: 'Author 2', cover: 'cover2.jpg' },
    // Add more recommended books here
  ];
  return recommendedBooks;
}

// Define route to handle GET request to view a book
app.get('/book/:id', async (req, res) => {
  const bookId = req.params.id;
  try {
    const book = await fetchBookDetails(bookId);
    res.render('book', { book });
  } catch (err) {
    console.error('Error fetching book details:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Function to fetch details of a specific book using the Open Library API
async function fetchBookDetails(id) {
  const response = await axios.get(`https://openlibrary.org${id}.json`);
  return response.data;
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
