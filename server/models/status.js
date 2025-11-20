const mongoose = require('mongoose');


const StatusSchema = new mongoose.Schema({
userId: { type: String, required: true },
username: { type: String, required: true },
text: { type: String },
mediaUrl: { type: String },
createdAt: { type: Date, default: Date.now },
expiresAt: { type: Date }
});


module.exports = mongoose.model('Status', StatusSchema);