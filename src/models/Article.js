/**
 * @fileoverview This file defines the Mongoose schema for Articles.
 * An article consists of a multilingual title and content, an author, and a creation date.
 */
import mongoose from 'mongoose';

/**
 * @typedef {object} MultilingualString
 * @property {string} en - English
 * @property {string} de - German
 * @property {string} hu - Hungarian
 * @property {string} ru - Russian
 * @property {string} sk - Slovak
 * @property {string} cs - Czech
 * @property {string} uk - Ukrainian
 */

/**
 * Mongoose schema for a string that can be translated into multiple languages.
 * This is used for fields like title and content.
 * The `_id: false` option prevents Mongoose from creating a separate ID for this sub-document.
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
 * Mongoose schema for an Article.
 */
const ArticleSchema = new mongoose.Schema({
  /**
   * The title of the article, in multiple languages.
   */
  title: {
    type: MultilingualStringSchema,
    required: true,
  },
  /**
   * The main content of the article, in multiple languages.
   * This is expected to be a JSON object from the Tiptap editor.
   */
  content: {
    type: MultilingualStringSchema,
    required: true,
  },
  /**
   * The author of the article.
   */
  author: {
    type: String,
    default: 'Admin'
  },
  /**
   * The date the article was created.
   */
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// The following line prevents the model from being compiled more than once.
// This is a workaround for a known issue with Next.js and Mongoose in development mode.
export default mongoose.models.Article || mongoose.model('Article', ArticleSchema);
