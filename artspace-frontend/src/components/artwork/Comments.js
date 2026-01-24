import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { TrashIcon } from "lucide-react";
import Toast from "../ui/toast";
import api from "../../api";

export default function Comments({ artworkId }) {
    const [toast, setToast] = useState(null);
    const [comments, setComments] = useState([]);

    const userId = JSON.parse(localStorage.getItem("user_id"));

    // eslint-disable-next-line no-unused-vars
    const imageUrl = (image) => {
        if (!image) return "/default-avatar.png";
        return `http://localhost:8000/storage/${image}`;
    };

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await api.get(`/artworks/${artworkId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setComments(res.data.comments?.data || []);
            } catch (error) {
                console.error("Erreur lors du chargement des commentaires :", error);
            }
        };

        fetchComments();
    }, [artworkId]);

    const handleDelete = async (id) => {
        // eslint-disable-next-line no-restricted-globals
        if (!confirm("Voulez-vous vraiment supprimer ce commentaire ?")) return;

        try {
            const token = localStorage.getItem("token");
            await api.delete(`/comments/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setComments((prev) => prev.filter((c) => c.id !== id));
            setToast({ message: "Commentaire supprimé avec succès", type: "success" });
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
            setToast({ message: "Erreur lors de la suppression", type: "error" });
        }
    };

    return (
        <Card className="rounded-2xl shadow-md">
            <CardHeader className="px-8">
                <CardTitle className="text-2xl font-playfair text-gray-800">Commentaires</CardTitle>
            </CardHeader>

            <CardContent className="p-8 space-y-4 max-h-[350px] overflow-y-auto">
                {comments.length === 0 ? (
                    <p className="text-gray-500 font-playfair">Aucun commentaire pour cette œuvre.</p>
                ) : (
                    comments.map((comment) => (
                        <div
                            key={comment.id}
                            className="flex items-start gap-4 bg-gray-100 rounded-lg p-4 hover:shadow transition justify-between"
                        >
                            <div className="flex gap-4">
                                <div>
                                    <h4 className="font-playfair text-lg text-gray-800">
                                        {comment.user?.name || "Utilisateur"}
                                    </h4>
                                    <p className="text-gray-600 mt-1 font-playfair">{comment.content}</p>
                                </div>
                            </div>

                            {(comment.user_id === userId || comment.is_artist_owner) && (
                                <button
                                    onClick={() => handleDelete(comment.id)}
                                    className="text-gray-400 hover:text-red-500 transition"
                                    title="Supprimer"
                                >
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            )}
                        </div>
                    ))
                )}
            </CardContent>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </Card>
    );
}