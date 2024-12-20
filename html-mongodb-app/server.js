const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const port = 3020

const app = express();
app.use(express.static(__dirname))
app.use(express.urlencoded({ extended: true }))

mongoose.connect('mongodb://127.0.0.1:27017/SMSsignup')
const db = mongoose.connection
db.once('open', () => {
    console.log("MongoDB connection successful")
})

// Define the schema
const userSchema = new mongoose.Schema({
    name: String,
    number: String,
    address: String, // 'address' here refers to the dropdown field value
})

// Create the model
const Users = mongoose.model('data', userSchema)

// Serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

// Handle form submission
app.post('/post', async (req, res) => {
    // Extract data from the form
    const { name, phone, address } = req.body; // Ensure 'area' matches the name attribute in the dropdown

    // Create a new user document
    const user = new Users({
        name,
        number: phone, // Save the phone number
        address: address,  // Save the selected dropdown value as 'address'
    });

    try {
        // Save to MongoDB
        await user.save();
        res.send("Form Submitted");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error submitting the form");
    }
});

// Fetch phone numbers grouped and sorted by area
app.get('/numbers-by-area', async (req, res) => {
    try {
        const result = await Users.aggregate([
            {
                $group: {
                    _id: "$address", // Group by address (area)
                    phoneNumbers: { $push: "$number" } // Collect all phone numbers for the area
                }
            },
            {
                $sort: { _id: 1 } // Sort areas alphabetically
            }
        ]);

        res.json(result); // Return the result as a JSON response
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("Error fetching data");
    }
});

// Start the server
app.listen(port, () => {
    console.log("Server started on port", port)
})
