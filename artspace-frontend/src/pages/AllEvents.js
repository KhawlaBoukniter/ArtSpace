import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Card, CardContent } from "../components/ui/card";
import Button from "../components/ui/button";
import api from "../api";

export default function AllEvents() {
    const [allEvents, setAllEvents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await api.get(`/all-events?page=${currentPage}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setAllEvents(res.data.events);
            } catch (err) {
                console.error("Erreur lors du chargement des événements", err);
            }
        };

        fetchEvents();
    }, [currentPage]);

    const events = allEvents?.data || [];
    const totalPages = allEvents?.last_page || 1;
    console.log(events);



    return (
        <div className="flex flex-col min-h-screen bg-[#f8f7f4]">
            <Navbar />

            <main className="flex-1 w-full py-24 px-6 md:px-12">
                <div className="max-w-[1280px] mx-auto space-y-12">
                    <h1 className="text-4xl font-playfair text-gray-800 text-center">
                        Tous les événements
                    </h1>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map(event => (
                            <Card key={event.id} className="overflow-hidden rounded-xl shadow-md">
                                <div
                                    className="h-56 bg-cover bg-center"
                                    style={{ backgroundImage: `url(${event.poster?.startsWith('http') ? event.poster : `http://localhost:8000${event.poster}`})`, }}
                                />
                                <CardContent className="p-4">
                                    <h3 className="text-xl font-playfair text-gray-800 mb-1">{event.title}</h3>
                                    <p className="text-sm text-gray-600 font-playfair">{event.artist?.user?.name || "Artiste inconnu"}</p>
                                    <p className="text-sm text-gray-500 font-playfair mt-1">{event.location} – {event.start_date}</p>
                                    <a href={`/events/${event.id}`}>
                                        <Button
                                            variant="outline"
                                            className="mt-3  w-fit text-sm font-playfair bg-white border-gray-300 hover:bg-gray-100 text-gray-800"
                                        >
                                            Voir détails
                                        </Button>
                                    </a>
                                </CardContent>

                            </Card>
                        ))}
                    </div>

                    <div className="flex justify-center gap-4 mt-6">
                        <Button
                            variant="outline"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        >
                            Précédent
                        </Button>
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <Button
                                key={i}
                                variant={i + 1 === currentPage ? "default" : "outline"}
                                onClick={() => setCurrentPage(i + 1)}
                            >
                                {i + 1}
                            </Button>
                        ))}
                        <Button
                            variant="outline"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        >
                            Suivant
                        </Button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}