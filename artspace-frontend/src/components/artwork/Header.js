import React, { useState } from "react";
import { HeartIcon, BookmarkIcon } from "lucide-react";
import Button from "../ui/button";
import { Card, CardContent } from "../ui/card";
import api from "../../api";

export default function Header({ artwork, isSaved, isLiked, canEdit, canDelete, isPurchased }) {

    const [likes, setLikes] = useState(artwork.likes_count || 0);
    const [liked, setLiked] = useState(isLiked);
    const [saved, setSaved] = useState(isSaved);

    const toggleLike = async () => {
        try {
            await api.post(`/artworks/${artwork.id}/like`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            setLiked(!liked);
            setLikes((prev) => prev + (liked ? -1 : 1));
        } catch (error) {
            console.error("Erreur like:", error);
        }
    };

    const toggleSave = async () => {
        try {
            await api.post(`/artworks/${artwork.id}/save`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            setSaved(!saved);
        } catch (error) {
            console.error("Erreur save:", error);
        }
    };

    const imageUrl = (image) => {
        return image.startsWith("http")
            ? image
            : `http://localhost:8000${image}`;
    };

    const handleDelete = async () => {
        const confirm = window.confirm("Voulez-vous vraiment supprimer cette œuvre ?");
        if (!confirm) return;

        try {
            await api.delete(`/artworks/${artwork.id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            window.location.href = "/artist/artworks";
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
        }
    };

    return (
        <Card className="rounded-2xl shadow-md">
            <CardContent className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/2 h-64 md:h-96 overflow-hidden rounded-lg">
                    <img
                        src={imageUrl(artwork.image)}
                        alt={artwork.title}
                        className="w-full h-full object-cover rounded-lg"
                    />
                </div>

                <div className="flex flex-col justify-between flex-1">
                    <div className="space-y-4">
                        <h1 className="text-3xl font-playfair text-gray-800">{artwork.title}</h1>
                        <h2 className="text-lg font-playfair text-gray-500">by {artwork.artist?.user?.name}</h2>

                        {!canEdit && (
                            <div className="flex items-center gap-6 mt-4">
                                <button
                                    onClick={toggleLike}
                                    className={`flex items-center gap-2 font-playfair transition-colors ${liked ? "text-[#e63946]" : "text-gray-600 hover:text-[#e63946]"}`}
                                >
                                    <HeartIcon className="h-5 w-5" />
                                    <span>{likes}</span>
                                </button>
                                <button
                                    onClick={toggleSave}
                                    className={`flex items-center gap-2 font-playfair transition-colors ${saved ? "text-[#f4a261]" : "text-gray-600 hover:text-[#f4a261]"}`}
                                >
                                    <BookmarkIcon className="h-5 w-5" />
                                    <span>{saved ? "Enregistrée" : "Enregistrer"}</span>
                                </button>
                            </div>
                        )}


                        <div className="mt-6">
                            <p className="text-2xl font-playfair text-[#3a6b8f]">{artwork.price}</p>
                        </div>
                    </div>

                    {canEdit && (
                        <div className="flex gap-4 mt-6">
                            <a href={`/artworks/edit/${artwork.id}`}>
                                <Button className="bg-[#3a6b8f] hover:bg-[#345c78] text-white rounded-lg font-playfair px-6 py-2 text-base transition">
                                    Modifier
                                </Button>
                            </a>
                            {canDelete && (
                                <Button
                                    variant="destructive"
                                    className="rounded-lg font-playfair px-6 py-2 text-base transition"
                                    onClick={handleDelete}
                                >
                                    Supprimer
                                </Button>
                            )}
                        </div>
                    )}

                </div>
            </CardContent>
        </Card >
    );
}