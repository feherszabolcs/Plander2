import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/context/AuthContext";
import { useAssociationChat } from "@/hooks/useAssociationChat";
import { Circle } from "lucide-react";
import { useEffect, useRef, useState } from "react";


function ChatRoom() {
    const { token, user, isLoading } = useAuth();
    const [draft, setDraft] = useState("");
    const associationId = user?.association?.id ?? null;
    const { status, messages, sendMessage } = useAssociationChat(token, associationId);

    const chatContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const container = chatContainerRef.current;
        if (container) {
            container.scrollIntoView(false);
        }
    }, [messages]);

    const handleSend = async () => {
        if (!draft.trim()) return;
        await sendMessage(draft.trim());
        setDraft("");
    };


    if (!associationId) {
        return <Spinner className="m-auto" />;
    } else
        return (
            <div className="flex flex-col h-full p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold mb-4">Csevegés itt: <span className="font-bold italic">{user?.association.name ?? "nincs kiválasztva"}</span></h1>
                    <div className="flex items-center gap-2" title={status == "connected" ? "Aktív" : (status == "disconnected" ? "Sikertelen csatlakozás" : "Csatlakozás folyamatban...")}>
                        Kapcsolat: <span>
                            <Circle fill={status == "connected" ? "green" : (status == "disconnected" ? "red" : "yellow")} stroke="none" />
                        </span>

                    </div>
                </div>

                <ScrollArea className=" max-h-96">
                    <div ref={chatContainerRef} className="flex flex-col gap-2 overflow-y-auto border p-2 rounded">
                        <ScrollBar />
                        {messages.map((msg, idx) => (
                            <div key={idx}>
                                <strong>{msg.sender}:</strong> {msg.message}
                                <div style={{ fontSize: 12, color: "#666" }}>{new Date(msg.sentAt).toLocaleTimeString()}</div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
                <div className="flex mt-2">
                    <input
                        className="flex-1 border rounded px-2 py-1 mr-2"
                        type="text"
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        placeholder="Írd a üzeneted..."
                    />
                    <Button className="" onClick={handleSend}>Küldés</Button>
                </div>
            </div>
        );
}
export default ChatRoom;