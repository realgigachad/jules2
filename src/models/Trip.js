import mongoose from 'mongoose';

const MultilingualStringSchema = new mongoose.Schema({
  en: { type: String, default: '' },
  de: { type: String, default: '' },
  hu: { type: String, default: '' },
  ru: { type: String, default: '' },
  sk: { type: String, default: '' },
}, { _id: false });

const TripSchema = new mongoose.Schema({
  title: {
    type: MultilingualStringSchema,
    required: true,
  },
  description: {
    type: MultilingualStringSchema,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  imageUrl: {
    type: String,
  },
});

export default mongoose.models.Trip || mongoose.model('Trip', TripSchema);
