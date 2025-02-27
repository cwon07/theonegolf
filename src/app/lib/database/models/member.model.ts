const mongoose = require('mongoose');

// Define the Member Schema
const memberSchema = new mongoose.Schema({
  Id: {
    type: Int16Array,
    required: true,
    unique: true, 
  },
  name: {
    type: String,
    required: true,
  },
  handicap: {
    type: [Number],
    required: true,  // Handicap array is required
    validate: {
      validator: function (value: number[]) {
        // Ensure the array has at least one handicap entry
        return value.length >= 1;
      },
      message: 'At least one handicap entry is required.',
    },
  },
  eng_name: {
    type: String,
    required: true,
  },
  joinedDate: {
    type: Date,
    default: Date.now,
  },
});

// Create a Member model
const Member = mongoose.model('Member', memberSchema);

module.exports = Member;