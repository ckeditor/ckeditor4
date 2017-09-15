/**
 * @license Copyright (c) 2014-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

(function() {
	'use strict';

	/**
	 * QuickFix type for the QuickFix objects.
	 *
	 * # Overview
	 *
	 * It encapsulates logic responsible for fixing Accessibility issue.
	 *
	 * ## Working with QuickFix objects
	 *
	 * ### Adding controls to the QuickFix form
	 *
	 * Controls can be added in {@link #display} method using {@link CKEDITOR.plugins.a11ychecker.ViwerForm}
	 * methods.
	 *
	 * ### Executing the fix
	 *
	 * The fixing logic is placed in {@link #fix} method, so you need to simply call it when
	 * you're sure to apply the fix.
	 *
	 * @since 4.6.0
	 * @member CKEDITOR.plugins.a11ychecker.quickFix
	 * @class QuickFix
	 * @constructor
	 * @param {CKEDITOR.plugins.a11ychecker.Issue} issue Issue QuickFix is created for.
	 */
	function QuickFix( issue ) {
		this.issue = issue;
	}

	QuickFix.prototype = {
		/**
		 * @member CKEDITOR.plugins.a11ychecker.quickFix.QuickFix
		 * @property {CKEDITOR.plugins.a11ychecker.Issue} issue Issue object that QuickFix was created for.
		 */
		issue: null
	};

	QuickFix.prototype.constructor = QuickFix;

	QuickFix.prototype.display = function( form, editor ) {
	};

	/**
	 * @param {Object} formAttributes Object containing serialized form inputs. See
	 * {@link CKEDITOR.plugins.a11ychecker.ViewerForm#serialize}.
	 * @param {Function} callback Function to be called when a fix was applied. Gets QuickFix object
	 * as a first parameter.
	 */
	QuickFix.prototype.fix = function( formAttributes, callback ) {
		if ( callback ) {
			callback( this );
		}
	};

	/**
	 * Method used to valide data placed in form.
	 *
	 * @param {Object} formAttributes Object containing serialized form inputs. See
	 * {@link CKEDITOR.plugins.a11ychecker.ViewerForm#serialize}.
	 * @returns {String[]} Array of error messages. If array is empty, then it means no errors occured.
	 */
	QuickFix.prototype.validate = function( formAttributes ) {
		return [];
	};

	/**
	 * A method called to mark the selection on object before quickfix is applied.
	 *
	 * @param {CKEDITOR.dom.selection} selection Editor selection.
	 */
	QuickFix.prototype.markSelection = function( editor, selection ) {
		var rng = editor.createRange();
		rng.setStartBefore( this.issue.element );
		rng.setEndAfter( this.issue.element );
		selection.selectRanges( [ rng ] );
	};

	QuickFix.prototype.lang = {};

	QuickFix.prototype.lang = {};
			CKEDITOR.plugins.a11ychecker.quickFixes.add( 'en/QuickFix', QuickFix );
}());
