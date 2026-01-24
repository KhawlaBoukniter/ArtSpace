import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Button from "../ui/button";
import { EyeIcon } from "lucide-react";
import api from "../../api";

export default function FavoriteArtworks({ user }) {

    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        if (!user) return;

        const fetchFavorites = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await api.get("/artworks/saved", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log("Saved artworks:", response.data);
                const artworksArray = response.data.saved_artworks?.data ?? [];
                setFavorites(artworksArray);

            } catch (error) {
                console.error("Erreur chargement favoris :", error);
                setFavorites([]);
            }
        };

        fetchFavorites();
    }, [user]);

    return (
        <Card className="rounded-2xl shadow-md">
            <CardHeader className="px-8 pb-0 flex flex-row justify-between items-center">
                <CardTitle className="text-2xl font-playfair text-gray-800">
                    Favorite Artworks
                </CardTitle>
                <a href="/user/artworks/saved" className="text-[#3a6b8f] font-playfair text-base hover:underline">
                    View All
                </a>
            </CardHeader>

            <CardContent className="p-8">
                {favorites.length === 0 ? (
                    <p className="text-center text-gray-500 font-playfair">Aucune œuvre sauvegardée.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {favorites.slice(0, 3).map((artwork) => (
                            <div
                                key={artwork.id}
                                className="relative h-64 rounded-lg overflow-hidden group"
                                style={{
                                    backgroundImage: `url(${artwork.image?.startsWith('http') ? artwork.image : `http://localhost:8000${artwork.image}`})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            >
                                <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <div className="p-4">
                                        <h4 className="text-white text-base font-semibold">
                                            {artwork.title}
                                        </h4>
                                        <p className="text-gray-300 text-sm mt-1">{artwork.artist?.name}</p>
                                    </div>

                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <a href={`/artworks/${artwork.id}`}>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="!bg-transparent text-gray-300 hover:text-white transform transition duration-300 hover:scale-105 border-none p-2"
                                            >
                                                <EyeIcon className="h-5 w-5" />
                                            </Button>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}