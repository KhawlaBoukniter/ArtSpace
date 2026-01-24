import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import Button from "../components/ui/button";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function TicketReservation() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [ticket, setTicket] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await api.get(`/tickets/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setTicket(res.data.ticket);
                setLoading(false);
            } catch (err) {
                console.error("Erreur lors de la récupération du ticket", err);
                setLoading(false);
            }
        };
        fetchTicket();
    }, [id]);

    const handleReserve = async () => {
        try {
            setProcessing(true);
            setError(null);
            const token = localStorage.getItem("token");

            if (quantity < 1) {
                setError("La quantité doit être au moins 1");
                setProcessing(false);
                return;
            }

            console.log("Envoi de la réservation:", { ticket_id: parseInt(id), quantity });

            const reservationRes = await api.post(
                "/reservations",
                {
                    ticket_id: ticket.id,
                    quantity: quantity,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("Réponse réservation:", reservationRes.data);


            if (!reservationRes.data.reservation || !reservationRes.data.reservation.id) {
                throw new Error("ID de réservation non reçu");
            }


            const reservationId = +reservationRes.data.reservation.id;
            console.log("Redirection vers le paiement pour la réservation:", reservationId);

            if (isNaN(reservationId) || reservationId <= 0) {
                throw new Error("ID de réservation invalide");
            }

            const totalAmount = ticket.price * quantity;

            const checkoutRes = await api.post(
                `/checkout/${reservationId}`,
                {
                    amount: totalAmount,
                    currency: "€",
                    reservation_id: reservationId,
                    ticket_id: parseInt(id),
                    quantity: quantity,
                    return_url: `${window.location.origin}/payment-success`
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                }
            );

            console.log("Réponse checkout:", checkoutRes.data);

            if (checkoutRes.data.url) {
                window.location.href = checkoutRes.data.url;
            } else {
                setError("URL de paiement non reçue");
                setProcessing(false);
            }

        } catch (error) {
            console.error("Erreur lors de la réservation :", error);
            setError(error.response?.data?.message || "Une erreur s'est produite lors de la réservation");
            setProcessing(false);
        }
    };


    if (loading) return <p className="text-center mt-10">Chargement du ticket...</p>;
    if (!ticket) return <p className="text-center mt-10">Ticket introuvable.</p>;

    return (
        <div className="flex flex-col min-h-screen bg-[#f8f7f4]">
            <Navbar />
            <main className="flex-1 py-24 px-6 md:px-12 max-w-xl mx-auto">
                <h1 className="text-2xl mb-6 font-playfair text-center text-gray-800">Réserver un billet</h1>
                <div className="bg-white rounded-lg shadow p-6 space-y-4">
                    <p className="text-gray-800 font-playfair">
                        <strong>Type :</strong> {ticket.type}
                    </p>
                    <p className="text-gray-700 font-playfair">
                        <strong>Prix :</strong> {ticket.price} €
                    </p>
                    <label className="block text-sm font-medium text-gray-700 font-playfair mt-4">
                        Quantité :
                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        />
                    </label>

                    <Button
                        onClick={handleReserve}
                        className="w-full bg-[#3a6b8f] text-white"
                        disabled={processing}
                    >
                        {processing ? "Traitement en cours..." : "Réserver et payer"}
                    </Button>

                    {processing && (
                        <p className="text-blue-600 font-playfair mt-2 text-center">
                            Préparation du paiement, veuillez patienter...
                        </p>
                    )}

                    {error && (
                        <p className="text-red-500 font-playfair mt-4 text-center">
                            {error}
                        </p>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}