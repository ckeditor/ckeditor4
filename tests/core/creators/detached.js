/* bender-tags: editor */
/* bender-ckeditor-plugins: wysiwygarea */

( function() {
	'use strict';

	var tests = {
		editorElement: null,
		editorParent: null,

		setUp: function() {
			// this.editorElement = CKEDITOR.document.getById( 'editor1' );
			// this.editorParent = this.editorElement.getParent();

			// this.editorElement.remove();
		},

		tearDown: function() {
			// if( this.editorElement.isDetached()) {
			// 	this.editorParent.append(this.editorElement);
			// }

		},

		'delay editor creation if target element is detached': function() {
			var editorElement = CKEDITOR.document.getById( 'editor1' );

			editorElement.remove();

			var editor = CKEDITOR.replace( this.editorElement, {
				delayDetached: true
			} );

			assert.isNull( editor );
		},

		'delay editor creation until target element attach to DOM': function () {
			var editorElement = CKEDITOR.document.getById( 'editor2' );
			var editorParent = editorElement.getParent();

			editorElement.remove();

			CKEDITOR.replace( editorElement, {
				delayDetached: true,
				on: {
					instanceReady: function( evt ) {
						resume(function () {
							assert.pass();
						});
					}
				}
			} );

			setTimeout(function () {
				editorParent.append( editorElement );
			}, 250);


			wait();
		},

		'gives creation time to provided callback': function() {
			var editorElement = CKEDITOR.document.getById( 'editor3' );
			var editorParent = editorElement.getParent();

			editorElement.remove();

			var editorCreationCallback = null;

			CKEDITOR.replace( editorElement, {
				delayDetached: true,
				registerCallback: RegisterCallback,
				on: {
					instanceReady: function( evt ) {
						resume(function () {
							assert.pass();
						});
					}
				}
			} );

			function RegisterCallback(editorCreationFunc) {
				editorCreationCallback = editorCreationFunc;
			}

			setTimeout(function () {
				editorParent.append( editorElement );
				editorCreationCallback();
			}, 250);


			wait();
		}
	};

	bender.test ( tests );
}() );
