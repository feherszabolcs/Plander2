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

        hubConnection.start()
            .then(async () => {
                setStatus("connected");
                await hubConnection.invoke("JoinRoom", roomName);
            })
            .catch((error) => {
                console.error("SignalR connection error:", error);
                setStatus("disconnected");
            });

        setConnection(hubConnection);

        return () => {
            hubConnection.stop();
        };
    }, [token, roomName]);

    useEffect(() => {
        if (!connection) return;

        connection.on("ReceiveRoomMessage", (payload: any) => {
            setMessages((prev) => [...prev, {
                room: payload.room,
                sender: payload.sender,
                message: payload.message,
                sentAt: payload.sentAt
            }]);
        });

        connection.on("RoomUserJoined", (_room: string, userName: string) => {
            setMessages((prev) => [...prev, {
                room: _room,
                sender: "system",
                message: `${userName} belépett a csoportba.`,
                sentAt: new Date().toISOString()
            }]);
        });

        connection.on("RoomUserLeft", (_room: string, userName: string) => {
            setMessages((prev) => [...prev, {
                room: _room,
                sender: "system",
                message: `${userName} kilépett.`,
                sentAt: new Date().toISOString()
            }]);
        });

        return () => {
            connection.off("ReceiveRoomMessage");
            connection.off("RoomUserJoined");
            connection.off("RoomUserLeft");
        };
    }, [connection]);

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