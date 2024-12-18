<?php
// store_signup.php

// Include the MongoDB PHP library
require 'vendor/autoload.php'; // Use Composer's autoloader

// Create a MongoDB client instance
$client = new MongoDB\Client("mongodb://localhost:27017");

// Select the database and collection
$db = $client->flood_detection;
$collection = $db->flood_alert_signups;

// Get the POST data
$name = $_POST['name'] ?? '';
$phone = $_POST['phone'] ?? '';
$address = $_POST['address'] ?? '';

// Insert the data into MongoDB
$result = $collection->insertOne([
    'name' => $name,
    'phone' => $phone,
    'address' => $address,
    'timestamp' => new MongoDB\BSON\UTCDateTime()
]);

// Respond with a success message
echo json_encode(['status' => 'success', 'message' => 'Signup successful!']);
?>
