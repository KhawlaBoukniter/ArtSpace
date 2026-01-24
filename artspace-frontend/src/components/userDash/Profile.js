import React from "react";
import { MailIcon, LogOutIcon } from "lucide-react";
import { Avatar, AvatarImage } from "../ui/avatar";
import Button from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { useNavigate } from "react-router-dom";

export default function Profile({ user }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("user_id");
        navigate("/");
    };

    const imageUrl = (image) => {
        if (!image) return "/default-avatar.png";
        if (image.startsWith('http')) return image;
        return `http://localhost:8000/storage/${image}`;
    };


    return (
        <Card className="w-full rounded-2xl shadow-md">
            <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    <div className="relative">
                        <Avatar className="h-28 w-28 md:h-32 md:w-32 border-4 border-white shadow-md">
                            <AvatarImage src={imageUrl(user?.avatar)} alt="Profile" />
                        </Avatar>
                        <div className="absolute bottom-0 right-0 w-7 h-7 bg-[#3a6b8f] rounded-full flex items-center justify-center shadow-md">
                            <img
                                src="https://c.animaapp.com/m9y8ql4xx8o8m6/img/frame-4.svg"
                                alt="edit"
                                className="w-4 h-4"
                            />
                        </div>
                    </div>

                    <div className="flex-1 w-full">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h2 className="text-2xl font-playfair text-gray-800">{user.name}</h2>
                                <p className="text-gray-500 font-playfair mt-2">Rôle : {user.role_id === 2 ? "Artiste" : user.role_id === 3 ? "Visiteur" : "Admin"}</p>

                                <div className="mt-4 flex md:flex-col flex-row gap-4 text-gray-600 font-playfair">
                                    <div className="flex items-center gap-2">
                                        <MailIcon className="h-4 w-4" />
                                        <span>{user.email}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button variant="outline" onClick={handleLogout} className="h-10 bg-red-50 text-red-600 rounded-lg">
                                    <LogOutIcon className="w-4 h-4 mr-2 md:mr-0" />
                                    <span className="">Déconnexion</span>
                                </Button>

                                <a href="/user/reservations">
                                    <Button className="bg-[#3a6b8f] text-white hover:bg-[#2c5270]">
                                        Mes réservations
                                    </Button>
                                </a>

                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}