// MongoDB Sharding Configuration for Shakes Travel
// Prepares database for horizontal scaling with sharding

// This script sets up sharding configuration for TripAdvisor-scale deployment
// Run this script when moving from single instance to sharded cluster

print('Setting up MongoDB sharding configuration for Shakes Travel...');

// Connect to admin database
db = db.getSiblingDB('admin');

// Enable sharding for the shakestravel database
sh.enableSharding('shakestravel');

print('Enabled sharding for shakestravel database');

// Shard key strategies for different collections
// Based on query patterns and data distribution analysis

// 1. Users collection - shard by hashed _id for even distribution
sh.shardCollection('shakestravel.users', { _id: 'hashed' });
print('Configured sharding for users collection: hashed _id');

// 2. Trips collection - shard by location for geographical distribution
// This enables location-based queries to hit fewer shards
sh.shardCollection('shakestravel.trips', { 
    'location.region': 1, 
    'location.city': 1,
    _id: 1 
});
print('Configured sharding for trips collection: location-based + _id');

// 3. Accommodations collection - similar to trips
sh.shardCollection('shakestravel.accommodations', { 
    'location.region': 1, 
    'location.city': 1,
    _id: 1 
});
print('Configured sharding for accommodations collection: location-based + _id');

// 4. Bookings collection - shard by userId for user-centric queries
sh.shardCollection('shakestravel.bookings', { 
    userId: 1,
    createdAt: 1 
});
print('Configured sharding for bookings collection: userId + createdAt');

// 5. Reviews collection - shard by itemId and itemType for item-centric queries
sh.shardCollection('shakestravel.reviews', { 
    itemId: 1,
    itemType: 1,
    createdAt: 1 
});
print('Configured sharding for reviews collection: itemId + itemType + createdAt');

// 6. Payments collection - shard by userId for user payment history queries
sh.shardCollection('shakestravel.payments', { 
    userId: 1,
    createdAt: 1 
});
print('Configured sharding for payments collection: userId + createdAt');

// Create additional indexes for sharded collections
print('Creating additional indexes for sharded collections...');

// Switch to application database
db = db.getSiblingDB('shakestravel');

// Users collection indexes for sharded environment
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1, 'profile.isVerified': 1 });
db.users.createIndex({ createdAt: -1 });
db.users.createIndex({ 'profile.location.region': 1 });

// Trips collection indexes optimized for sharding
db.trips.createIndex({ hostId: 1, status: 1 });
db.trips.createIndex({ 'location.coordinates': '2dsphere' });
db.trips.createIndex({ category: 1, 'pricing.basePrice': 1 });
db.trips.createIndex({ 'reviews.averageRating': -1, 'location.region': 1 });
db.trips.createIndex({ 'availability.dates.start': 1, 'availability.dates.end': 1 });

// Accommodations collection indexes optimized for sharding
db.accommodations.createIndex({ hostId: 1, status: 1 });
db.accommodations.createIndex({ 'location.coordinates': '2dsphere' });
db.accommodations.createIndex({ type: 1, category: 1, 'pricing.basePrice': 1 });
db.accommodations.createIndex({ 'reviews.averageRating': -1, 'location.region': 1 });
db.accommodations.createIndex({ 'rooms.types.availability': 1 });

// Bookings collection indexes for efficient querying
db.bookings.createIndex({ itemId: 1, itemType: 1, status: 1 });
db.bookings.createIndex({ 'dates.startDate': 1, 'dates.endDate': 1 });
db.bookings.createIndex({ status: 1, updatedAt: -1 });
db.bookings.createIndex({ 'pricing.total': -1 });

// Reviews collection indexes for content moderation and fraud detection
db.reviews.createIndex({ 'moderation.status': 1, 'fraudDetection.riskScore': -1 });
db.reviews.createIndex({ 'verification.isVerified': 1, rating: -1 });
db.reviews.createIndex({ 'moderation.flags.isPotentialFraud': 1 });
db.reviews.createIndex({ userId: 1, 'moderation.status': 1 });

// Payments collection indexes for financial tracking
db.payments.createIndex({ bookingId: 1, status: 1 });
db.payments.createIndex({ paymentMethod: 1, amount: -1 });
db.payments.createIndex({ status: 1, updatedAt: -1 });

print('Created optimized indexes for sharded collections');

// Set up zones for geographical data distribution (if using zone sharding)
// This is optional but recommended for global deployment

print('Setting up sharding zones for geographical distribution...');

