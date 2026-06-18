import { useAuth } from "@/context/AuthContext";
import { useAssociationChat } from "@/hooks/useAssociationChat";
import { useState } from "react";


function ChatRoom() {
    const { token, user, isLoading } = useAuth();
    const [draft, setDraft] = useState("");
    const associationId = user?.association?.id ?? null;
    const { status, messages, sendMessage } = useAssociationChat(token, associationId);

    const handleSend = async () => {
        if (!draft.trim()) return;
        await sendMessage(draft.trim());
        setDraft("");
    };

    if (!associationId) {
        return <div>Betöltés...</div>;
    } else
        return (
            <div>
                <h2>Chat egyesület: {user?.association.name ?? "nincs kiválasztva"}</h2>
                <div>Kapcsolat: {status}</div>

                <div style={{ height: 300, overflowY: "auto", border: "1px solid #ccc", padding: 10 }}>
                    {messages.map((msg, idx) => (
                        <div key={idx}>
                            <strong>{msg.sender}:</strong> {msg.message}
                            <div style={{ fontSize: 12, color: "#666" }}>{new Date(msg.sentAt).toLocaleTimeString()}</div>
                        </div>
                    ))}
                </div>

                <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Írd a üzeneted..."
                    style={{ width: "80%" }}
                />
                <button onClick={handleSend}>Küldés</button>
            </div>
        );
}
export default ChatRoom;