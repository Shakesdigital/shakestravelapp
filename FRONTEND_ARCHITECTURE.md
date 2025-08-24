# Frontend Architecture - Shakes Travel

## Component Structure

### Core Layout Components

```
src/
├── components/
│   ├── layout/
│   │   ├── Header/
│   │   │   ├── Header.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── UserMenu.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   └── MobileMenu.tsx
│   │   ├── Footer/
│   │   │   ├── Footer.tsx
│   │   │   ├── FooterLinks.tsx
│   │   │   └── SocialLinks.tsx
│   │   ├── Sidebar/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── FilterSidebar.tsx
│   │   │   └── AdminSidebar.tsx
│   │   └── Layout.tsx
```

### Feature-Based Components

```
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── ForgotPasswordForm.tsx
│   │   ├── SocialLogin.tsx
│   │   └── ProtectedRoute.tsx
│   ├── search/
│   │   ├── SearchForm.tsx
│   │   ├── SearchFilters.tsx
│   │   ├── SearchResults.tsx
│   │   ├── SearchSuggestions.tsx
│   │   └── QuickFilters.tsx
│   ├── trips/
│   │   ├── TripCard.tsx
│   │   ├── TripList.tsx
│   │   ├── TripDetails.tsx
│   │   ├── TripGallery.tsx
│   │   ├── TripItinerary.tsx
│   │   ├── TripReviews.tsx
│   │   ├── TripBooking.tsx
│   │   └── TripForm.tsx (for hosts)
│   ├── accommodations/
│   │   ├── AccommodationCard.tsx
│   │   ├── AccommodationList.tsx
│   │   ├── AccommodationDetails.tsx
│   │   ├── RoomCard.tsx
│   │   ├── RoomList.tsx
│   │   ├── AccommodationGallery.tsx
│   │   ├── AccommodationReviews.tsx
│   │   └── AccommodationForm.tsx
│   ├── booking/
│   │   ├── BookingForm.tsx
│   │   ├── BookingSummary.tsx
│   │   ├── BookingConfirmation.tsx
│   │   ├── BookingList.tsx
│   │   ├── BookingCard.tsx
│   │   ├── PaymentForm.tsx
│   │   └── PaymentSuccess.tsx
│   ├── reviews/
│   │   ├── ReviewForm.tsx
│   │   ├── ReviewCard.tsx
│   │   ├── ReviewList.tsx
│   │   ├── RatingStars.tsx
│   │   └── ReviewSummary.tsx
│   ├── user/
│   │   ├── UserProfile.tsx
│   │   ├── ProfileForm.tsx
│   │   ├── ProfilePicture.tsx
│   │   ├── Preferences.tsx
│   │   ├── Wishlist.tsx
│   │   └── UserDashboard.tsx
│   ├── host/
│   │   ├── HostDashboard.tsx
│   │   ├── HostProfile.tsx
│   │   ├── ListingManagement.tsx
│   │   ├── BookingManagement.tsx
│   │   ├── Analytics.tsx
│   │   └── HostVerification.tsx
│   ├── admin/
│   │   ├── AdminDashboard.tsx
│   │   ├── UserManagement.tsx
│   │   ├── ContentModeration.tsx
│   │   ├── Analytics.tsx
│   │   └── SystemSettings.tsx
│   └── maps/
│       ├── MapView.tsx
│       ├── LocationPicker.tsx
│       ├── TripMarkers.tsx
│       └── AccommodationMarkers.tsx
```

### Shared/UI Components

```
├── components/
│   ├── ui/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── IconButton.tsx
│   │   │   └── LoadingButton.tsx
│   │   ├── Input/
│   │   │   ├── TextInput.tsx
│   │   │   ├── SearchInput.tsx
│   │   │   ├── DateInput.tsx
│   │   │   └── FileInput.tsx
│   │   ├── Modal/
│   │   │   ├── Modal.tsx
│   │   │   ├── ConfirmModal.tsx
│   │   │   └── ImageModal.tsx
│   │   ├── Card/
│   │   │   ├── Card.tsx
│   │   │   ├── ImageCard.tsx
│   │   │   └── InfoCard.tsx
│   │   ├── Loading/
│   │   │   ├── Spinner.tsx
│   │   │   ├── LoadingSkeleton.tsx
│   │   │   └── ProgressBar.tsx
│   │   ├── Notification/
│   │   │   ├── Toast.tsx
│   │   │   ├── Alert.tsx
│   │   │   └── NotificationCenter.tsx
│   │   ├── Gallery/
│   │   │   ├── ImageGallery.tsx
│   │   │   ├── ThumbnailGrid.tsx
│   │   │   └── Lightbox.tsx
│   │   └── Form/
│   │       ├── FormField.tsx
│   │       ├── FormError.tsx
│   │       ├── Validation.tsx
│   │       └── FormWizard.tsx
```

