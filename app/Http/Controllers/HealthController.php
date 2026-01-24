<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class HealthController extends Controller
{
    /**
     * Health check endpoint
     * 
     * Returns API status and database connectivity
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $databaseStatus = 'disconnected';
        
        try {
            DB::connection()->getPdo();
            $databaseStatus = 'connected';
        } catch (\Exception $e) {
            // Log error but don't expose details in response
            \Log::error('Health check DB connection failed: ' . $e->getMessage());
        }

        return response()->json([
            'status' => 'ok',
            'database' => $databaseStatus,
            'timestamp' => now()->toIso8601String(),
        ], 200);
    }
}
