/**
 * @fileoverview This file defines the Mongoose schema for Site Settings.
 * This schema stores global configuration for the site, such as contact information,
 * address, and styling options. It is designed to be a singleton document in the database.
 */
import mongoose from 'mongoose';

/**
 * Mongoose schema for a string that can be translated into multiple languages.
 * Reused for any field that requires internationalization.
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
 * Mongoose schema for the site's style settings, including colors and fonts.
 */
const StyleSettingsSchema = new mongoose.Schema({
  themeName: { type: String, default: 'Default' },
  primaryColor: { type: String, default: '#0891b2' },
  backgroundColor: { type: String, default: '#FFFFFF' },
  textColor: { type: String, default: '#1f2937' },
  headerFont: { type: String, default: 'Georgia, serif' },
  bodyFont: { type: String, default: 'Arial, sans-serif' },
}, { _id: false });

/**
 * Mongoose schema for the main Site Settings document.
 */
const SiteSettingsSchema = new mongoose.Schema({
  /**
   * The primary contact email for the site.
   */
  contactEmail: {
    type: String,
    default: '',
  },
  /**
   * The primary contact phone number for the site.
   */
  contactPhone: {
    type: String,
    default: '',
  },
  /**
   * The physical address of the company, with multilingual support.
   */
  address: {
    type: MultilingualStringSchema,
  },
  /**
   * The styling settings for the site.
   */
  style: {
    type: StyleSettingsSchema,
    default: () => ({
      primaryColor: '#0891b2',
      backgroundColor: '#FFFFFF',
      textColor: '#1f2937',
      headerFont: 'Georgia, serif',
      bodyFont: 'Arial, sans-serif',
    })
  },
  /**
   * The appearance setting for the admin panel header.
   * Can be 'default', 'compact', or 'playful'.
   */
  adminAppearance: {
    type: String,
    default: 'default',
  },
  /**
   * The appearance setting for the public site header.
   * Can be 'default', 'compact', or 'playful'.
   */
  publicAppearance: {
    type: String,
    default: 'default',
  }
});

// Ensures the model is only compiled once.
export default mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);
