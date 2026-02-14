import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { toast } from "react-hot-toast";
import { useAuth } from "./auth";

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [auth] = useAuth();

    useEffect(() => {
        const newSocket = io("http://localhost:8000", {
            query: {
                userId: auth?.user?._id
            }
        });
        setSocket(newSocket);

        // Clean up socket connection on unmount
        return () => newSocket.close();
    }, [auth?.user?._id]);

    useEffect(() => {
        if (!socket) return;

        // Listener for order status updates (User specific)
        socket.on("order-status-updated", (data) => {
            console.log("Socket Event: order-status-updated", data);
            if (auth?.user) {
                toast(data.message, {
                    icon: "📦",
                    duration: 5000,
                });
            }
        });

        // Listener for new products (Admin specific ideally, but maybe users too?)
        // Requirement: "user got notification on his order ... and admin create new product"
        // It implies users might want to know about new products too? Or admins want to know?
        // Let's notify everyone about new products.
        socket.on("product-created", (data) => {
            toast(data.message, {
                icon: "🆕",
                duration: 5000,
            });
        });

        socket.on("product-updated", (data) => {
            // Only admins usually care about this, or maybe users if stock was low.
            // Let's show to active admins.
            if (auth?.user?.role === 1) {
                toast(data.message, {
                    icon: "📝",
                    duration: 4000,
                });
            }
        });

        return () => {
            socket.off("order-status-updated");
            socket.off("product-created");
            socket.off("product-updated");
        };
    }, [socket, auth]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
