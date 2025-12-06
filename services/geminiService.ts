import { GoogleGenAI } from "@google/genai";
import { RefineMode } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `You are an expert executive email assistant. 
CRITICAL OUTPUT RULES:
1. Always return the email body as HTML content.
2. Do NOT use markdown code blocks (like \`\`\`html). Return raw HTML strings.
3. Use <p> tags for paragraphs.
4. Use <br> for line breaks.
5. For tables, strictly use HTML <table> with inline CSS styles to ensure compatibility when pasted into Outlook or Word.
   - Table style: border-collapse: collapse; width: 100%; font-family: sans-serif; font-size: 14px;
   - Header style: background-color: #dce6f1; border: 1px solid #8e8e8e; padding: 8px; text-align: left; font-weight: bold; color: #1f497d;
   - Cell style: border: 1px solid #8e8e8e; padding: 8px; color: #333;
`;

const PROMPTS: Record<RefineMode, string> = {
  [RefineMode.PROOFREAD_EN]: "Proofread the following email text for standard English. Return the result as clean HTML <p> paragraphs. Correct grammar, spelling, and improve flow.",
  [RefineMode.TRANSLATE_EN]: "Translate the following text into professional business English. Return the result as clean HTML <p> paragraphs. Ensure the tone is corporate.",
  [RefineMode.TABLE_FORMAT]: "Analyze the text. If it contains data/lists, convert them into an HTML table using the specific inline styles defined in the system instructions (Light blue headers #dce6f1, borders). Keep surrounding text as HTML <p> paragraphs.",
  [RefineMode.PROOFREAD_PT]: "Proofread the following email text for Portuguese (Brazil). Return the result as clean HTML <p> paragraphs. Maintain formal business tone.",
  [RefineMode.SUMMARIZE]: "Rewrite the email as an Executive Brief. Use an HTML <ul> list for bullet points and <b> tags for emphasis. Return valid HTML."
};

export const processEmail = async (text: string, mode: RefineMode): Promise<string> => {
  if (!text.trim()) return "";

  try {
    const specificPrompt = PROMPTS[mode];
    const fullPrompt = `${specificPrompt}\n\n---\nInput Text:\n${text}\n---`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.3,
      },
    });

    // Strip potential markdown wrapping if the model ignores instructions
    let cleanText = response.text || "";
    cleanText = cleanText.replace(/```html/g, '').replace(/```/g, '');

    return cleanText;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to process email. Please try again.");
  }
};