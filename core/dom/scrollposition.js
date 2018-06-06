/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview Defines the "virtual" {@link CKEDITOR.dom.scrollPosition} class
 * which contains the definition of {@link CKEDITOR.dom.element} or {@link CKEDITOR.dom.document} scroll position.
 * This file is for documentation purposes only.
 */

/**
 * Virtual class that illustrates the {@link CKEDITOR.dom.element} or {@link CKEDITOR.dom.document} scroll position.
 *
 * @class CKEDITOR.dom.scrollPosition
 * @abstract
 */

/**
 * Number in pixels which represent distance between {@link CKEDITOR.dom.element}'s or {@link CKEDITOR.dom.document}'s top to its topmost visible content.
 * When {@link CKEDITOR.dom.element}'s or {@link CKEDITOR.dom.document}'s doesn't generate verticall scrollbar,
 * then its {@link CKEDITOR.dom.scrollPosition#scrollTop} value is `0`.
 *
 * @property {Number} scrollTop
 */

/**
 * Number in pixels which represent distance between {@link CKEDITOR.dom.element}'s or {@link CKEDITOR.dom.document}'s left to its leftmost visible content.
 * When {@link CKEDITOR.dom.element}'s or {@link CKEDITOR.dom.document}'s doesn't generate horizontal scrollbar,
 * then its {@link CKEDITOR.dom.scrollPosition#scrollLeft} value is `0`.
 *
 * @property {Number} scrollLeft
 */
