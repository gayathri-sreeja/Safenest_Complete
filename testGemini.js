const fetch = require('node-fetch'); // Only needed in Node.js

const checkAvailableModels = async () => {
  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1/models?key=AIzaSyDcYi4BLHBnwBCmlHZGbf3yfoKVm22-U0c'
    );
    const data = await response.json();
    console.log('Available Gemini Models:', data.models);
  } catch (error) {
    console.error('Error fetching models:', error);
  }
};

checkAvailableModels();
