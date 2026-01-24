import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroSection from "../components/portfolio/HeroSection";
import About from "../components/portfolio/About";
import Timeline from "../components/portfolio/Timeline";
import Gallery from "../components/portfolio/Gallery";
import UpcomingEvents from "../components/portfolio/UpcomingEvents";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

export default function Portfolio() {
    const { id } = useParams();
    const [portfolio, setPortfolio] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        let isMounted = true;

        async function fetchPortfolio() {
            try {
                // const token = localStorage.getItem("token");

                // const artistId = user?.artist?.id;

                // if (!artistId) return;

                const res = await api.get(`/artist/${id}/portfolio`);

                if (isMounted) {
                    setPortfolio(res.data);
                    setLoading(false);
                }
            } catch (err) {
                console.log("Erreur: ", err);
                if (isMounted) {
                    setPortfolio(null);
                    setLoading(false);
                }
            }
        }
        fetchPortfolio();

        return () => {
            isMounted = false;
        };
    }, [id]);

    if (loading) return <div className="p-10 text-center text-gray-600">Chargement...</div>;
    if (!portfolio) return <div className="p-10 text-center text-red-500">Portfolio introuvable</div>;

    const isOwner = user?.artist?.id?.toString() === id;
    console.log(isOwner);


    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Navbar />

            <main className="flex-1 w-full">
                <HeroSection data={{
                    name: portfolio.user?.name || "Artiste inconnu",
                    email: portfolio.user?.email || "Email non défini",
                    avatar: portfolio.artist?.avatar || null,
                    isOwner: isOwner,
                }} />
                <About description={portfolio.artist.bio || "Biographie non disponible"} />
                <Timeline timelines={portfolio.timelines || []} />
                <Gallery artworks={portfolio.artworks || []} />
                <UpcomingEvents events={portfolio.events || []} />
            </main>

            <Footer />
        </div>
    );
}