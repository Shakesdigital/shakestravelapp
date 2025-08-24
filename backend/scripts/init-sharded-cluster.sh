#!/bin/bash

# MongoDB Sharded Cluster Initialization Script
# This script initializes a complete MongoDB sharded cluster for Shakes Travel

set -e

echo "=========================================="
echo "MongoDB Sharded Cluster Initialization"
echo "Shakes Travel Backend"
echo "=========================================="

# Configuration
MONGO_ROOT_USER="root"
MONGO_ROOT_PASS="shakestravelroot2024"
AUTH_DB="admin"

# Wait for services to be ready
echo "⏳ Waiting for MongoDB services to start..."
sleep 45

echo "🔧 Step 1: Initializing Config Server Replica Set"
mongosh --host configsvr1:27019 --username $MONGO_ROOT_USER --password $MONGO_ROOT_PASS --authenticationDatabase $AUTH_DB --eval "
try {
  rs.initiate({
    _id: 'configReplSet',
    configsvr: true,
    members: [
      { _id: 0, host: 'configsvr1:27019' },
      { _id: 1, host: 'configsvr2:27019' },
      { _id: 2, host: 'configsvr3:27019' }
    ]
  });
  print('✅ Config Server Replica Set initialized successfully');
} catch (e) {
  print('⚠️  Config Server Replica Set may already be initialized: ' + e);
}
"

echo "⏳ Waiting for Config Server Replica Set to stabilize..."
sleep 30

echo "🔧 Step 2: Initializing Shard 1 Replica Set"
mongosh --host shard1_replica1:27017 --username $MONGO_ROOT_USER --password $MONGO_ROOT_PASS --authenticationDatabase $AUTH_DB --eval "
try {
  rs.initiate({
    _id: 'shard1ReplSet',
    members: [
      { _id: 0, host: 'shard1_replica1:27017' },
      { _id: 1, host: 'shard1_replica2:27017' },
      { _id: 2, host: 'shard1_replica3:27017' }
    ]
  });
  print('✅ Shard 1 Replica Set initialized successfully');
} catch (e) {
  print('⚠️  Shard 1 Replica Set may already be initialized: ' + e);
}
"

echo "🔧 Step 3: Initializing Shard 2 Replica Set"
mongosh --host shard2_replica1:27017 --username $MONGO_ROOT_USER --password $MONGO_ROOT_PASS --authenticationDatabase $AUTH_DB --eval "
try {
  rs.initiate({
    _id: 'shard2ReplSet',
    members: [
      { _id: 0, host: 'shard2_replica1:27017' },
      { _id: 1, host: 'shard2_replica2:27017' },
      { _id: 2, host: 'shard2_replica3:27017' }
    ]
  });
  print('✅ Shard 2 Replica Set initialized successfully');
} catch (e) {
  print('⚠️  Shard 2 Replica Set may already be initialized: ' + e);
}
"

echo "⏳ Waiting for Shard Replica Sets to stabilize..."
sleep 40

echo "🔧 Step 4: Adding Shards to Cluster"
mongosh --host mongos1:27017 --username $MONGO_ROOT_USER --password $MONGO_ROOT_PASS --authenticationDatabase $AUTH_DB --eval "
try {
  sh.addShard('shard1ReplSet/shard1_replica1:27017,shard1_replica2:27017,shard1_replica3:27017');
  print('✅ Shard 1 added to cluster');
} catch (e) {
  print('⚠️  Shard 1 may already be added: ' + e);
}

try {
  sh.addShard('shard2ReplSet/shard2_replica1:27017,shard2_replica2:27017,shard2_replica3:27017');
  print('✅ Shard 2 added to cluster');
} catch (e) {
  print('⚠️  Shard 2 may already be added: ' + e);
}
"

echo "⏳ Waiting for shards to be fully integrated..."
sleep 30

echo "🔧 Step 5: Configuring Sharding Strategy"
mongosh --host mongos1:27017 --username $MONGO_ROOT_USER --password $MONGO_ROOT_PASS --authenticationDatabase $AUTH_DB --eval "
// Enable sharding for the database
try {
  sh.enableSharding('shakestravel');
  print('✅ Sharding enabled for shakestravel database');
} catch (e) {
  print('⚠️  Sharding may already be enabled: ' + e);
}

// Configure shard keys for collections
try {
  sh.shardCollection('shakestravel.users', { _id: 'hashed' });
  print('✅ Users collection sharded with hashed _id');
} catch (e) {
  print('⚠️  Users collection may already be sharded: ' + e);
}

