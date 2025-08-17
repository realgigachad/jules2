import mongoose from 'mongoose';

const MultilingualStringSchema = new mongoose.Schema({
  en: { type: String, default: '' },
  de: { type: String, default: '' },
  hu: { type: String, default: '' },
  ru: { type: String, default: '' },
  sk: { type: String, default: '' },
  cs: { type: String, default: '' }, // Added Czech
  uk: { type: String, default: '' }, // Added Ukrainian
}, { _id: false });

const PriceSchema = new mongoose.Schema({
  eur: { type: Number, default: 0 },
  gbp: { type: Number, default: 0 },
  huf: { type: Number, default: 0 },
  rub: { type: Number, default: 0 },
  czk: { type: Number, default: 0 },
  uah: { type: Number, default: 0 },
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
  prices: { // Changed from 'price' to 'prices'
    type: PriceSchema,
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
