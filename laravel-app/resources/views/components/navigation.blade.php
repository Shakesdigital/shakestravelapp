<nav class="bg-white shadow-lg sticky top-0 z-50" x-data="{ mobileMenuOpen: false }">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
            <!-- Logo and primary navigation -->
            <div class="flex items-center">
                <!-- Logo -->
                <div class="flex-shrink-0">
                    <a href="{{ route('home') }}" class="flex items-center">
                        <img class="h-8 w-auto" src="{{ asset('images/logo.svg') }}" alt="ShakesTravel">
                        <span class="ml-2 text-xl font-bold text-gray-900">ShakesTravel</span>
                    </a>
                </div>

                <!-- Desktop Navigation -->
                <div class="hidden md:flex md:ml-10 md:space-x-8">
                    <a href="{{ route('trips.index') }}" 
                       class="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors
                              {{ request()->routeIs('trips.*') ? 'text-green-600 bg-green-50' : '' }}">
                        Adventures
                    </a>
                    
                    <a href="{{ route('accommodations.index') }}" 
                       class="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors
                              {{ request()->routeIs('accommodations.*') ? 'text-green-600 bg-green-50' : '' }}">
                        Accommodations
                    </a>

                    <!-- Dropdown for categories -->
                    <div class="relative" x-data="{ open: false }">
                        <button @click="open = !open" @click.away="open = false"
                                class="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors">
                            Categories
                            <svg class="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>
                        
                        <div x-show="open" x-transition:enter="transition ease-out duration-200"
                             x-transition:enter-start="transform opacity-0 scale-95"
                             x-transition:enter-end="transform opacity-100 scale-100"
                             x-transition:leave="transition ease-in duration-75"
                             x-transition:leave-start="transform opacity-100 scale-100"
                             x-transition:leave-end="transform opacity-0 scale-95"
                             class="absolute z-10 left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                            <div class="py-1" role="menu">
                                <a href="{{ route('trips.category', 'safari') }}" 
                                   class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    🦁 Safari Adventures
                                </a>
                                <a href="{{ route('trips.category', 'hiking') }}" 
                                   class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    🥾 Hiking & Trekking
                                </a>
                                <a href="{{ route('trips.category', 'cultural-tours') }}" 
                                   class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    🏛️ Cultural Tours
                                </a>
                                <a href="{{ route('trips.category', 'water-sports') }}" 
                                   class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    🚣 Water Sports
                                </a>
                                <a href="{{ route('trips.category', 'extreme-sports') }}" 
                                   class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    🪂 Extreme Sports
                                </a>
                            </div>
                        </div>
                    </div>

                    <a href="{{ route('travel-guide') }}" 
                       class="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                        Travel Guide
                    </a>
                </div>
            </div>

            <!-- Search -->
            <div class="hidden md:flex flex-1 justify-center px-2 lg:ml-6 lg:justify-end">
                <div class="max-w-lg w-full lg:max-w-xs">
                    <form action="{{ route('search') }}" method="GET" class="relative">
                        <input type="text" 
                               name="q" 
                               placeholder="Search adventures..."
                               value="{{ request('q') }}"
                               class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                    </form>
                </div>
            </div>

            <!-- User menu -->
            <div class="hidden md:flex md:items-center md:space-x-4">
                @auth
                    <!-- Notifications -->
                    <button class="text-gray-400 hover:text-gray-500 relative">
                        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-3.5-3.5a6.7 6.7 0 000-3.5L19 7h-5m0 0V4a3 3 0 00-6 0v3m6 0V7a3 3 0 00-6 0v3m0 0H4l3.5 3.5a6.7 6.7 0 000 3.5L4 17h5m0 0v3a3 3 0 006 0v-3"></path>
                        </svg>
                        @if(auth()->user()->unreadNotifications->count() > 0)
                            <span class="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                                {{ auth()->user()->unreadNotifications->count() }}
                            </span>
                        @endif
                    </button>

                    <!-- User dropdown -->
                    <div class="relative" x-data="{ open: false }">
                        <button @click="open = !open" @click.away="open = false"
                                class="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                            <img class="h-8 w-8 rounded-full" 
                                 src="{{ auth()->user()->avatar_url }}" 
                                 alt="{{ auth()->user()->full_name }}">
                            <span class="ml-2 text-gray-700 font-medium">{{ auth()->user()->first_name }}</span>
                        </button>
                        
                        <div x-show="open" x-transition:enter="transition ease-out duration-200"
                             x-transition:enter-start="transform opacity-0 scale-95"
                             x-transition:enter-end="transform opacity-100 scale-100"
                             x-transition:leave="transition ease-in duration-75"
                             x-transition:leave-start="transform opacity-100 scale-100"
                             x-transition:leave-end="transform opacity-0 scale-95"
                             class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                            <div class="py-1" role="menu">
                                <a href="{{ route('profile.show') }}" 
                                   class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    Profile
                                </a>
                                <a href="{{ route('profile.bookings') }}" 
                                   class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    My Bookings
                                </a>
                                <a href="{{ route('profile.wishlist') }}" 
                                   class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    Wishlist
                                </a>
                                
                                @if(auth()->user()->hasRole(['host', 'admin']))
                                    <div class="border-t border-gray-200"></div>
                                    <a href="{{ route('host.dashboard') }}" 
                                       class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Host Dashboard
                                    </a>
                                @endif
                                
                                @if(auth()->user()->hasRole(['admin', 'superadmin']))
                                    <a href="{{ route('admin.dashboard') }}" 
                                       class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Admin Panel
                                    </a>
                                @endif
                                
                                @if(auth()->user()->role === 'guest')
                                    <div class="border-t border-gray-200"></div>
                                    <a href="{{ route('become-host') }}" 
                                       class="block px-4 py-2 text-sm text-green-600 hover:bg-green-50">
                                        Become a Host
                                    </a>
                                @endif
                                
                                <div class="border-t border-gray-200"></div>
                                <form method="POST" action="{{ route('logout') }}">
                                    @csrf
                                    <button type="submit" 
                                            class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Logout
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                @else
                    <a href="{{ route('login') }}" 
                       class="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                        Login
                    </a>
                    <a href="{{ route('register') }}" 
                       class="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                        Sign Up
                    </a>
                @endauth
            </div>

            <!-- Mobile menu button -->
            <div class="md:hidden flex items-center">
                <button @click="mobileMenuOpen = !mobileMenuOpen"
                        class="text-gray-700 hover:text-gray-900 focus:outline-none focus:text-gray-900 p-2">
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path x-show="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        <path x-show="mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        </div>
    </div>

    <!-- Mobile menu -->
    <div x-show="mobileMenuOpen" x-transition:enter="transition ease-out duration-200"
         x-transition:enter-start="transform opacity-0 scale-95"
         x-transition:enter-end="transform opacity-100 scale-100"
         x-transition:leave="transition ease-in duration-75"
         x-transition:leave-start="transform opacity-100 scale-100"
         x-transition:leave-end="transform opacity-0 scale-95"
         class="md:hidden bg-white border-t border-gray-200">
        <div class="px-2 pt-2 pb-3 space-y-1">
            <!-- Search on mobile -->
            <form action="{{ route('search') }}" method="GET" class="px-3 py-2">
                <input type="text" 
                       name="q" 
                       placeholder="Search adventures..."
                       class="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md text-sm">
            </form>

            <a href="{{ route('trips.index') }}" 
               class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md">
                Adventures
            </a>
            <a href="{{ route('accommodations.index') }}" 
               class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md">
                Accommodations
            </a>
            <a href="{{ route('travel-guide') }}" 
               class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md">
                Travel Guide
            </a>

            @auth
                <div class="border-t border-gray-200 pt-4 pb-3">
                    <div class="flex items-center px-3">
                        <img class="h-10 w-10 rounded-full" 
                             src="{{ auth()->user()->avatar_url }}" 
                             alt="{{ auth()->user()->full_name }}">
                        <div class="ml-3">
                            <div class="text-base font-medium text-gray-800">{{ auth()->user()->full_name }}</div>
                            <div class="text-sm font-medium text-gray-500">{{ auth()->user()->email }}</div>
                        </div>
                    </div>
                    <div class="mt-3 space-y-1">
                        <a href="{{ route('profile.show') }}" 
                           class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md">
                            Profile
                        </a>
                        <a href="{{ route('profile.bookings') }}" 
                           class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md">
                            My Bookings
                        </a>
                        <form method="POST" action="{{ route('logout') }}">
                            @csrf
                            <button type="submit" 
                                    class="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md">
                                Logout
                            </button>
                        </form>
                    </div>
                </div>
            @else
                <div class="border-t border-gray-200 pt-4 pb-3 space-y-1">
                    <a href="{{ route('login') }}" 
                       class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md">
                        Login
                    </a>
                    <a href="{{ route('register') }}" 
                       class="block px-3 py-2 text-base font-medium bg-green-600 text-white hover:bg-green-700 rounded-md">
                        Sign Up
                    </a>
                </div>
            @endauth
        </div>
    </div>
</nav>