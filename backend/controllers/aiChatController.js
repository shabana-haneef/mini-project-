const generateChatResponse = async (req, res) => {
    try {
        const { message, history } = req.body;
        const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyAJa7yNG1oSNg40C3us5DT5MuGU33KznCk';

        if (!apiKey) {
            return res.status(500).json({ error: "Gemini API key is not configured." });
        }

        const systemInstruction = `You are 'Campus AI', a friendly and highly knowledgeable assistant for a university platform. 
The platform consists of three main areas:
1. Student Portal: Students can browse clubs, register for peer teaching sessions, and access academic resources.
2. Mentor Portal: Verified mentors upload academic materials (videos, notes, PDFs) and track analytics.
3. Club Admin Portal: Club coordinators create and manage campus events and approve members.

Your goal is to answer questions, guide users, and provide helpful advice related to campus life, academics, and using this portal. Keep your answers extremely concise, friendly, and formatted in markdown. Use emojis sparingly. If a user asks a general question, try to relate it back to academic success or campus involvement.`;

        const formattedHistory = [];

        if (history && history.length > 0) {
            history.forEach(msg => {
                const role = msg.sender === 'user' ? 'user' : 'model';
                // If it is bot's first initial greeting, ignore it or format as 'model'.
                // If the user's history object sends the generic "Hi there", map it properly.
                formattedHistory.push({
                    role: role,
                    parts: [{ text: msg.text }]
                });
            });
        }

        // Current message
        formattedHistory.push({
            role: 'user',
            parts: [{ text: message }]
        });

        // Gemini API strictly requires alternating history (user, model, user, model...).
        // A single consecutive role will throw HTTP 400.
        // We iterate and collapse consecutive messages of the same role.
        const collapsedHistory = [];
        let lastRole = null;
        for (const msg of formattedHistory) {
            if (msg.role !== lastRole) {
                // Must clone deeply
                collapsedHistory.push({
                    role: msg.role,
                    parts: [{ text: msg.parts[0].text }]
                });
                lastRole = msg.role;
            } else {
                // Same role: Append text with newline to previous part
                collapsedHistory[collapsedHistory.length - 1].parts[0].text += '\n\n' + msg.parts[0].text;
            }
        }

        // Construct Request Payload (Gemini 1.5 system_instruction format)
        const requestBody = {
            system_instruction: {
                parts: [{ text: systemInstruction }]
            },
            contents: collapsedHistory,
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 500,
            }
        };

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const apiResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!apiResponse.ok) {
            const errorText = await apiResponse.text();
            throw new Error(`Gemini API Error: ${apiResponse.status} ${errorText}`);
        }

        const data = await apiResponse.json();
        const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't process that right now.";

        res.status(200).json({ reply: replyText });
    } catch (error) {
        console.error("AI Chatbot Error:", error.message || error);
        try {
            const fs = require('fs');
            const path = require('path');
            fs.appendFileSync(path.join(__dirname, '../debug_error.log'), `CHAT ERROR: ${error.message || error}\n`);
        } catch (e) { }
        res.status(500).json({ error: "Failed to communicate with AI Assistant." });
    }
};

module.exports = { generateChatResponse };
