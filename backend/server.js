const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const cors = require('cors');
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors()); 

app.post('/register', async (req, res) => {
  try {
    const { username, password, email, confirmPassword, agreeTerms } = req.body;

    if (!agreeTerms) {
      return res.status(400).json({ message: 'You must agree to the terms and conditions.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    const userData = { username, password, email, registeredAt: new Date() };
    fs.appendFileSync('users.txt', JSON.stringify(userData) + '\n');

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
});

app.get('/users', (req, res) => {
  try {
    const data = fs.readFileSync('users.txt', 'utf-8');
    const users = data.trim().split('\n').map(line => JSON.parse(line));
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
