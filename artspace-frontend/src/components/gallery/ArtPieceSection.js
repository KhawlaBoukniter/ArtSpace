import { ChevronRightIcon, EyeIcon } from "lucide-react";
import React, { useState } from "react";
import Button from "../ui/button";
import { Card, CardContent } from "../ui/card";
import FadeIn from "../ui/FadeIn";

const ArtPieceSection = ({ artworks }) => {
    const [visibleCount, setVisibleCount] = useState(6);

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + 3);
    };

    const visibleArtworks = artworks.slice(0, visibleCount);

    const imageUrl = (image) => {
        return image.startsWith("http")
            ? image
            : `http://localhost:8000${image}`;
    };

    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;

    return (
        <section className="py-16 flex flex-col items-center mx-8">
            <div className="w-full max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {visibleArtworks.map((artwork, i) => {
                        const artistId = artwork.artist?.user?.id;
                        const isOwner = artistId === userId;

                        console.log(`--- Œuvre ID: ${artwork.id} ---`);
                        console.log("user connecté :", userId);
                        console.log("artiste de l'œuvre :", artistId);
                        console.log("est propriétaire ?", isOwner);

                        return (
                            <FadeIn delay={0.2 * i} key={artwork.id}>
                                <Card className="rounded-lg overflow-hidden border-0 shadow-none group transform transition duration-300 hover:scale-105 hover:shadow-[0px_15px_20px_#00000030]">
                                    <CardContent className="p-0 relative">
                                        <div
                                            className="h-96 bg-cover bg-center transition-transform duration-300"
                                            style={{ backgroundImage: `url(${imageUrl(artwork.image)})` }}
                                        />

                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="absolute bottom-0 w-full px-6 py-5">
                                                <a href={`/artworks/${artwork.id}`}>
                                                    <h3 className="text-white text-xl font-garamond hover:underline">
                                                        {artwork.title}
                                                    </h3>
                                                </a>
                                                <p className="text-gray-300 text-sm font-garamond">
                                                    {artwork.artist?.user?.name || "Artiste inconnu"}
                                                </p>
                                                <div className="flex items-center justify-between mt-4">
                                                    <span className="text-white text-xl font-garamond">
                                                        {artwork.price || "—"} €
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        <a href={`/artworks/${artwork.id}`}>
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                className="w-full h-8 justify-items-center rounded-full bg-white/20 hover:bg-white/30"
                                                            >
                                                                <EyeIcon className="w-4 h-4 text-white" />
                                                            </Button>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </FadeIn>
                        )
                    })}
                </div>
            </div>

            {visibleCount < artworks.length && (
                <Button
                    variant="outline"
                    onClick={handleLoadMore}
                    className="mt-16 h-12 rounded-full bg-[#fff5d8] hover:bg-[#d3bb7560] border-0 text-[#020000] font-garamond transform transition duration-300 hover:scale-105 hover:shadow-[0_0_2rem_#00000030]"
                >
                    Charger Plus
                    <ChevronRightIcon className="ml-2 h-5 w-5" />
                </Button>
            )}
        </section>
    );
};

export default ArtPieceSection;