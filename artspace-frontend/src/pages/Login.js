import React, { useState, useEffect } from "react";
import AuthLayout from "../components/AuthLayout";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        try {
            const response = await api.post("/login", { email, password });

            const data = response.data;
            console.log(data);

            setSuccessMessage("Connexion réussie! Redirection...");

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            const roleId = data.user?.role_id;

            setTimeout(() => {
                if (roleId === 1) {
                    navigate('/admin-dash');
                } else if (roleId === 2) {
                    navigate('/artist-dash');
                } else {
                    navigate('/user-dash');
                }
            }, 2000);

        } catch (error) {
            console.error("Login Error Details:", { status: error.status, data: error.data, message: error.message });

            if (error.status === 403) {
                setErrorMessage(error.data?.message || "Accès refusé. Compte non validé.");
            } else if (error.status === 401) {
                setErrorMessage("Email ou mot de passe incorrect.");
            } else if (error.status === 422) {
                // Laravel validation error structure: { message: "...", errors: { field: ["msg"] } }
                const firstError = error.data?.errors
                    ? Object.values(error.data.errors)[0]?.[0]
                    : error.data?.message;
                setErrorMessage(firstError || "Données invalides. Veuillez vérifier votre saisie.");
            } else {
                setErrorMessage(error.data?.message || error.message || "Une erreur est survenue lors de la connexion.");
            }
        }
    };


    return (
        <AuthLayout
            title="Welcome to ArtSpace"
            subtitle="Your Gateway to Digital Art Excellence"
            activeTab="login"
        >
            <form className="space-y-6 pb-6" onSubmit={handleSubmit}>
                {errorMessage &&
                    <div className="text-red-400 font-playfair text-sm text-center mt-4">
                        {errorMessage}
                    </div>
                }
                {successMessage &&
                    <div className="text-green-400 font-playfair text-sm text-center mt-4">
                        {successMessage}
                    </div>
                }
                <div className="relative w-full">
                    <input
                        type="email"
                        placeholder="Adresse e-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-10 w-full rounded-lg pl-10 pr-4 bg-[#1f293780] border border-gray-700 text-[#adaebc] placeholder:text-[#adaebc] font-playfair text-sm"
                    />
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M2 3.5C1.725 3.5 1.5 3.725 1.5 4V4.69063L6.89062 9.11563C7.5375 9.64688 8.46562 9.64688 9.1125 9.11563L14.5 4.69063V4C14.5 3.725 14.275 3.5 14 3.5H2Z" fill="#9CA3AF" />
                        <path d="M1.5 6.63125V12C1.5 12.275 1.725 12.5 2 12.5H14C14.275 12.5 14.5 12.275 14.5 12V6.63125L10.0625 10.275C8.8625 11.2594 7.13438 11.2594 5.9375 10.275L1.5 6.63125Z" fill="#9CA3AF" />
                    </svg>
                </div>

                <div className="relative w-full">
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-10 w-full rounded-lg pl-10 pr-4 bg-[#1f293780] border border-gray-700 text-[#adaebc] placeholder:text-[#adaebc] font-playfair text-sm"
                    />
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="16" height="16" fill="none" viewBox="0 0 16 16">
                        <circle cx="8" cy="8" r="7" stroke="#9CA3AF" strokeWidth="2" />
                        <circle cx="8" cy="8" r="2" fill="#9CA3AF" />
                    </svg>
                </div>


                <button
                    type="submit"
                    className="w-full h-10 bg-[#3a6b8f] rounded-lg hover:bg-[#2f5b7b] font-garamond text-white text-base transition mt-8"
                >
                    Se connecter
                </button>

                <div className="text-center mt-4">
                    <span className="text-sm text-gray-400 font-playfair">
                        Pas encore de compte ?{" "}
                        <a href="/register" className="text-blue-400 hover:underline">
                            Créez-en un
                        </a>
                    </span>
                </div>

                <div className="flex items-center my-6">
                    <div className="flex-grow h-px bg-gray-600" />
                    <span className="px-3 text-sm text-gray-400 font-playfair">Ou continuer avec</span>
                    <div className="flex-grow h-px bg-gray-600" />
                </div>

                {/* Boutons sociaux */}
                <div className="flex justify-center gap-6">
                    <button
                        type="button"
                        className="flex items-center justify-center gap-2 w-[140px] h-[38px] rounded-md border border-gray-700 bg-transparent hover:bg-white/10 transition text-white"
                    >
                        <img
                            src="https://c.animaapp.com/m94tpkob79QlTu/img/frame-2.svg"
                            alt="Google icon"
                            className="w-[16px] h-[16px]"
                        />
                        <span className="font-playfair text-sm">Google</span>
                    </button>
                    <button
                        type="button"
                        className="flex items-center justify-center gap-2 w-[140px] h-[38px] rounded-md border border-gray-700 bg-transparent hover:bg-white/10 transition text-white"
                    >
                        <img
                            src="https://c.animaapp.com/m94tpkob79QlTu/img/frame-5.svg"
                            alt="Facebook icon"
                            className="w-[16px] h-[16px]"
                        />
                        <span className="font-playfair text-sm">Facebook</span>
                    </button>
                </div>
            </form>
        </AuthLayout>
    );
}