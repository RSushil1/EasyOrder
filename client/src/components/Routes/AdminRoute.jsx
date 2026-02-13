import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { Outlet } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminRoute() {
    const [ok, setOk] = useState(false);
    const [auth, setAuth] = useState(useAuth());
    const navigate = useNavigate();

    useEffect(() => {
        const authCheck = async () => {
            const res = await axios.get("http://localhost:8000/api/auth/admin-auth");
            if (res.data.ok) {
                setOk(true);
            } else {
                setOk(false);
            }
        };
        if (auth?.token) authCheck();
    }, [auth?.token]);

    return ok ? <Outlet /> : <div className="text-center py-20 text-red-500 font-bold text-xl">Access Denied. Admins only.</div>;
}