// Define zones based on regions
sh.addShardToZone('shard0000', 'uganda-east');
sh.addShardToZone('shard0001', 'uganda-west'); 
sh.addShardToZone('shard0002', 'uganda-north');
sh.addShardToZone('shard0003', 'uganda-central');

// Define zone ranges for trips and accommodations
sh.updateZoneKeyRange(
    'shakestravel.trips',
    { 'location.region': 'Eastern', 'location.city': MinKey, _id: MinKey },
    { 'location.region': 'Eastern', 'location.city': MaxKey, _id: MaxKey },
    'uganda-east'
);

sh.updateZoneKeyRange(
    'shakestravel.trips',
    { 'location.region': 'Western', 'location.city': MinKey, _id: MinKey },
    { 'location.region': 'Western', 'location.city': MaxKey, _id: MaxKey },
    'uganda-west'
);

sh.updateZoneKeyRange(
    'shakestravel.trips',
    { 'location.region': 'Northern', 'location.city': MinKey, _id: MinKey },
    { 'location.region': 'Northern', 'location.city': MaxKey, _id: MaxKey },
    'uganda-north'
);

sh.updateZoneKeyRange(
    'shakestravel.trips',
    { 'location.region': 'Central', 'location.city': MinKey, _id: MinKey },
    { 'location.region': 'Central', 'location.city': MaxKey, _id: MaxKey },
    'uganda-central'
);

// Same zone configuration for accommodations
sh.updateZoneKeyRange(
    'shakestravel.accommodations',
    { 'location.region': 'Eastern', 'location.city': MinKey, _id: MinKey },
    { 'location.region': 'Eastern', 'location.city': MaxKey, _id: MaxKey },
    'uganda-east'
);

sh.updateZoneKeyRange(
    'shakestravel.accommodations',
    { 'location.region': 'Western', 'location.city': MinKey, _id: MinKey },
    { 'location.region': 'Western', 'location.city': MaxKey, _id: MaxKey },
    'uganda-west'
);

sh.updateZoneKeyRange(
    'shakestravel.accommodations',
    { 'location.region': 'Northern', 'location.city': MinKey, _id: MinKey },
    { 'location.region': 'Northern', 'location.city': MaxKey, _id: MaxKey },
    'uganda-north'
);

sh.updateZoneKeyRange(
    'shakestravel.accommodations',
    { 'location.region': 'Central', 'location.city': MinKey, _id: MinKey },
    { 'location.region': 'Central', 'location.city': MaxKey, _id: MaxKey },
    'uganda-central'
);

print('Configured zone sharding for geographical distribution');

// Configure balancer settings for optimal performance
sh.setBalancerState(true);

// Set balancer window (optional - to control when balancing occurs)
db.settings.updateOne(
   { _id: "balancer" },
   { $set: { activeWindow: { start: "01:00", stop: "05:00" } } },
   { upsert: true }
);

print('Configured balancer settings');

// Create monitoring collections for sharding metrics
db.createCollection('sharding_metrics', {
    timeseries: {
        timeField: 'timestamp',
        metaField: 'shard',
        granularity: 'minutes'
    }
});

print('Created monitoring collection for sharding metrics');

// Display sharding status
print('\n=== Sharding Configuration Summary ===');
print('Sharded Collections:');
print('- users: hashed _id');
print('- trips: location.region + location.city + _id');
print('- accommodations: location.region + location.city + _id');
print('- bookings: userId + createdAt');
print('- reviews: itemId + itemType + createdAt');
print('- payments: userId + createdAt');

print('\nZone Configuration:');
print('- uganda-east: Eastern region data');
print('- uganda-west: Western region data');
print('- uganda-north: Northern region data');
print('- uganda-central: Central region data');

print('\nNext Steps for Production Deployment:');
print('1. Deploy config servers (3 instances minimum)');
print('2. Deploy mongos routers (2+ instances)');
print('3. Deploy shard replica sets (3 members each)');
print('4. Update application connection string to use mongos');
print('5. Monitor chunk distribution and balancing');
print('6. Implement read preferences for optimal performance');

print('\nMongoDB sharding configuration completed successfully!');

// Verification queries
print('\n=== Verification ===');
print('Sharded collections status:');
db.adminCommand('listCollections').cursor.firstBatch.forEach(
    function(collection) {
        if (collection.type === 'collection') {
            var shardStatus = sh.status();
            print('Collection: ' + collection.name);
        }
    }
);

print('\nSharding setup complete. Monitor performance and adjust as needed.');