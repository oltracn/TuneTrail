const axios = require('axios');
const cheerio = require('cheerio');
const https = require('https'); // Import the https module
// Revert SDK import (or remove if not needed elsewhere)
// const { GoogleGenAI } = require('@google/genai');
const { HttpsProxyAgent } = require('https-proxy-agent'); // Import the proxy agent

// --- Gemini Configuration ---
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Define the proxy agent (use environment variable or hardcode for testing)
const proxyUrl = process.env.HTTPS_PROXY || 'http://127.0.0.1:7890'; // Use the proxy URL
const agent = proxyUrl ? new HttpsProxyAgent(proxyUrl) : undefined; // Define agent for axios

// --- Set Global Agent (Use with caution) ---
// Keep this removed as requested
// if (agent) {
//   console.log('Setting global HTTPS agent...');
//   https.globalAgent = agent;
// }
    // --- End Global Agent ---

    // Remove SDK initialization
    // const genAI = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;

    // Keep generationConfig for direct API call payload
    const generationConfig = {
  temperature: 0.2, // Lower temperature for more deterministic output
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
  responseMimeType: "application/json", // Request JSON output
};

// Safety settings - adjust as needed, be cautious with blocking
// Safety settings - adjust as needed, be cautious with blocking
// Safety settings - adjust as needed, be cautious with blocking
const safetySettings = [
  // Format for REST API
  { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
];
// --- End Gemini Configuration ---


module.exports = async (req, res) => {
  // 允许来自任何源的 CORS 请求 (仅用于开发，生产环境应更严格)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理 OPTIONS 预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required in the request body' });
  }

  // --- Proxy Test (Can be removed now if global agent works) ---
  // console.log('Testing proxy connection to Google...');
  // try {
  //   // const proxyTestAgent = new HttpsProxyAgent(proxyUrl); // Create agent instance for test
  //   const testResponse = await axios.get('https://www.google.com', {
  //     // httpsAgent: proxyTestAgent, // Use the agent for this request - axios might need explicit agent even with global
  //     httpsAgent: agent, // Test if axios picks up global or needs explicit
  //     timeout: 5000 // Short timeout for test
  //   });
  //   console.log(`Proxy test successful! Status: ${testResponse.status}`);
  // } catch (proxyTestError) {
  //   console.error(`Proxy test FAILED: ${proxyTestError.message}`);
  // }
  // --- End Proxy Test ---


  try {
    // 1. 获取 URL 内容
    // Note: This axios call does NOT use the proxy by default.
    // If the target URL also needs proxy access, configure axios globally or per-request.
    const response = await axios.get(url, {
      headers: {
        // 模拟浏览器 User-Agent，有些网站可能需要
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      // 设置超时以防止请求挂起
      timeout: 10000, // 10 秒
    });

    const html = response.data;

    // 2. 使用 Cheerio 解析 HTML
    const $ = cheerio.load(html);

    // 3. 使用 Gemini 提取音乐信息
    const title = $('title').text();
    let potentialMusicMentions = [];

    // if (!geminiModel) { // <<< Keep this commented out
    //   console.error('Gemini API Key or Model not configured.');
    //   return res.status(500).json({ error: 'Server configuration error: Gemini not configured.' });
    // }

    // Extract body text for Gemini analysis
    // Remove script and style tags to reduce noise
    $('script, style').remove();
    const bodyText = $('body').text()
      .replace(/\s\s+/g, ' ') // Replace multiple whitespace with single space
      .trim();

    if (!bodyText) {
        return res.status(400).json({ error: 'Could not extract text content from the URL.' });
    }

    // Construct the prompt for Gemini
    const prompt = `Analyze the following podcast shownotes text and extract potential music mentions. Focus on lines or phrases that likely represent "Artist - Track Title". Return the results ONLY as a JSON array of strings, where each string is a potential music mention. If no music mentions are found, return an empty JSON array [].

Text:
---
${bodyText.substring(0, 30000)}
---

JSON Array Output:`; // Limit input text size if necessary

    // --- REMOVE OLD SDK CALL BLOCK ---
    // try {
    //   console.log("Sending request to Gemini...");
    //   const result = await geminiModel.generateContent({ // This uses undefined geminiModel
    //     contents: [{ role: "user", parts: [{ text: prompt }] }],
    //     generationConfig,
    //     safetySettings,
    //   });
    //
    //   const response = result.response;
    //   const responseText = response.text();
    //   console.log("Gemini Response Text:", responseText);
    //
    //   // Attempt to parse the JSON response from Gemini
    //   try {
    //     potentialMusicMentions = JSON.parse(responseText);
    //     if (!Array.isArray(potentialMusicMentions)) {
    //         console.error("Gemini response was not a valid JSON array.");
    //         potentialMusicMentions = []; // Reset if not an array
    //     }
    //      // Further clean/validate mentions if needed
    //     potentialMusicMentions = potentialMusicMentions.map(m => String(m).trim()).filter(m => m.length > 3 && m.includes(' - '));
    //
    //   } catch (parseError) {
    //     console.error('Error parsing Gemini JSON response:', parseError.message);
    //     // Handle cases where Gemini might not return perfect JSON
    //     potentialMusicMentions = [];
    //   }
    //
    // } catch (geminiError) {
    //   console.error('Error calling Gemini API:', geminiError.message); // This is the error being logged
    //   // Optionally check for specific block reasons
    //   // if (geminiError.response && geminiError.response.promptFeedback) {
    //   //   console.error('Gemini Block Reason:', geminiError.response.promptFeedback.blockReason);
    //   // }
    //   // return res.status(500).json({ error: 'Failed to process text with AI.', details: geminiError.message });
    // }
    // --- END REMOVE OLD SDK CALL BLOCK ---


    // --- Direct Axios Gemini Call ---
    console.log("Attempting direct Axios call to Gemini REST API...");
    try {
        if (!GEMINI_API_KEY) {
             throw new Error('Gemini API Key not found in environment variables.');
        }
        // Use a confirmed or latest appropriate model name
        const modelNameToUse = "gemini-1.5-flash-latest"; // Revert to this for now
        const geminiRestApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelNameToUse}:generateContent?key=${GEMINI_API_KEY}`;
        const restPayload = {
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig,
            safetySettings, // Include safety settings for REST call
        };

        const restResponse = await axios.post(geminiRestApiUrl, restPayload, {
            httpsAgent: agent, // Explicitly use the proxy agent for this axios call
            headers: { 'Content-Type': 'application/json' },
            timeout: 15000 // Slightly longer timeout for direct call test
        });

        console.log("Direct Axios Gemini call SUCCESSFUL!");
        // console.log("Direct Response Data:", JSON.stringify(restResponse.data, null, 2)); // Log full response if needed

        // Extract potential mentions from the direct response
        if (restResponse.data && restResponse.data.candidates && restResponse.data.candidates[0].content && restResponse.data.candidates[0].content.parts && restResponse.data.candidates[0].content.parts[0].text) {
            const directResponseText = restResponse.data.candidates[0].content.parts[0].text;
            console.log("Direct Gemini Response Text:", directResponseText);
             try {
                potentialMusicMentions = JSON.parse(directResponseText);
                if (!Array.isArray(potentialMusicMentions)) {
                    console.error("Direct Gemini response was not a valid JSON array.");
                    potentialMusicMentions = [];
                }
                potentialMusicMentions = potentialMusicMentions.map(m => String(m).trim()).filter(m => m.length > 3 && m.includes(' - '));
             } catch (parseError) {
                console.error('Error parsing direct Gemini JSON response:', parseError.message);
                potentialMusicMentions = [];
             }
        } else {
            console.error("Could not find expected text in direct Gemini response structure.");
            potentialMusicMentions = [];
        }

    } catch (axiosGeminiError) {
        console.error('Direct Axios Gemini call FAILED:', axiosGeminiError.message);
        if (axios.isAxiosError(axiosGeminiError)) {
            if (axiosGeminiError.response) {
                console.error('Axios Error Status:', axiosGeminiError.response.status);
                console.error('Axios Error Data:', JSON.stringify(axiosGeminiError.response.data, null, 2));
            } else if (axiosGeminiError.request) {
                console.error('Axios Error: No response received.');
            }
        }
         // Return error to client
        return res.status(500).json({ error: 'Failed to process text with AI (Direct Call).', details: axiosGeminiError.message });
    }
    // --- End Direct Axios Gemini Call ---


    // 4. 使用 YouTube API 搜索提取的音乐 (Keep this part, but it now uses results from direct call)
    // const apiKey = process.env.YOUTUBE_API_KEY; // <<< REMOVE THIS DUPLICATE DECLARATION
    // if (!apiKey) { // <<< REMOVE THIS DUPLICATE CHECK
        // const lines = bodyText.split('\n');
        // potentialMusicMentions = lines
        //   .map(line => line.trim())
        //   .filter(line => line.includes('-') || line.includes(':')) // 注意: 简单规则可能需要调整
        //   .filter(line => line.length > 5 && line.length < 150);
    // } // <<< REMOVE THIS MISPLACED BRACE

    // 4. 使用 YouTube API 搜索提取的音乐
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      console.error('YOUTUBE_API_KEY environment variable is not set.');
      return res.status(500).json({ error: 'Server configuration error: YouTube API key missing.' });
    }

    const searchResults = [];
    const youtubeApiUrl = 'https://www.googleapis.com/youtube/v3/search';
    const batchSize = 5; // 一次并行处理 5 个请求

    for (let i = 0; i < potentialMusicMentions.length; i += batchSize) {
      const batch = potentialMusicMentions.slice(i, i + batchSize);
      console.log(`Processing YouTube search batch: ${i / batchSize + 1} (size: ${batch.length})`);

      // Create promises for the current batch
      const promises = batch.map(async (mention) => {
        const searchQuery = mention;
        try {
          const youtubeResponse = await axios.get(youtubeApiUrl, {
            params: {
              part: 'snippet',
              q: searchQuery,
              type: 'video',
              videoCategoryId: '10', // Music category ID
              maxResults: 1,         // 只获取最相关的结果
              key: apiKey,
            },
            timeout: 8000, // YouTube API 请求超时增加到 8 秒
          });

          if (youtubeResponse.data.items && youtubeResponse.data.items.length > 0) {
            const firstResult = youtubeResponse.data.items[0];
            const videoId = firstResult.id.videoId;
            const videoTitle = firstResult.snippet.title;
            const youtubeMusicLink = `https://music.youtube.com/watch?v=${videoId}`;
            return { // Return success result object
              mention: mention,
              youtubeTitle: videoTitle,
              youtubeMusicLink: youtubeMusicLink,
            };
          } else {
            return { // Return not found result object
              mention: mention,
              youtubeTitle: 'Not Found',
              youtubeMusicLink: null,
            };
          }
        } catch (youtubeError) {
          console.error(`Error searching YouTube for "${searchQuery}":`, youtubeError.message);
          return { // Return error result object
            mention: mention,
            youtubeTitle: 'Search Error',
            youtubeMusicLink: null,
            errorDetails: youtubeError.message,
          };
        }
      }); // End map

      // Wait for all promises in the batch to settle
      const batchResults = await Promise.allSettled(promises);

      // Process the results of the settled promises
      batchResults.forEach(result => {
        if (result.status === 'fulfilled') {
          searchResults.push(result.value); // Add the result object (success, not found, or error)
        } else {
          // This case should ideally not happen often as errors are caught inside the promise
          console.error('A YouTube search promise was unexpectedly rejected:', result.reason);
          // Maybe push a generic error object if needed? For now, just log.
        }
      });

      // Optional delay between batches
      if (i + batchSize < potentialMusicMentions.length) {
        await new Promise(resolve => setTimeout(resolve, 200)); // Pause 200ms
      }
    } // End for loop

    // 5. 返回最终结果
    res.status(200).json({
      title: title,
      results: searchResults,
    });

  } catch (error) {
    console.error('Error processing URL:', error.message);
    // 提供更详细的错误信息给客户端（可选，取决于安全策略）
    let errorMessage = 'Failed to process URL.';
    if (axios.isAxiosError(error)) {
        errorMessage = `Error fetching URL: ${error.message}`;
        if (error.response) {
            errorMessage += ` (Status: ${error.response.status})`;
        }
    } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Error fetching URL: Request timed out.';
    }
    // Specific handling for 403 Forbidden
    if (axios.isAxiosError(error) && error.response && error.response.status === 403) {
      errorMessage = '无法访问目标 URL (403 Forbidden)，可能目标网站限制了访问。';
      res.status(403).json({ error: errorMessage, details: 'Access denied by target server.' });
    } else {
      res.status(500).json({ error: errorMessage, details: error.message });
    }
  }
};
