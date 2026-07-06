import { useEffect, useMemo, useState } from "react";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

interface ChatMessage {
    room: string;
    sender: string;
    message: string;
    sentAt: string;
}

export function useAssociationChat(token: string | null, associationId: number | null) {
    const [connection, setConnection] = useState<any>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [status, setStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected");

    const roomName = useMemo(() => associationId ? `association-${associationId}` : null, [associationId]);

    useEffect(() => {
        if (!token || !roomName) return;

        setStatus("connecting");

        const hubConnection = new HubConnectionBuilder()
            .withUrl("http://localhost:5148/chat", {
                accessTokenFactory: () => token,
                withCredentials: true,
            })
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();

        const setupHandlers = () => {
            hubConnection.on("ReceiveRoomMessageHistory", (history: any[]) => {
                const loadedMessages = history.map((item) => ({
                    room: item.roomName ?? item.room ?? roomName,
                    sender: item.senderName ?? item.sender,
                    message: item.message,
                    sentAt: item.sentAt
                }));
                setMessages(loadedMessages);
            });

            hubConnection.on("ReceiveRoomMessage", (payload: any) => {
                setMessages((prev) => [
                    ...prev,
                    {
                        room: payload.room,
                        sender: payload.sender,
                        message: payload.message,
                        sentAt: payload.sentAt
                    }
                ]);
            });
        };

        setupHandlers();

        hubConnection.start()
            .then(async () => {
                setStatus("connected");
                await hubConnection.invoke("JoinRoom", roomName);
                await hubConnection.invoke("GetRoomChatHistory", roomName, 50);
            })
            .catch((error) => {
                console.error("SignalR connection error:", error);
                setStatus("disconnected");
            });

        setConnection(hubConnection);

        return () => {
            hubConnection.off("ReceiveRoomMessageHistory");
            hubConnection.off("ReceiveRoomMessage");
            hubConnection.stop().catch(() => { });
        };
    }, [token, roomName]);

    const sendMessage = async (message: string) => {
        if (!connection || status !== "connected" || !roomName) return;
        await connection.invoke("SendRoomMessage", roomName, message);
    };

    return {
        status,
        messages,
        sendMessage
    };
}