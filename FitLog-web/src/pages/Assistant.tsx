import React, { useState } from "react";
import { api } from "../api";

interface ChatMessage {
    role: "user" | "assistant";
    content: string;
}


    const [messages, setMessages] = useState<ChatMessage[]>([ ]);
    const [input, setInput] = useState("");

    async function sendMessage() {
        if (!input.trim()) return;

        const newMessages: ChatMessage[] = [...messages, { role: "user", content: input }];
        const apiKey = import.meta.env.VITE_OPENAI_KEY;
        setMessages(newMessages);
        setInput("");

        const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: newMessages

            }),

        });

        const data = await res.json();
        const aiReply = data.choices[0].message.content;
        setMessages([...newMessages, { role: "assistant", content: aiReply }]);
    }
return (<div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
<h1 className="text-3xl mb-4 font-bold">AI assistant</h1>
</div>
<div className="h-96 overflow-y-auto border p-3 rounded bg-gray-50 mb-4 space-y-3">{messages.map((m,i)=>(
<div key={i} className={m.role === "user" ? "text-right" : "text-left" }>
${m.role === "user" ? "bg-blue-200": "bg-green-200" }
))}</div>
)
}