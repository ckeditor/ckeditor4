/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview Defines the "virtual" {@link CKEDITOR.plugins.templates.collection} class, which
 * contains the definitions of the templates used by [Content Templates](https://ckeditor.com/cke4/addon/templates)
 * plugin.
 */

/**
 * Virtual class that illustrates the templates' collection to be
 * passed to  {@link CKEDITOR.addTemplates} function.
 *
 * This class is not really part of the API.
 *
 * @class CKEDITOR.plugins.templates.collection
 * @abstract
 */

/**
 * The path of subdirectory which holds thumbnail images of the templates
 *
 * @property {String} imagesPath
 */

/**
 * The list of available templates.
 *
 * @property {CKEDITOR.plugins.templates.template[]} templates
 */

/**
 * Virtual class that illustrates the single template.
 *
 * This class is not really part of the API.
 *
 * @class CKEDITOR.plugins.templates.template
 * @abstract
 */

/**
 * The title of the template.
 *
 * @property {String} title
 */

/**
 * The template's thumbnail image path.
 *
 * It is relative to {@link CKEDITOR.plugins.templates.collection#imagesPath}.
 *
 * @property {String} image
 */

/**
 * The template's description.
 *
 * @property {String} description
 */

/**
 * The template's HTML content.
 *
 * Every template needs either HTML content provided directly by {@link #html} property
 * or from the file pointed by {@link #htmlFile} property.
 *
 * @property {String} [html]
 */

/**
 * The path to the file that contains template's HTML content. It has precedence over
 * {@link #html} property.
 *
 * The path is relative to the page's URL.
 *
 * Every template needs either HTML content provided directly by {@link #html} property
 * or from the file pointed by {@link #htmlFile} property.
 *
 * @property {String} [htmlFile]
 */
