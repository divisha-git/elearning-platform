# MongoDB Atlas Setup for eLearning Website

## Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new cluster (choose free tier)

## Step 2: Setup Database and User
1. **Database Name**: `elearning`
2. **Collections**: 
   - `contacts` (for contact form submissions)
   - `feedbacks` (for feedback submissions)
   - `users` (for user authentication)

## Step 3: Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<username>`, `<password>`, and cluster URL in `.env` file

## Step 4: Update .env File
```env
MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/elearning?retryWrites=true&w=majority
```

## Step 5: Network Access
1. Go to "Network Access" in Atlas
2. Add your IP address or use `0.0.0.0/0` for development

## Alternative: Use File Storage (Current Working Solution)
Your contact form is already working with file storage:
- Data saved to: `/backend/storage/contacts.json`
- No MongoDB setup required
- Works immediately

## Current Status
✅ File-based storage working
✅ Contact form saving data
✅ Backend routes configured
⏳ MongoDB Atlas setup (optional upgrade)
