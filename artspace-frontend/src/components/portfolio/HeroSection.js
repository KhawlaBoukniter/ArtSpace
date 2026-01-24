import React from "react";
import Button from "../ui/button";

export default function HeroSection({ data }) {

    const { name, email, avatar, isOwner } = data;

    const imageUrl = (image) => {
        if (!image) return "/default-avatar.jpg";
        if (image.startsWith('http')) return image;
        return `http://localhost:8000/storage/${image}`;
    };

    console.log(data);


    return (
        <section className="w-full py-24 bg-white p-10">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-12 items-center">
                <div className="flex-1 space-y-6">
                    <h1 className="text-5xl font-normal font-playfair text-gray-900 leading-tight">
                        {data?.name}
                    </h1>

                    <div className="flex flex-wrap gap-4 pt-6">
                        <a href={`mailto:${data?.email}`}>
                            <Button className="h-12 px-8 rounded-full bg-[#3a6b8f] hover:bg-[#2c5270] font-playfair text-base font-normal">
                                Me contacter
                            </Button>
                        </a>

                        {isOwner && (
                            <div className="flex justify-center mt-4 gap-4">
                                <a href="#artworks">
                                    <Button
                                        variant="outline"
                                        className="h-12 px-8 rounded-full border-[#3a6b8f] text-[#3a6b8f] hover:bg-[#3a6b8f]/10 font-playfair text-base font-normal"
                                    >
                                        Voir mes œuvres
                                    </Button>
                                </a>

                                <a href="/artist/portfolio/edit">
                                    <Button
                                        variant="ghost"
                                        className="h-12 px-8 rounded-full border border-gray-300 hover:bg-gray-100 font-playfair text-base"
                                    >
                                        Modifier mon portfolio
                                    </Button>
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1">
                    <div
                        className="h-auto aspect-square w-full rounded-2xl bg-cover bg-center"
                        style={{ backgroundImage: `url(${imageUrl(data.avatar)})` }}
                    />
                </div>
            </div>
        </section>
    );
}