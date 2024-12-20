const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs'); // For reading JSON files
const path = require('path');
const bodyParser = require('body-parser'); // Middleware for handling JSON
const port = 3019;

const app = express();
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/SMSsignup');
const db = mongoose.connection;

db.once('open', () => {
    console.log('MongoDB connection successful');
});

// Define Schema and Model
const userSchema = new mongoose.Schema({
    name: String,
    number: String,
    address: String,
});

const Users = mongoose.model('data', userSchema);

// Serve HTML Form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint to Fetch Data Based on Areas
app.post('/fetchAreaData', async (req, res) => {
    const { areas } = req.body;

    try {
        const query = areas.length > 0 ? { address: { $in: areas } } : {};
        const data = await Users.find(query);
        console.log('Fetched Data:', data); // Log to console
        res.json(data); // Send data as JSON response
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Error fetching data');
    }
});

// Function to Read JSON File and Query MongoDB
async function processJSONInput() {
    const filePath = path.join(__dirname, 'module_input.json');
    try {
        // Read the JSON file
        const fileData = fs.readFileSync(filePath, 'utf8');
        const jsonData = JSON.parse(fileData);

        // Extract area names
        const areaNames = jsonData.areas || [];
        console.log('Areas from JSON:', areaNames);

        // Query MongoDB for these areas
        const result = await Users.find({ address: { $in: areaNames } });
        console.log('Data fetched from MongoDB:', result);
    } catch (err) {
        console.error('Error processing JSON input:', err);
    }
}

// Call the function when the server starts
processJSONInput();

// Start the Server
app.listen(port, () => {
    console.log('Server started on port', port);
});