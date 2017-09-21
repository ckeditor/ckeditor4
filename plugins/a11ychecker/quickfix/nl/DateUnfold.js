/**
 * @license Copyright (c) 2014-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

( function() {
	'use strict';

	CKEDITOR.plugins.a11ychecker.quickFixes.get( { langCode: 'nl',
		name: 'QuickFix',
		callback: function( QuickFix ) {
			// List of month names.
			var monthNames = {
				en: [
					'January',
					'February',
					'March',
					'April',
					'May',
					'June',
					'July',
					'August',
					'September',
					'October',
					'November',
					'December'
				]
			};

			/**
			 * QuickFix converting short dates to more verbose format. Eg. convert 21-3-2030
			 * to 21 March 2030.
			 *
			 * @member CKEDITOR.plugins.a11ychecker.quickFix
			 * @class DateUnfold
			 * @constructor
			 * @param {CKEDITOR.plugins.a11ychecker.Issue} issue Issue QuickFix is created for.
			 */
			function DateUnfold( issue ) {
				QuickFix.call( this, issue );
			}

			DateUnfold.prototype = new QuickFix();

			DateUnfold.prototype.constructor = DateUnfold;

			/**
			 * @param {Object} formAttributes Object containing serialized form inputs. See
			 * {@link CKEDITOR.plugins.a11ychecker.ViewerForm#serialize}.
			 * @param {Function} callback Function to be called when a fix was applied. Gets QuickFix object
			 * as a first parameter.
			 */
			DateUnfold.prototype.fix = function( formAttributes, callback ) {
				var issueElement = this.issue.element,
					innerText = issueElement.getText(),
					that = this;

				innerText = innerText.replace( /(\d{1,2}[.\/-]\d{1,2}[.\/-]\d{2,4})/g, function( occur ) {
					var extractedDate = that.parseDate( occur );

					return that.getFriendlyDate( extractedDate );
				} );

				issueElement.setText( innerText );

				if ( callback ) {
					callback( this );
				}
			};

			/**
			 * Parses given "short" data. Returns an object with 1-based values.
			 *
			 * Eg. 21.03.2020 would be parsed to:
			 *
			 *		{
			 *			day: "21",
			 *			month: "03",
			 *			year: "2020"
			 *		}
			 *
			 * @returns {Object} An object containing properties:
			 * * day
			 * * month
			 * * year
			 */
			DateUnfold.prototype.parseDate = function( dateString ) {
				var ret = dateString.split( /[.\-\/]+/ );

				return {
					day: ret[ 0 ],
					month: ret[ 1 ],
					year: ret[ 2 ]
				};
			};

			/**
			 *		var ret = dateFix.getFriendlyDate( {
			 *			day: "21",
			 *			month: "03",
			 *			year: "2020"
			 *		} );
			 *
			 *		// ret === "21 March 2020"
			 *
			 * @param {Object} An object returned by {@link #parseDate}
			 * @returns {String} A human-friendly date representaiton.
			 */
			DateUnfold.prototype.getFriendlyDate = function( dateObj ) {
				// month - 1 because monthNames is 0-based array.
				var monthName = monthNames.en[ Number( dateObj.month - 1 ) ],
					year = Number( dateObj.year );

				// In case of 2 digit year value, lets fix it.
				if ( year >= 0 && year < 100 ) {
					// Year 70 and greater will be considered 19xx.
					if ( year >= 70 ) {
						year += 1900;
					} else {
						// Otherwise we assume it's 20xx.
						year += 2000;
					}
				}

				// Cast day to Number, to remove leading 0.
				return [ Number( dateObj.day ), monthName, year ].join( ' ' );
			};

			DateUnfold.prototype.lang = {};
			CKEDITOR.plugins.a11ychecker.quickFixes.add( 'nl/DateUnfold', DateUnfold );
		}
	} );
}() );
