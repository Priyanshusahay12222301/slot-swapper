// MongoDB initialization script for Docker
db = db.getSiblingDB('slotswapper');

// Create a user for the application
db.createUser({
  user: 'slotswapper-user',
  pwd: 'slotswapper-pass',
  roles: [
    {
      role: 'readWrite',
      db: 'slotswapper'
    }
  ]
});

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.events.createIndex({ "owner": 1 });
db.events.createIndex({ "status": 1 });
db.events.createIndex({ "startTime": 1 });
db.swaprequests.createIndex({ "requester": 1 });
db.swaprequests.createIndex({ "owner": 1 });
db.swaprequests.createIndex({ "status": 1 });

print('✅ Database initialized successfully!');