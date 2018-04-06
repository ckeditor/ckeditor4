/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview Defines the "virtual" {@link CKEDITOR.dom.rect} class
 * which contains the defintion of an element's DOM rectangle. This file is for
 * documentation purposes only.
 */

/**
 * Virtual class that illustrates the {@link CKEDITOR.dom.element} DOM rectangle (dimensions and coordinates
 * of the area, which element occupies on the page).
 *
 * @class CKEDITOR.dom.rect
 * @abstract
 */

/**
 * Element's offset from the viewport's top edge.
 *
 * @property {Number} top
 */

/**
 * Element's bottom edge's offset from the viewport's top edge.
 *
 * The value is the same as {@link CKEDITOR.dom.rect#top} value plus {@link CKEDITOR.dom.rect#height} value.
 *
 * @property {Number} bottom
 */

/**
 * Element's offset from the viewport's left edge.
 *
 * @property {Number} left
 */

/**
 * Element's right edge's offset from the viewport's left edge.
 *
 * The value is the same as {@link CKEDITOR.dom.rect#left} value plus {@link CKEDITOR.dom.rect#width} value.
 *
 * @property {Number} right
 */

/**
 * Element's height.
 *
 * @property {Number} height
 */

/**
 * Element's width.
 *
 * @property {Number} width
 */

/**
 * Element's offset from the viewport's left edge.
 *
 * This property is not available in Internet Explorer or Edge.
 *
 * @property {Number} x
 */

/**
 * Element's offset from the viewport's top edge.
 *
 * This property is not available in Internet Explorer or Edge.
 *
 * @property {Number} y
 */