## Page Components

### Public Pages

```
src/pages/
├── Home/
│   ├── HomePage.tsx
│   ├── HeroSection.tsx
│   ├── FeaturedTrips.tsx
│   ├── FeaturedAccommodations.tsx
│   ├── PopularDestinations.tsx
│   ├── Testimonials.tsx
│   └── Newsletter.tsx
├── Search/
│   ├── SearchPage.tsx
│   ├── SearchResults.tsx
│   ├── NoResults.tsx
│   └── SavedSearches.tsx
├── TripDetails/
│   ├── TripDetailsPage.tsx
│   ├── TripHeader.tsx
│   ├── TripOverview.tsx
│   ├── TripHighlights.tsx
│   ├── TripInclusions.tsx
│   ├── TripRequirements.tsx
│   ├── TripLocation.tsx
│   └── SimilarTrips.tsx
├── AccommodationDetails/
│   ├── AccommodationDetailsPage.tsx
│   ├── AccommodationHeader.tsx
│   ├── AccommodationOverview.tsx
│   ├── RoomSelection.tsx
│   ├── AccommodationLocation.tsx
│   ├── AccommodationPolicies.tsx
│   └── NearbyAccommodations.tsx
└── About/
    ├── AboutPage.tsx
    ├── Mission.tsx
    ├── Team.tsx
    └── Contact.tsx
```

### Authentication Pages

```
├── Auth/
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── ForgotPasswordPage.tsx
│   ├── ResetPasswordPage.tsx
│   └── EmailVerificationPage.tsx
```

### User Dashboard Pages

```
├── Dashboard/
│   ├── UserDashboard.tsx
│   ├── Profile/
│   │   ├── ProfilePage.tsx
│   │   ├── PersonalInfo.tsx
│   │   ├── PreferencesTab.tsx
│   │   ├── SecurityTab.tsx
│   │   └── VerificationTab.tsx
│   ├── Bookings/
│   │   ├── BookingsPage.tsx
│   │   ├── UpcomingBookings.tsx
│   │   ├── PastBookings.tsx
│   │   └── CancelledBookings.tsx
│   ├── Wishlist/
│   │   ├── WishlistPage.tsx
│   │   └── WishlistItems.tsx
│   ├── Reviews/
│   │   ├── ReviewsPage.tsx
│   │   ├── PendingReviews.tsx
│   │   └── SubmittedReviews.tsx
│   └── Messages/
│       ├── MessagesPage.tsx
│       ├── MessageList.tsx
│       └── MessageThread.tsx
```

### Host Dashboard Pages

```
├── Host/
│   ├── HostDashboard.tsx
│   ├── Listings/
│   │   ├── ListingsPage.tsx
│   │   ├── TripListings.tsx
│   │   ├── AccommodationListings.tsx
│   │   ├── CreateListing.tsx
│   │   └── EditListing.tsx
│   ├── Bookings/
│   │   ├── HostBookingsPage.tsx
│   │   ├── BookingRequests.tsx
│   │   ├── ConfirmedBookings.tsx
│   │   └── BookingDetails.tsx
│   ├── Analytics/
│   │   ├── AnalyticsPage.tsx
│   │   ├── BookingStats.tsx
│   │   ├── RevenueStats.tsx
│   │   └── ReviewStats.tsx
│   └── Profile/
│       ├── HostProfilePage.tsx
│       ├── BusinessInfo.tsx
│       ├── Verification.tsx
│       └── PaymentSettings.tsx
```

### Booking Flow Pages

```
├── Booking/
│   ├── BookingPage.tsx
│   ├── GuestDetails.tsx
│   ├── BookingSummary.tsx
│   ├── PaymentPage.tsx
│   ├── BookingConfirmation.tsx
│   └── BookingError.tsx
```

## State Management Structure

### Redux Store Structure

```typescript
// store/index.ts
interface RootState {
  auth: AuthState;
  user: UserState;
  trips: TripsState;
  accommodations: AccommodationsState;
  bookings: BookingsState;
  search: SearchState;
  ui: UIState;
  notifications: NotificationsState;
}

// store/slices/authSlice.ts
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}

// store/slices/tripsSlice.ts
interface TripsState {
  trips: Trip[];
  currentTrip: Trip | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    totalPages: number;
    totalItems: number;
  };
  filters: SearchFilters;
}

// store/slices/searchSlice.ts
interface SearchState {
  query: string;
  location: string;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  guests: number;
  filters: SearchFilters;
  suggestions: string[];
  recentSearches: SearchHistory[];
}
```

