/* bender-tags: dom,13867 */

( function() {
	'use strict';

	var browserSupportsClassList = 'classList' in document.createElement( '_' ),
		tests = {
			setUp: function() {
				// Dig out CKEDITOR namespace from the nested iframe, this is a namespace created after classList polyfill stub was loaded.
				var frameDoc = CKEDITOR.document.getById( 'iframe' ).getFrameDocument(),
					frameWindow = frameDoc.getWindow();

				this.framedCkeditor = frameWindow.$.CKEDITOR;
				// Framed window exposes classList stub so that we can check if any method was called.
				this.classListStub = frameWindow.$.classListStub;
			},

			'test dom.element#addClass': function() {
				if ( !this.classListStub || browserSupportsClassList ) {
					assert.ignore();
				}

				this.framedCkeditor.document.createElement( 'div' ).addClass( 'foo' );
				assert.areSame( 0, this.classListStub.add.callCount, 'classList.add stub was not called' );
			},

			'test dom.element#removeClass': function() {
				if ( !this.classListStub || browserSupportsClassList ) {
					assert.ignore();
				}

				this.framedCkeditor.document.createElement( 'div' ).removeClass( 'foo' );
				assert.areSame( 0, this.classListStub.remove.callCount, 'classList.remove stub was not called' );
			}
		};

	bender.test( tests );
} )();
