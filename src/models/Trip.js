/**
 * @fileoverview This file defines the Mongoose schema for Trips.
 * A trip represents a travel package with details like title, description, price, dates, and an image.
 */
import mongoose from 'mongoose';

/**
 * Mongoose schema for a string that can be translated into multiple languages.
 */
const MultilingualStringSchema = new mongoose.Schema({
  en: { type: String, default: '' },
  de: { type: String, default: '' },
  hu: { type: String, default: '' },
  ru: { type: String, default: '' },
  sk: { type: String, default: '' },
  cs: { type: String, default: '' },
  uk: { type: String, default: '' },
}, { _id: false });

/**
 * Mongoose schema for the price of a trip in various currencies.
 */
const PriceSchema = new mongoose.Schema({
  eur: { type: Number, default: 0 },
  gbp: { type: Number, default: 0 },
  huf: { type: Number, default: 0 },
  rub: { type: Number, default: 0 },
  czk: { type: Number, default: 0 },
  uah: { type: Number, default: 0 },
}, { _id: false });

/**
 * Mongoose schema for a Trip.
 */
const TripSchema = new mongoose.Schema({
  /**
   * The title of the trip, in multiple languages.
   */
  title: {
    type: MultilingualStringSchema,
    required: true,
  },
  /**
   * The description of the trip, in multiple languages.
   * This is expected to be a JSON object from the Tiptap editor.
   */
  description: {
    type: MultilingualStringSchema,
    required: true,
  },
  /**
   * The prices of the trip in different currencies.
   */
  prices: {
    type: PriceSchema,
    required: true,
  },
  /**
   * The start date of the trip.
   */
  startDate: {
    type: Date,
  },
  /**
   * The end date of the trip.
   */
  endDate: {
    type: Date,
  },
  /**
   * The URL of the trip's promotional image.
   */
  imageUrl: {
    type: String,
  },
});

// Ensures the model is only compiled once.
export default mongoose.models.Trip || mongoose.model('Trip', TripSchema);
