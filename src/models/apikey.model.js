import mongoose from 'mongoose';

const apiKeySchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
    trim: true,
     maxlength: [50,"Name can not be more than 50 charecters"]
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  key: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '30d'  
  }
});

export const ApiKey =  mongoose.model('ApiKey', apiKeySchema);