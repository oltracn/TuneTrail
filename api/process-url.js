const axios = require('axios');
const cheerio = require('cheerio');
const https = require('https'); // Import the https module
const { HttpsProxyAgent } = require('https-proxy-agent'); // Import the proxy agent

// --- Gemini Configuration ---
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Define the proxy agent (use environment variable or hardcode for testing)
const proxyUrl = process.env.HTTPS_PROXY || 'http://127.0.0.1:7890'; // Use the proxy URL
const agent = proxyUrl ? new HttpsProxyAgent(proxyUrl) : undefined; // Define agent for axios

// Keep generationConfig for direct API call payload
const generationConfig = {
  temperature: 0.2, // Lower temperature for more deterministic output
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
  responseMimeType: "application/json", // Request JSON output
};

// Safety settings - adjust as needed, be cautious with blocking
const safetySettings = [
  { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
];
// --- End Gemini Configuration ---

// --- Spotify Configuration ---
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
let spotifyToken = null;
let spotifyTokenExpiry = 0;

async function getSpotifyToken() {
  // Check if token exists and is not expired (with a small buffer)
  if (spotifyToken && Date.now() < spotifyTokenExpiry - 60000) {
    return spotifyToken;
  }

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    console.error('Spotify Client ID or Secret not configured.');
    throw new Error('Server configuration error: Spotify credentials missing.');
  }

  console.log('Requesting new Spotify token...');
  const authString = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');

  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      httpsAgent: agent, // Use proxy agent if configured
      timeout: 8000,
    });

    spotifyToken = response.data.access_token;
    spotifyTokenExpiry = Date.now() + (response.data.expires_in * 1000);
    console.log('New Spotify token obtained.');
    return spotifyToken;
  } catch (error) {
    console.error('Error getting Spotify token:', error.response ? error.response.data : error.message);
    spotifyToken = null; // Reset token on error
    spotifyTokenExpiry = 0;
    throw new Error('Failed to obtain Spotify access token.');
  }
}
// --- End Spotify Configuration ---


