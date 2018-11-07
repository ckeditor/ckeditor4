/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview Defines the "virtual" {@link CKEDITOR.dom.focusOptions} class
 * that contains the options that can be added to {@link CKEDITOR.dom.element.focus}
 * or other methods inheriting from it. This file is for documentation purposes only.
 */

/**
 * Virtual class that illustrates the {@link CKEDITOR.dom.element.prototype.focus} param focus options.
 *
 * Example:
 *
 * ```javascript
 * var element = CKEDITOR.document.getById( 'myTextarea' );
 * element.focus( { preventScroll: true } ); // Focuses but prevents scrolling.
 * element.focus( { preventScroll: false } ); // Focuses without preventing scroll.
 * element.focus( { defer: false } ); // Focuses after 100ms.
 * element.focus(); // Focuses without preventing scroll.
 * ```
 *
 * @class CKEDITOR.dom.focusOptions
 * @abstract
 */

/**
 * Whether any browser scroll should be prevented upon focusing.
 *
 * @property {Boolean} [preventScroll=false]
 */

/**
 * Whether focus should be deferred by 100ms.
 *
 * @property {Boolean} [defer=false]
 */
