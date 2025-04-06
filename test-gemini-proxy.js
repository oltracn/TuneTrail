require('dotenv').config(); // Load .env variables
const https = require('https');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { HttpsProxyAgent } = require('https-proxy-agent');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const proxyUrl = process.env.HTTPS_PROXY || 'http://127.0.0.1:7890'; // Your proxy URL

async function runTest() {
  if (!GEMINI_API_KEY) {
    console.error('Error: GEMINI_API_KEY not found in environment variables.');
    return;
  }

  console.log(`Using Proxy: ${proxyUrl}`);
  const agent = new HttpsProxyAgent(proxyUrl);

  console.log('Setting global HTTPS agent for this test...');
  https.globalAgent = agent;

  try {
    console.log('Initializing GoogleGenerativeAI...');
    // Initialize without explicit agent, relying on globalAgent
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    console.log('Sending simple request to Gemini API...');
    const result = await model.generateContent("Test prompt"); // Simple test prompt
    const response = result.response;
    const text = response.text();
    console.log("Gemini API Test SUCCESSFUL!");
    console.log("Response:", text.substring(0, 100) + "..."); // Print first 100 chars

  } catch (error) {
    console.error('Error calling Gemini API in test script:', error.message);
    if (error.cause) {
        console.error('Cause:', error.cause);
    }
  }
}

runTest();
