import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import api from "../../api";

export default function PurchaseHistory({ user }) {
    const [purchases, setPurchases] = useState([]);

    useEffect(() => {
        const fetchPurchases = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await api.get("/purchases", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log("🛒 Purchases:", res.data);
                setPurchases(res.data.purchases || []);
            } catch (error) {
                console.error("Erreur chargement achats :", error);
                setPurchases([]);
            }
        };

        if (user) {
            fetchPurchases();
        }
    }, [user]);

    return (
        <Card className="rounded-2xl shadow-md">
            <CardHeader className="px-8 pb-0 flex flex-row justify-between items-center">
                <CardTitle className="text-2xl font-playfair text-gray-800">
                    Historique des achats
                </CardTitle>
                <a href="/user/artworks/purchased" className="text-[#3a6b8f] font-playfair text-base hover:underline">
                    Voir tout
                </a>
            </CardHeader>

            <CardContent className="p-8 overflow-x-auto">
                {purchases.length === 0 ? (
                    <p className="text-center text-gray-500 font-playfair">Aucune œuvre achetée pour le moment.</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-gray-600 font-playfair">Œuvre</TableHead>
                                <TableHead className="text-gray-600 font-playfair">Artiste</TableHead>
                                <TableHead className="text-gray-600 font-playfair">Date</TableHead>
                                <TableHead className="text-right text-gray-600 font-playfair">Prix</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {purchases.slice(0, 3).map((purchase) => (
                                <TableRow key={purchase.id} className="hover:bg-gray-50">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-12 h-12 rounded bg-cover bg-center"
                                                style={{ backgroundImage: `url(${purchase.image})` }}
                                            />
                                            <a href={`/artworks/${purchase.id}`} className="font-playfair text-[#3a6b8f] hover:underline">
                                                {purchase.title}
                                            </a>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-playfair text-gray-600">
                                        {purchase.artist?.user?.name || "—"}
                                    </TableCell>
                                    <TableCell className="font-playfair text-gray-600">
                                        {purchase.pivot?.purchased_at?.slice(0, 10) || "—"}
                                    </TableCell>
                                    <TableCell className="text-right font-playfair text-gray-800">
                                        {purchase.pivot?.price} €
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}