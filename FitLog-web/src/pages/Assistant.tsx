import React, { useState } from "react";

interface ChatMessage {
    role: "user" | "assistant";
    content: string;
}

export default function Assistant() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");

    async function sendMessage() {
        if (!input.trim()) return;

        const newMessages: ChatMessage[] = [
            ...messages,
            { role: "user", content: input },
        ];

        const apiKey = import.meta.env.VITE_OPENAI_KEY;

        setMessages(newMessages);
        setInput("");

        const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${ apiKey }`,
            },
    body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: newMessages.map(m => ({
            role: m.role,
            content: m.content
        }))
    }),
        });

const data = await res.json();
const aiReply = data.choices[0].message.content;

setMessages([
    ...newMessages,
    { role: "assistant", content: aiReply },
]);
    }

function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") sendMessage();
}

return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
        <h1 className="text-3xl mb-4 font-bold">AI Assistant</h1>

        {/* CHAT WINDOW */}
        <div className="h-96 overflow-y-auto border p-3 rounded bg-gray-50 mb-4 space-y-3">
            {messages.map((m, i) => (
                <div
                    key={i}
                    className={
                        m.role === "user"
                            ? "text-right"
                            : "text-left"
                    }
                >
                    <span
                        className={`inline-block px-3 py-2 rounded-lg ${m.role === "user"
                                ? "bg-blue-200"
                                : "bg-green-200"
                            }`}
                    >
                        {m.content}
                    </span>
                </div>
            ))}
        </div>

        {/* INPUT */}
        <div className="flex gap-2">
            <input
                className="border p-2 rounded flex-1"
                placeholder="Ask something..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
            />

            <button
                onClick={sendMessage}
                className="bg-blue-600 text-white px-4 py-2 rounded"
            >
                Send
            </button>
        </div>
    </div>
);
}