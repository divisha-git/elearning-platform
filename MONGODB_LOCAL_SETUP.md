# Local MongoDB Setup for eLearning Website

## Step 1: Install MongoDB Community Server
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Choose Windows version and download the MSI installer
3. Run the installer with default settings
4. Make sure to install MongoDB as a Windows Service

## Step 2: Install MongoDB Compass (GUI)
1. Download MongoDB Compass from: https://www.mongodb.com/try/download/compass
2. Install with default settings
3. This gives you a visual interface to view your database

## Step 3: Start MongoDB Service
Run these commands in Command Prompt as Administrator:

```cmd
# Start MongoDB service
net start MongoDB

# Or if service name is different:
net start "MongoDB Server"
```

## Step 4: Verify MongoDB is Running
```cmd
# Check if MongoDB is listening on port 27017
netstat -an | findstr :27017
```

## Step 5: Connect with MongoDB Compass
1. Open MongoDB Compass
2. Use connection string: `mongodb://localhost:27017`
3. You should see your `elearning` database after running the contact form

## Step 6: Test Your Setup
1. Start your backend server: `node server.js`
2. You should see: "MongoDB Connected: localhost"
3. Submit a contact form
4. Check MongoDB Compass for the `contacts` collection in `elearning` database

## Alternative: Quick MongoDB Start (if already installed)
```cmd
# If MongoDB is installed but not running as service
mongod --dbpath "C:\data\db"
```

## Troubleshooting
- If port 27017 is busy: `netstat -ano | findstr :27017` then kill the process
- If service won't start: Check Windows Services and start "MongoDB Server"
- If connection fails: Ensure Windows Firewall allows MongoDB
