import { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        const data = localStorage.getItem("auth");
        if (data) {
            const parseData = JSON.parse(data);
            return {
                user: parseData.user,
                token: parseData.token,
            };
        }
        return {
            user: null,
            token: "",
        };
    });

    //default axios - update when auth changes
    axios.defaults.headers.common["Authorization"] = auth?.token;

    useEffect(() => {
        const data = localStorage.getItem("auth");
        if (data) {
            const parseData = JSON.parse(data);
            // Verify if state needs update or if lazy init covered it. 
            // Lazy init covers initial load. This effect is technically redundant for initial load.
            // But if we want to sync with LS changes (e.g. other tabs), usage of 'storage' event listener would be needed.
            // For now, removing the initial load effect is correct as lazy init does it.
        }
    }, []);
    return (
        <AuthContext.Provider value={[auth, setAuth]}>
            {children}
        </AuthContext.Provider>
    );
};

//custom hook
const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