module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Get URL from request body
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required in the request body' });
  }

  try {
    // 1. Fetch URL Content
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      timeout: 10000,
    });
    const html = response.data;

    // 2. Parse HTML
    const $ = cheerio.load(html);
    const pageTitle = $('title').text();

    // 3. Extract Music Mentions using Gemini
    let potentialMusicMentions = [];
    $('script, style').remove();
    const bodyText = $('body').text().replace(/\s\s+/g, ' ').trim();

    if (!bodyText) {
      return res.status(400).json({ error: 'Could not extract text content from the URL.' });
    }

    const prompt = `Analyze the following podcast shownotes text and extract potential music mentions. Focus on lines or phrases that likely represent "Artist - Track Title". Return the results ONLY as a JSON array of strings, where each string is a potential music mention. If no music mentions are found, return an empty JSON array [].

Text:
---
${bodyText.substring(0, 30000)}
---

JSON Array Output:`;

    console.log("Attempting direct Axios call to Gemini REST API...");
    try {
      if (!GEMINI_API_KEY) {
        throw new Error('Gemini API Key not found.');
      }
      const modelNameToUse = "gemini-1.5-flash-latest";
      const geminiRestApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelNameToUse}:generateContent?key=${GEMINI_API_KEY}`;
      const restPayload = { contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig, safetySettings };
      const restResponse = await axios.post(geminiRestApiUrl, restPayload, { httpsAgent: agent, headers: { 'Content-Type': 'application/json' }, timeout: 15000 });
      console.log("Direct Axios Gemini call SUCCESSFUL!");

      if (restResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        const directResponseText = restResponse.data.candidates[0].content.parts[0].text;
        console.log("Direct Gemini Response Text:", directResponseText);
        try {
          potentialMusicMentions = JSON.parse(directResponseText);
          if (!Array.isArray(potentialMusicMentions)) {
            potentialMusicMentions = [];
          }
          potentialMusicMentions = potentialMusicMentions.map(m => String(m).trim()).filter(m => m.length > 3 && m.includes(' - '));
        } catch (parseError) {
          console.error('Error parsing Gemini JSON response:', parseError.message);
          potentialMusicMentions = [];
        }
      } else {
        potentialMusicMentions = [];
      }
    } catch (axiosGeminiError) {
      console.error('Direct Axios Gemini call FAILED:', axiosGeminiError.message);
      return res.status(500).json({ error: 'Failed to process text with AI.', details: axiosGeminiError.message });
    }

    // 4. Search Spotify (YouTube removed)
    const searchResults = [];
    const batchSize = 5;
    const spotifyApiUrl = 'https://api.spotify.com/v1/search';

    // Check Spotify credentials
    const searchSpotify = SPOTIFY_CLIENT_ID && SPOTIFY_CLIENT_SECRET;
    if (!searchSpotify) {
        console.error('Spotify credentials not configured. Cannot search Spotify.'); // Changed warn to error
        return res.status(500).json({ error: 'Server configuration error: Spotify API credentials missing.' }); // Changed message
    }

    for (let i = 0; i < potentialMusicMentions.length; i += batchSize) {
      const batch = potentialMusicMentions.slice(i, i + batchSize);
      console.log(`Processing search batch: ${i / batchSize + 1} (size: ${batch.length})`);

      const promises = batch.map(async (mention) => {
        const searchQuery = mention;
        // Simplified result object - only Spotify fields
        let result = {
            mention: mention,
            spotifyTitle: 'Not Found',
            spotifyArtist: null,
            spotifyLink: null,
            errorDetails: null
        };

        try {
          const apiPromises = [];
          let spotifyPromiseIndex = -1;

          // Prepare Spotify Promise
          try {
            const token = await getSpotifyToken();
            apiPromises.push(axios.get(spotifyApiUrl, {
              headers: { 'Authorization': `Bearer ${token}` },
              params: { q: searchQuery, type: 'track', limit: 1 },
              httpsAgent: agent,
              timeout: 8000,
            }));
            spotifyPromiseIndex = apiPromises.length - 1; // Will be 0
          } catch (tokenError) {
            console.error(`Failed to get Spotify token for "${searchQuery}":`, tokenError.message);
            result.spotifyTitle = 'Token Error';
            result.errorDetails = `SP Token: ${tokenError.message}`;
            // Skip adding promise if token fails
          }


          // Execute only the Spotify promise if prepared
          if (apiPromises.length > 0) {
              const settledResults = await Promise.allSettled(apiPromises);

              // Process Spotify result
              const spotifySettled = settledResults[spotifyPromiseIndex]; // Index will be 0
              if (spotifySettled.status === 'fulfilled' && spotifySettled.value.data.tracks?.items?.length > 0) {
                  const firstTrack = spotifySettled.value.data.tracks.items[0];
                  result.spotifyTitle = firstTrack.name;
                  result.spotifyArtist = firstTrack.artists.map(a => a.name).join(', ');
                  result.spotifyLink = firstTrack.external_urls?.spotify || null;
              } else if (spotifySettled.status === 'rejected') {
                  console.error(`Error searching Spotify for "${searchQuery}":`, spotifySettled.reason.message);
                  result.spotifyTitle = 'Search Error';
                  result.errorDetails = (result.errorDetails ? result.errorDetails + '; ' : '') + `SP: ${spotifySettled.reason.message}`;
              }
          }

        } catch (error) {
          console.error(`Unexpected error processing mention "${searchQuery}":`, error.message);
          result.spotifyTitle = 'Processing Error'; // Update error field
          result.errorDetails = error.message;
        }
        return result; // Return the simplified result object
      }); // End map

      const batchResults = await Promise.allSettled(promises);
      batchResults.forEach(result => {
        if (result.status === 'fulfilled') {
          searchResults.push(result.value);
        } else {
          console.error('A search promise was unexpectedly rejected:', result.reason);
          // Optionally push an error object to searchResults here
          searchResults.push({
              mention: 'Unknown (Promise Rejected)', // Attempt to find mention if possible, otherwise use placeholder
              spotifyTitle: 'Promise Error',
              spotifyArtist: null,
              spotifyLink: null,
              errorDetails: `Promise rejected: ${result.reason?.message || result.reason}`
          });
        }
      });

      if (i + batchSize < potentialMusicMentions.length) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    } // End for loop

    // 5. Return Final Results
    res.status(200).json({
      title: pageTitle,
      results: searchResults, // Contains only Spotify results now
    });

  } catch (error) {
    console.error('Error processing URL:', error.message);
    let errorMessage = 'Failed to process URL.';
    let statusCode = 500;

    if (axios.isAxiosError(error)) {
        errorMessage = `Error fetching URL: ${error.message}`;
        if (error.response) {
            errorMessage += ` (Status: ${error.response.status})`;
            statusCode = error.response.status === 403 ? 403 : 500;
            if (statusCode === 403) {
                 errorMessage = '无法访问目标 URL (403 Forbidden)，可能目标网站限制了访问。';
            }
        }
    } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Error fetching URL: Request timed out.';
        statusCode = 504;
    } else if (error.message.includes('Spotify credentials missing') || error.message.includes('Failed to obtain Spotify access token')) {
        errorMessage = `Server configuration error: ${error.message}`;
    }

    res.status(statusCode).json({ error: errorMessage, details: error.message });
  }
};
