const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
  name: String,
  email: String,
  inventory: [{
    type: String,
    vendorItemNumber: String,
    ourItemNumber: String,
    description: String,
    unitOfMeasure: String,
    cost: Number,
    created: Date,
    isActive: Boolean
  }]
}, { timestamps: true });

module.exports = mongoose.models.Subscriber || mongoose.model('Subscriber', subscriberSchema);
