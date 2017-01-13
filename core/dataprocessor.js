/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

/**
 * @fileOverview Defines the "virtual" {@link CKEDITOR.dataProcessor} class, which
 *		defines the basic structure of data processor objects to be
 *		set to {@link CKEDITOR.editor.dataProcessor}.
 */

/**
 * If defined, points to the data processor which is responsible for translating
 * and transforming the editor data on input and output.
 * Generally it will point to an instance of {@link CKEDITOR.htmlDataProcessor},
 * which handles HTML data. The editor may also handle other data formats by
 * using different data processors provided by specific plugins.
 *
 * @property {CKEDITOR.dataProcessor} dataProcessor
 * @member CKEDITOR.editor
 */

/**
 * Represents a data processor which is responsible for translating and
 * transforming the editor data on input and output.
 *
 * This class is here for documentation purposes only and is not really part of
 * the API. It serves as the base ("interface") for data processor implementations.
 *
 * @class CKEDITOR.dataProcessor
 * @abstract
 */

/**
 * Transforms input data into HTML to be loaded into the editor.
 * While the editor is able to handle non-HTML data (like BBCode), it can only
 * handle HTML data at runtime. The role of the data processor is to transform
 * the input data into HTML through this function.
 *
 *		// Tranforming BBCode data, with a custom BBCode data processor available.
 *		var data = 'This is [b]an example[/b].';
 *		var html = editor.dataProcessor.toHtml( data ); // '<p>This is <b>an example</b>.</p>'
 *
 * @method toHtml
 * @param {String} data The input data to be transformed.
 * @param {String} [fixForBody] The tag name to be used if the data must be
 * fixed because it is supposed to be loaded direcly into the `<body>`
 * tag. This is generally not used by non-HTML data processors.
 * @todo fixForBody type - compare to htmlDataProcessor.
 */

/**
 * Transforms HTML into data to be output by the editor, in the format
 * expected by the data processor.
 *
 * While the editor is able to handle non-HTML data (like BBCode), it can only
 * handle HTML data at runtime. The role of the data processor is to transform
 * the HTML data containined by the editor into a specific data format through
 * this function.
 *
 *		// Tranforming into BBCode data, with a custom BBCode data processor available.
 *		var html = '<p>This is <b>an example</b>.</p>';
 *		var data = editor.dataProcessor.toDataFormat( html ); // 'This is [b]an example[/b].'
 *
 * @method toDataFormat
 * @param {String} html The HTML to be transformed.
 * @param {String} fixForBody The tag name to be used if the output data is
 * coming from the `<body>` element and may be eventually fixed for it. This is
 * generally not used by non-HTML data processors.
 */
