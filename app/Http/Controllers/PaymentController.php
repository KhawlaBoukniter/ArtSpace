<?php

namespace App\Http\Controllers;

use App\Helpers\ValidationHelper;
use App\Models\Reservation;
use App\Notifications\PaymentSuccessNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Stripe\Checkout\Session;
use Stripe\Stripe;

class PaymentController extends Controller
{
    public function checkout(Reservation $reservation)
    {
        ValidationHelper::ensureUserIsOwner($reservation->user_id, 'réservation');

        $ticket = $reservation->ticket;

        if ($ticket->type === 'free' || $ticket->price === null || $ticket->price == 0) {
            return response()->json(['message' => 'Ce ticket est gratuit, aucun paiement requis.'], 400);
        }

        $stripeSecret = config('services.stripe.secret');

        if (!$stripeSecret) {
            return response()->json(['message' => 'Erreur configuration : La clé secrète Stripe n\'est pas configurée.'], 500);
        }

        Stripe::setApiKey($stripeSecret);

        try {
            $session = Session::create([
                'payment_method_types' => ['card'],
                'line_items' => [[
                    'price_data' => [
                        'currency' => 'eur',
                        'unit_amount' => (int)($ticket->price * 100),
                        'product_data' => [
                            'name' => $ticket->event->title,
                        ],
                    ],
                    'quantity' => $reservation->quantity,
                ]],
                'mode' => 'payment',
                'success_url' => 'http://localhost:3000/user/reservations',
                'cancel_url' => 'http://localhost:3000/payment-cancel',
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erreur Stripe : ' . $e->getMessage()], 500);
        }

        $reservation->stripe_session_id = $session->id;
        $reservation->save();

        return response()->json([
            'url' => $session->url
        ]);
    }

    public function handleSuccess()
    {
        $sessionId = request('session_id');

        if (! $sessionId) {
            return response()->json(['message' => 'Session manquante.'], 400);
        }

        $reservation = Reservation::where('stripe_session_id', $sessionId)->first();

        if (! $reservation) {
            return response()->json(['message' => 'Réservation introuvable.'], 404);
        }

        if ($reservation->status !== 'paid') {
            $reservation->status = 'paid';

            $qrContent = route('ticket.verify', ['id' => $reservation->id]);
            $qrName = 'qr_codes/' . Str::uuid() . '.png';

            Storage::disk('public')->put($qrName, QrCode::format('png')->size(300)->generate($qrContent));

            $reservation->qr_code_path = $qrName;
            $reservation->save();

            $reservation->user->notify(new PaymentSuccessNotification($reservation));
        }

        return response()->json([
            'message' => 'Paiement réussie.',
            'reservation' => $reservation
        ]);
    }
}
