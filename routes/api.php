<?php

use App\Http\Controllers\ArtistController;
use App\Http\Controllers\ArtistTimelineController;
use App\Http\Controllers\ArtworkController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\HealthController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\RoomArtworkController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\StatsController;
use App\Http\Controllers\TicketController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Health check endpoint
Route::get('/health', [HealthController::class, 'index']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::middleware('guest')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

Route::get('/events/{event}/tickets', [TicketController::class, 'getEventTickets']);
Route::get('/rooms/public', [RoomController::class, 'getPublicRooms']);

Route::get('/rooms/{id}', [RoomController::class, 'show']);

Route::get('/artist/{id}/portfolio', [ArtistController::class, 'showPortfolio']);

Route::get('/artworks', [ArtworkController::class, 'index']);

Route::get('/all-events', [EventController::class, 'index']);

Route::get('/artist/{id}/artworks', [ArtworkController::class, 'getByArtist']);

Route::get('/rooms/{room}/assigned-artworks', [RoomArtworkController::class, 'getAssignedArtworks']);

Route::middleware('auth:api')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::middleware('role:admin')->group(function () {
        Route::put('events/{event}/approve', [EventController::class, 'approve']);
        Route::put('events/{event}/reject', [EventController::class, 'reject']);

        Route::put('events/{event}/archive', [EventController::class, 'archive']);
        Route::put('events/{event}/restore', [EventController::class, 'restore']);

        Route::get('/stats/total-reservations', [StatsController::class, 'totalReservations']);

        Route::prefix('stats')->group(function () {
            Route::get('/events', [StatsController::class, 'totalEvents']);
            Route::get('/tickets-sold', [StatsController::class, 'globalTicketsSold']);
            Route::get('/revenue', [StatsController::class, 'globalRevenue']);
        });

        Route::get('/pending', [ArtistController::class, 'getPendingArtists']);
        Route::patch('/{id}/validate', [ArtistController::class, 'validateArtist']);
    });

    Route::middleware('role:artist')->group(function () {
        Route::post('/artworks', [ArtworkController::class, 'store']);
        Route::put('/artworks/{artwork}', [ArtworkController::class, 'update']);
        Route::delete('/artworks/{artwork}', [ArtworkController::class, 'destroy']);
        Route::get('/my-artworks', [ArtworkController::class, 'myArtworks']);
        Route::get('/my-stats', [ArtworkController::class, 'myStats']);
        Route::post('/my-profile', [ArtistController::class, 'updateProfile']);
        Route::post('/rooms/{room}/assign-artwork', [RoomArtworkController::class, 'assignArtwork']);

        Route::get('/my-events', [EventController::class, 'artistEvents']);
        Route::post('/events', [EventController::class, 'store']);
        Route::put('/events/{event}', [EventController::class, 'update']);
        Route::delete('/events/{event}', [EventController::class, 'destroy']);

        Route::post('/tickets', [TicketController::class, 'store']);
        Route::put('/tickets/{ticket}', [TicketController::class, 'update']);
        Route::delete('/tickets/{ticket}', [TicketController::class, 'destroy']);
        Route::get('/my-tickets', [TicketController::class, 'myTickets']);
        Route::get('/artist/reservations', [ReservationController::class, 'forArtist']);

        Route::get('/my-stats/tickets', [StatsController::class, 'totalTickets']);
        Route::get('/my-stats/revenue', [StatsController::class, 'totalRevenue']);
        Route::get('/my-stats/top-events', [StatsController::class, 'topEvents']);

        Route::get('/my-timelines', [ArtistTimelineController::class, 'index']);
        Route::post('/my-timelines', [ArtistTimelineController::class, 'store']);
        Route::put('/my-timelines/{timeline}', [ArtistTimelineController::class, 'update']);
        Route::delete('/my-timelines/{timeline}', [ArtistTimelineController::class, 'destroy']);

        Route::post('/rooms', [RoomController::class, 'store']);
    });

    Route::middleware('role:visitor')->group(function () {
        Route::get('/artworks/saved', [ArtworkController::class, 'getSavedArtworks']);
        Route::post('/artworks/{artwork}/save', [ArtworkController::class, 'toggleSave']);
        Route::post('/artworks/{artwork}/like', [ArtworkController::class, 'toggleLike']);

        Route::post('/reservations', [ReservationController::class, 'store']);
        Route::get('/my-reservations', [ReservationController::class, 'index']);
        Route::put('/reservations/{reservation}/pay', [ReservationController::class, 'pay']);
        Route::put('/reservations/{reservation}/cancel', [ReservationController::class, 'cancel']);
        Route::get('/reservations/{reservation}/status', [ReservationController::class, 'getAvailableActions']);
        Route::delete('/reservations/{reservation}', [ReservationController::class, 'destroy']);
        Route::get('/reservations/{reservation}/total', [ReservationController::class, 'getTotal']);

        Route::get('/purchases', [PurchaseController::class, 'index'])->middleware('auth:api');
    });
    Route::get('/tickets/{ticket}', [TicketController::class, 'show']);


    Route::get('/users/{user}/stats', [StatsController::class, 'userStats']);

    Route::get('/artworks/{artwork}', [ArtworkController::class, 'show']);
    Route::get('/artworks/{artwork}/comments', [CommentController::class, 'index']);

    Route::post('/comments', [CommentController::class, 'store']);
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);

    Route::post('/me/avatar', [AuthController::class, 'uploadAvatar']);

    Route::get('/events/{event}', [EventController::class, 'show']);

    Route::post('/checkout/{reservation}', [PaymentController::class, 'checkout']);
    Route::get('/checkout/success', [PaymentController::class, 'handleSuccess']);
});
