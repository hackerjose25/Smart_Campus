/* =============================================
   LICET AI CHATBOT — LOGIC
   Integration with Google Gemini API
   ============================================= */

const API_URL = "/api/chatbot";


// State
let chatHistory = [];
let isOpen = false;

// DOM Elements
const chatbotToggler = document.getElementById('chatbot-toggler');
const chatbotContainer = document.getElementById('chatbot-container');
const chatbotMessages = document.getElementById('chatbot-messages');
const chatbotInput = document.getElementById('chatbot-input');
const chatbotSend = document.getElementById('chatbot-send');

// Functions
function toggleChat() {
    isOpen = !isOpen;
    chatbotContainer.classList.toggle('open', isOpen);
    chatbotToggler.classList.toggle('active', isOpen);

    if (isOpen) {
        chatbotInput.focus();
        if (chatbotMessages.children.length === 0) {
            addMessage("Hi! I'm your LICET Assistant. How can I help you today? 👋", 'bot');
        }
    }
}

function addMessage(text, role) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${role}`;

    // Convert markdown-like formatting to simple HTML
    const formattedText = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>')
        .replace(/^\* (.*)/gm, '• $1');

    msgDiv.innerHTML = formattedText;
    chatbotMessages.appendChild(msgDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

    // Add to history for context
    chatHistory.push({ role: role === 'bot' ? 'model' : 'user', parts: [{ text: text }] });
}

function showTyping() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
    chatbotMessages.appendChild(typingDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function removeTyping() {
    const typingDiv = document.getElementById('typing-indicator');
    if (typingDiv) typingDiv.remove();
}

async function handleSendMessage() {
    const text = chatbotInput.value.trim();
    if (!text) return;

    chatbotInput.value = '';
    chatbotInput.disabled = true;
    chatbotSend.disabled = true;

    addMessage(text, 'user');
    showTyping();

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: chatHistory })
        });

        removeTyping();

        // Create the bot message element early so we can write to it
        const botMsgDiv = document.createElement('div');
        botMsgDiv.className = 'chat-message bot';
        chatbotMessages.appendChild(botMsgDiv);

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullText = "";
        let buffer = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop();

            for (const line of lines) {
                if (!line.startsWith('data: ')) continue;
                const dataStr = line.replace('data: ', '').trim();
                
                if (dataStr === '[DONE]') break;
                
                try {
                    const json = JSON.parse(dataStr);
                    if (json.text) {
                        fullText += json.text;
                        botMsgDiv.innerHTML = fullText
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\n/g, '<br>')
                            .replace(/^\* (.*)/gm, '• $1');
                        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
                    }
                } catch (e) {}
            }
        }

        // Add to history once finished
        chatHistory.push({ role: 'model', parts: [{ text: fullText }] });

    } catch (error) {
        removeTyping();
        console.error('Fetch Error:', error);
        addMessage("Sorry, I can't reach the server. Please check your internet connection.", 'bot');
    }

    chatbotInput.disabled = false;
    chatbotSend.disabled = false;
    chatbotInput.focus();
}

// Remove the old getGeminiResponse since it's merged into handleSendMessage for streaming

// Event Listeners
chatbotToggler.addEventListener('click', toggleChat);

chatbotSend.addEventListener('click', handleSendMessage);

chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSendMessage();
});