### Context Providers

```typescript
// contexts/ThemeContext.tsx
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// contexts/SocketContext.tsx
interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
}

// contexts/MapContext.tsx
interface MapContextType {
  map: google.maps.Map | null;
  setMap: (map: google.maps.Map) => void;
  markers: google.maps.Marker[];
  addMarker: (marker: google.maps.Marker) => void;
}
```

## Routing Structure

```typescript
// App.tsx
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/trips/:id" element={<TripDetailsPage />} />
        <Route path="/accommodations/:id" element={<AccommodationDetailsPage />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        
        {/* Protected User Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardHome />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
        </Route>
        
        {/* Booking Flow */}
        <Route path="/book/:type/:id" element={
          <ProtectedRoute>
            <BookingPage />
          </ProtectedRoute>
        } />
        
        {/* Host Routes */}
        <Route path="/host" element={
          <ProtectedRoute requiredRole="host">
            <HostDashboard />
          </ProtectedRoute>
        }>
          <Route index element={<HostHome />} />
          <Route path="listings" element={<ListingsPage />} />
          <Route path="bookings" element={<HostBookingsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
        </Route>
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }>
          <Route index element={<AdminHome />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="content" element={<ContentModeration />} />
          <Route path="analytics" element={<AdminAnalytics />} />
        </Route>
        
        {/* Error Routes */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="/500" element={<ServerErrorPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
```

## Custom Hooks

```typescript
// hooks/useAuth.ts
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, loading } = useAppSelector(state => state.auth);
  
  const login = useCallback((credentials: LoginCredentials) => {
    return dispatch(loginUser(credentials));
  }, [dispatch]);
  
  const logout = useCallback(() => {
    dispatch(logoutUser());
  }, [dispatch]);
  
  return { isAuthenticated, user, loading, login, logout };
};

// hooks/useLocalStorage.ts
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  // Implementation for localStorage management
};

// hooks/useDebounce.ts
export const useDebounce = <T>(value: T, delay: number): T => {
  // Implementation for debouncing values
};

// hooks/useInfiniteScroll.ts
export const useInfiniteScroll = (callback: () => void) => {
  // Implementation for infinite scrolling
};

// hooks/useGeolocation.ts
export const useGeolocation = () => {
  // Implementation for getting user location
};
```

## Component Props Interfaces

```typescript
// types/components.ts
interface TripCardProps {
  trip: Trip;
  onWishlistToggle?: (tripId: string) => void;
  onBookNow?: (tripId: string) => void;
  showHost?: boolean;
  size?: 'small' | 'medium' | 'large';
}

interface SearchFormProps {
  initialValues?: SearchFormData;
  onSubmit: (data: SearchFormData) => void;
  loading?: boolean;
  showQuickFilters?: boolean;
}

interface BookingFormProps {
  item: Trip | Accommodation;
  itemType: 'trip' | 'accommodation';
  onSubmit: (bookingData: BookingFormData) => void;
  loading?: boolean;
}
```

## Responsive Design Strategy

### Breakpoints
```scss
$breakpoints: (
  xs: 0,
  sm: 600px,
  md: 960px,
  lg: 1280px,
  xl: 1920px
);
```

### Mobile-First Components
- Collapsible navigation menu
- Touch-friendly buttons and inputs
- Swipeable image galleries
- Bottom sheet modals for mobile
- Infinite scroll for lists
- Pull-to-refresh functionality

### Progressive Web App Features
- Service worker for offline functionality
- App manifest for installability
- Push notifications
- Background sync
- App-like navigation

## Performance Optimization

### Code Splitting
```typescript
// Lazy loading components
const TripDetailsPage = lazy(() => import('../pages/TripDetails/TripDetailsPage'));
const HostDashboard = lazy(() => import('../pages/Host/HostDashboard'));
const AdminDashboard = lazy(() => import('../pages/Admin/AdminDashboard'));

// Route-based code splitting
const routes = [
  {
    path: '/trips/:id',
    component: lazy(() => import('../pages/TripDetails/TripDetailsPage'))
  }
];
```

### Image Optimization
- Lazy loading with Intersection Observer
- WebP format with fallbacks
- Responsive images with srcset
- Progressive image loading
- Image compression and resizing

### Bundle Optimization
- Tree shaking
- Dynamic imports
- Vendor bundle splitting
- Gzip compression
- Asset optimization