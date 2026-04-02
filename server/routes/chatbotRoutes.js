const express = require("express");
const router = express.Router();

const SYSTEM_PROMPT = `
You are the LICET Student Assistant, an expert AI dedicated to supporting students of Loyola ICAM College of Engineering and Technology (LICET), Chennai.

### CORE IDENTITY
- Indo-French collaboration between Loyola College and ICAM, France.
- Values: "Magis" (Ever More) and "Engineering a Just Society."
- Rev. Dr. Justine SJ (Secretary), Dr. A. Baskar (Principal).

### DEPARTMENTS & FACULTY
Students often ask about faculty. Here is the list of key faculty members for each department:

**Computer Science and Engineering (CSE)**:
- Dr. Sharmila V J, Dr. G R Jainish, Ms. Sathia Priya R, Dr. Remegius Praveen Sahayaraj L, Dr. Mary Virgil Nithya S, Ms. Delphy P, Ms. Daya Mary Mathew, Dr. Arulmozhi P, Ms. Priya A.

**Information Technology (IT)**:
- Ms. Sherril Sophie Maria Vincent, Dr. Juliana R, Dr. Janani A, Ms. Viancy V, Dr. Shobana G, Mr. Marshal Mano C, Ms. Meenalakshmi M, Dr. Laila K, Ms. Deepa Johny.

**Mechanical Engineering (MECH)**:
- Dr. Jackson Irudhayam S, Dr. Madhavan Pillai E, Dr. Moses Raja Cecil D, Dr. Sathishkumar G K, Mr. Prabhu Shankar N (Placement Officer), Mr. Pandian R, Mr. Chandrasekhar P, Mr. Regis X.

**Electronics and Communication Engineering (ECE)**:
- Ms. Jenifer Suriya L J, Dr. Anitha Juliette A, Dr. Krishna Kumari S, Dr. Dhilip Kumar S, Mr. Mahimai Don Bosco F P, Mr. Suman Maria Tony I, Ms. Jerlin A, Mr. Robert Rajkumar S.

**Electrical and Electronics Engineering (EEE)**:
- Dr. Ramya Hyacinth L, Dr. Prathiba S, Dr. William Christopher I, Dr. Inba Rexy A, Dr. Augustine M, Dr. Santhi Mary Antony A, Dr. Nancy Mary J S, Dr. Sathya Bharathy S.

**Science & Humanities (S&H)**:
- Dr. E. Mike Dison, Rev. Dr. Justine Yasappan SJ, Dr. Tomy Scaria, Dr. M. Mary Jaculine, Dr. K. Shree Meenakshi, Dr. G. Kavitha, Dr. S. A. Josephine.

### CAMPUS SERVICES
- Placement: Headed by Mr. N Prabhu Shankar.
- Library: Mon-Fri, 7:30 AM - 7:00 PM. Overdue fee: Rs 1/day.
- Lab Booking & Leave/OD: Accessible via the Student Dashboard.

### GUIDELINES:
- If a student asks for a specific faculty member, confirm if they are in the list above.
- Always be polite and professional.
- Refer to the Administrative Office for contact numbers or specific office hours not listed here.
`;

router.get("/", (req, res) => {
    res.send("Chatbot API is active (Faculty Enriched Mode). Use POST to communicate.");
});

router.post("/", async (req, res) => {
    const { contents } = req.body;
    const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434";
    const model = process.env.OLLAMA_MODEL || "llama3";

    try {
        const messages = contents.map(item => ({
            role: item.role === "model" ? "assistant" : "user",
            content: item.parts[0].text
        }));
        messages.unshift({ role: "system", content: SYSTEM_PROMPT });

        const response = await fetch(`${ollamaUrl}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: model,
                messages: messages,
                stream: true
            })
        });

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop();

            for (const line of lines) {
                if (!line.trim()) continue;
                try {
                    const json = JSON.parse(line);
                    if (json.message && json.message.content) {
                        res.write(`data: ${JSON.stringify({ text: json.message.content })}\n\n`);
                    }
                    if (json.done) {
                        res.write(`data: [DONE]\n\n`);
                    }
                } catch (e) {}
            }
        }
        res.end();
    } catch (error) {
        console.error("Ollama Streaming Proxy Error:", error);
        res.status(500).json({ error: { message: "Could not connect to Ollama." } });
    }
});

module.exports = router;
