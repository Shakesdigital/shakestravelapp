<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'nullable|string|regex:/^[\+]?[1-9][\d]{0,15}$/',
            'agree_to_terms' => 'required|boolean|accepted',
            'agree_to_privacy' => 'required|boolean|accepted',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = User::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'phone' => $request->phone,
                'role' => 'guest',
                'verification' => [
                    'is_email_verified' => false,
                    'email_verification_token' => null,
                    'email_verification_expires' => null,
                ],
                'stats' => [
                    'total_trips_booked' => 0,
                    'total_accommodations_booked' => 0,
                    'total_reviews_written' => 0,
                    'profile_views' => 0,
                ],
            ]);

            // Send email verification
            $user->sendEmailVerificationNotification();

            // Create token
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Registration successful. Please verify your email address.',
                'data' => [
                    'user' => $user,
                    'token' => $token,
                    'token_type' => 'Bearer',
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Registration failed. Please try again.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
            'remember_me' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = User::where('email', $request->email)->first();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid credentials'
                ], 401);
            }

            // Check if account is locked
            if ($user->isAccountLocked) {
                return response()->json([
                    'success' => false,
                    'message' => 'Account is temporarily locked due to too many failed attempts'
                ], 423);
            }

            // Check if account is active
            if (!$user->is_active || $user->is_suspended) {
                return response()->json([
                    'success' => false,
                    'message' => 'Account is deactivated or suspended'
                ], 403);
            }

            // Verify password
            if (!Hash::check($request->password, $user->password)) {
                $user->incrementLoginAttempts();
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid credentials'
                ], 401);
            }

            // Reset login attempts and update login info
            $user->resetLoginAttempts();

            // Create token
            $tokenName = $request->remember_me ? 'long_lived_token' : 'auth_token';
            $token = $user->createToken($tokenName);

            if ($request->remember_me) {
                $token->accessToken->expires_at = now()->addDays(30);
                $token->accessToken->save();
            }

            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'data' => [
                    'user' => $user->load('roles', 'permissions'),
                    'token' => $token->plainTextToken,
                    'token_type' => 'Bearer',
                    'expires_at' => $token->accessToken->expires_at,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Login failed. Please try again.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function logout(Request $request): JsonResponse
    {
        try {
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Logged out successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Logout failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function me(Request $request): JsonResponse
    {
        try {
            $user = $request->user()->load('roles', 'permissions');

            return response()->json([
                'success' => true,
                'data' => [
                    'user' => $user
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get user data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function refreshToken(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            
            // Delete current token
            $request->user()->currentAccessToken()->delete();
            
            // Create new token
            $token = $user->createToken('auth_token');

            return response()->json([
                'success' => true,
                'data' => [
                    'token' => $token->plainTextToken,
                    'token_type' => 'Bearer',
                    'expires_at' => $token->accessToken->expires_at,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Token refresh failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'sometimes|string|max:50',
            'last_name' => 'sometimes|string|max:50',
            'phone' => 'sometimes|nullable|string|regex:/^[\+]?[1-9][\d]{0,15}$/',
            'profile.bio' => 'sometimes|nullable|string|max:500',
            'profile.nationality' => 'sometimes|nullable|string|max:50',
            'profile.languages' => 'sometimes|array',
            'profile.languages.*' => 'string|max:30',
            'preferences.currency' => 'sometimes|in:USD,UGX,EUR,GBP',
            'preferences.language' => 'sometimes|in:en,sw,lg',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = $request->user();
            $data = $request->only(['first_name', 'last_name', 'phone']);
            
            if ($request->has('profile')) {
                $profile = array_merge($user->profile ?? [], $request->profile);
                $data['profile'] = $profile;
            }
            
            if ($request->has('preferences')) {
                $preferences = array_merge($user->preferences ?? [], $request->preferences);
                $data['preferences'] = $preferences;
            }

            $user->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'data' => ['user' => $user->fresh()]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Profile update failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}