try {
  sh.shardCollection('shakestravel.trips', { 'location.region': 1, 'location.city': 1, _id: 1 });
  print('✅ Trips collection sharded with location-based key');
} catch (e) {
  print('⚠️  Trips collection may already be sharded: ' + e);
}

try {
  sh.shardCollection('shakestravel.accommodations', { 'location.region': 1, 'location.city': 1, _id: 1 });
  print('✅ Accommodations collection sharded with location-based key');
} catch (e) {
  print('⚠️  Accommodations collection may already be sharded: ' + e);
}

try {
  sh.shardCollection('shakestravel.bookings', { userId: 1, createdAt: 1 });
  print('✅ Bookings collection sharded with userId + createdAt');
} catch (e) {
  print('⚠️  Bookings collection may already be sharded: ' + e);
}

try {
  sh.shardCollection('shakestravel.reviews', { itemId: 1, itemType: 1, createdAt: 1 });
  print('✅ Reviews collection sharded with itemId + itemType + createdAt');
} catch (e) {
  print('⚠️  Reviews collection may already be sharded: ' + e);
}

try {
  sh.shardCollection('shakestravel.payments', { userId: 1, createdAt: 1 });
  print('✅ Payments collection sharded with userId + createdAt');
} catch (e) {
  print('⚠️  Payments collection may already be sharded: ' + e);
}

print('\\n📊 Cluster Status:');
sh.status();
"

echo "🔧 Step 6: Creating Application User"
mongosh --host mongos1:27017 --username $MONGO_ROOT_USER --password $MONGO_ROOT_PASS --authenticationDatabase $AUTH_DB --eval "
db = db.getSiblingDB('shakestravel');

try {
  db.createUser({
    user: 'shakestravel',
    pwd: 'password123',
    roles: [
      { role: 'dbOwner', db: 'shakestravel' },
      { role: 'readWrite', db: 'shakestravel' }
    ]
  });
  print('✅ Application user created successfully');
} catch (e) {
  print('⚠️  Application user may already exist: ' + e);
}
"

echo "🔧 Step 7: Verifying Cluster Health"
mongosh --host mongos1:27017 --username $MONGO_ROOT_USER --password $MONGO_ROOT_PASS --authenticationDatabase $AUTH_DB --eval "
print('\\n🏥 Cluster Health Check:');
print('Config Servers Status:');
try {
  db.adminCommand('listShards').shards.forEach(function(shard) {
    print('Shard: ' + shard._id + ' - Host: ' + shard.host + ' - State: ' + shard.state);
  });
} catch (e) {
  print('Error getting shard status: ' + e);
}

print('\\n📈 Balancer Status:');
try {
  var balancerStatus = sh.getBalancerState();
  print('Balancer is ' + (balancerStatus ? 'ENABLED' : 'DISABLED'));
} catch (e) {
  print('Error getting balancer status: ' + e);
}

print('\\n📊 Database Stats:');
try {
  var stats = db.stats();
  print('Collections: ' + stats.collections);
  print('Data Size: ' + (stats.dataSize / 1024 / 1024).toFixed(2) + ' MB');
  print('Index Size: ' + (stats.indexSize / 1024 / 1024).toFixed(2) + ' MB');
} catch (e) {
  print('Error getting database stats: ' + e);
}
"

echo ""
echo "=========================================="
echo "✅ MongoDB Sharded Cluster Setup Complete!"
echo "=========================================="
echo ""
echo "📝 Connection Details:"
echo "   MongoDB URI: mongodb://root:shakestravelroot2024@mongos1:27017,mongos2:27017/?authSource=admin"
echo "   Application URI: mongodb://shakestravel:password123@mongos1:27017,mongos2:27017/shakestravel?authSource=shakestravel"
echo ""
echo "🖥️  Management Tools:"
echo "   Mongo Express: http://localhost:8081"
echo "   Username: admin / Password: shakesadmin2024"
echo ""
echo "📊 Cluster Components:"
echo "   • Config Servers: 3 instances (27019-27021)"
echo "   • Shard 1: 3 replicas (27017, 27022-27023)"
echo "   • Shard 2: 3 replicas (27024-27026)"
echo "   • Mongos Routers: 2 instances (27030-27031)"
echo ""
echo "🔧 Next Steps:"
echo "   1. Update application connection string to use mongos routers"
echo "   2. Monitor chunk distribution with sh.status()"
echo "   3. Configure read preferences for optimal performance"
echo "   4. Set up monitoring and alerting"
echo "   5. Plan backup strategy for sharded cluster"
echo ""
echo "🚀 Your sharded MongoDB cluster is ready for TripAdvisor-scale traffic!"