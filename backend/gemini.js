import axios from "axios";

const geminiResponse = async (command, assistantName, userName) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY; // keep secrets in env
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    // Normalize command (remove assistant name if present)
    const strippedInput = command?.replace(new RegExp(assistantName, "ig"), "").trim();

    const systemPrompt = `
You are a Virtual Assistant named ${assistantName}, created by ${userName}. You are friendly and respond briefly like a voice assistant. 
You are not Google. Always reply ONLY with a single JSON object: { "type": <enum>, "userInput": <string>, "response": <string> }.
- "type": infer user intent from the list (general, google_search, youtube_search, youtube_play, wikipedia_search, instagram_open, facebook_open, news_search, weather, get_time, get_date, get_day, get_month, joke, quote, advice, math, translation, definition, synonym, antonym, spell_check, grammar_check, currency_conversion, unit_conversion, reminder, alarm, timer, calendar_event, contact_lookup, email_management, task_management, note_taking, calculator_open).
- "userInput": the original user sentence with your name removed if it appears.
- "response": a short, voice-friendly line like "Sure, playing it now", "Here’s what I found", "It’s Tuesday", etc.
Hindi rule: Agar koi puche "tumhe kisne banaya?", to "sumit" ka naam use karo: "{sumit}".
If user asks for Google/YouTube/Wikipedia/News search, keep only the search text in userInput.
`;

    const jsonSchema = {
      type: "object",
      properties: {
        type: {
          type: "string",
          enum: [
            "general", "google_search", "youtube_search", "youtube_play", "wikipedia_search",
            "instagram_open", "facebook_open", "news_search", "weather", "get_time", "get_date",
            "get_day", "get_month", "joke", "quote", "advice", "math", "translation", "definition",
            "synonym", "antonym", "spell_check", "grammar_check", "currency_conversion",
            "unit_conversion", "reminder", "alarm", "timer", "calendar_event", "contact_lookup",
            "email_management", "task_management", "note_taking", "calculator_open"
          ]
        },
        userInput: { type: "string" },
        response: { type: "string" }
      },
      required: ["type", "userInput", "response"],
      additionalProperties: false
    };

    const payload = {
      contents: [
        {
          role: "user",
          parts: [{ text: `${systemPrompt}\n\nnow your userInput is - ${strippedInput}` }]
        }
      ],
      generationConfig: {
        response_mime_type: "application/json",
        response_json_schema: jsonSchema
      }
    };

    const result = await axios.post(apiUrl, payload, {
      headers: { "Content-Type": "application/json" }
      // Alternatively, you can send the API key as a header:
      // headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey }
    });

    const text = result?.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    // Hard parse with a fallback extractor
    try {
      return JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      return match ? JSON.parse(match[0]) : {
        type: "general",
        userInput: strippedInput,
        response: "Sorry, I couldn’t process that."
      };
    }
  } catch (error) {
    console.error(error);
    return {
      type: "general",
      userInput: command,
      response: "There was a problem reaching the assistant."
    };
  }
};

export default geminiResponse;
