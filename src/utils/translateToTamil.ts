import axios from 'axios';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
const GEMINI_API_KEY = 'AIzaSyCADmBskaAZRPBDLYduEBCk6JQfrnQ7OBw';

export async function translateToTamil(text: string): Promise<string> {
  if (!text) return '';
  
  try {
    console.log('Translating text:', text);
    
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              { text: `Translate this text to Tamil: "${text}". Provide ONLY the Tamil translation with proper Unicode encoding. Do not include any English text, explanations, or quotation marks in your response.` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.1, // Lower temperature for more consistent output
          maxOutputTokens: 1024,
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept-Charset': 'UTF-8'
        },
      }
    );
    
    console.log('Gemini API response:', JSON.stringify(response.data, null, 2));
    
    let translatedText = '';
    
    if (response.data && 
        response.data.candidates && 
        response.data.candidates[0] && 
        response.data.candidates[0].content && 
        response.data.candidates[0].content.parts && 
        response.data.candidates[0].content.parts[0]) {
      translatedText = response.data.candidates[0].content.parts[0].text;
      
      // Clean up the response
      translatedText = translatedText.trim();
      
      // Remove any quotation marks that might be included
      translatedText = translatedText.replace(/^["']|["']$/g, '');
      
      // Remove any instructions or English text that might be included
      translatedText = translatedText.replace(/^(Here is the translation:|The translation is:|Translated text:|In Tamil:)\s*/i, '');
      
      // Check if the text contains Tamil Unicode characters
      // Tamil Unicode range is U+0B80 to U+0BFF
      const containsTamil = /[\u0B80-\u0BFF]/.test(translatedText);
      
      if (!containsTamil && text.trim() !== '') {
        console.warn('Response does not contain Tamil characters, returning original text');
        return text; // Return original if no Tamil characters detected
      }
    }
    
    console.log('Extracted translated text:', translatedText);
    return translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text if translation fails
  }
}