/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
 */

/**
 * @fileOverview Defines the "virtual" {@link CKEDITOR.plugins.templates.collectionDefinition} class, which
 * contains the definitions of the templates used by [Content Templates](https://ckeditor.com/cke4/addon/templates)
 * plugin.
 */

/**
 * Virtual class that illustrates the templates' collection to be
 * passed to  {@link CKEDITOR#addTemplates} function.
 *
 * This class is not really part of the API.
 *
 * @class CKEDITOR.plugins.templates.collectionDefinition
 * @abstract
 */

/**
 * The path of a subdirectory that holds thumbnail images of templates
 *
 * @property {String} imagesPath
 */

/**
 * The list of available templates.
 *
 * @property {CKEDITOR.plugins.templates.templateDefinition[]} templates
 */

/**
 * Virtual class that illustrates a single template.
 *
 * This class is not really part of the API.
 *
 * @class CKEDITOR.plugins.templates.templateDefinition
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
 * It is relative to {@link CKEDITOR.plugins.templates.collectionDefinition#imagesPath}.
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
