import { GoogleGenAI, Chat } from "@google/genai";

const SYSTEM_INSTRUCTION = `You are a calm, friendly, and supportive AI assistant. Your name is SereneMind. 
You are designed to help users find clarity, brainstorm ideas, and provide encouragement. 
Your tone is positive, empathetic, and soothing.
Keep your responses concise and helpful.`;

let ai: GoogleGenAI | null = null;
let chat: Chat | null = null;

const getAi = (): GoogleGenAI => {
    if (!ai) {
        if (!process.env.API_KEY) {
            throw new Error("API_KEY environment variable not set");
        }
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return ai;
}

export const getChat = (): Chat => {
    if (!chat) {
        const genAI = getAi();
        chat = genAI.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
            }
        });
    }
    return chat;
}