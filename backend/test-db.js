const mongoose = require('mongoose');
const Contact = require('./models/Contact');
const Feedback = require('./models/Feedback');

// Test database connection and operations
async function testDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://localhost:27017/elearning');
        console.log('✅ Connected to MongoDB');

        // Test Contact creation
        const testContact = new Contact({
            name: 'Test User',
            email: 'test@example.com',
            phone: '1234567890',
            message: 'This is a test message'
        });

        const savedContact = await testContact.save();
        console.log('✅ Contact saved:', savedContact._id);

        // Test Feedback creation
        const testFeedback = new Feedback({
            name: 'Test User',
            comment: 'This is test feedback',
            rating: 5,
            image: 'https://via.placeholder.com/150'
        });

        const savedFeedback = await testFeedback.save();
        console.log('✅ Feedback saved:', savedFeedback._id);

        // List all contacts
        const contacts = await Contact.find();
        console.log(`📋 Total contacts: ${contacts.length}`);

        // List all feedback
        const feedback = await Feedback.find();
        console.log(`📋 Total feedback: ${feedback.length}`);

        console.log('🎉 Database test completed successfully!');
        
    } catch (error) {
        console.error('❌ Database test failed:', error.message);
    } finally {
        mongoose.connection.close();
    }
}

testDatabase();
