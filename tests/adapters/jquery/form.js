/* bender-tags: editor,jquery */
/* bender-ckeditor-adapters: jquery */
/* bender-ckeditor-plugins: wysiwygarea,save,toolbar */
/* global $ */

var FOO = '<p>foo</p>',
	isJquerySlim = $().jquery.indexOf( ' -ajax' ) !== -1;

function assertTextareaValue( id, value, msg ) {
	assert.areSame( value, bender.tools.compatHtml( CKEDITOR.document.getById( id ).getValue() ), msg );
}

bender.test( {
	'test form with textarea inside': function() {
		// jQuery slim does not support Ajax calls.
		if ( isJquerySlim ) {
			assert.ignore();
		}

		$( '#editor-inside' ).ckeditor( function() {
			// Set data without refreshing textarea (this should be done by adapter).
			$( '#editor-inside' ).ckeditor().editor.setData( FOO, function() {
				$( '#form-inside' ).ajaxSubmit( {
					beforeSubmit: function() {
						resume( function() {
							assertTextareaValue( 'editor-inside', FOO, 'updateElement method should be called on submit and value should change.' );
						} );
						return false;
					}
				} );
			} );
		} );

		wait();
	},

	'test form with textarea outside': function() {
		// 'form' attribute is not supported in Internet Explorer!
		// jQuery slim does not support Ajax calls.
		if ( CKEDITOR.env.ie || isJquerySlim )
			assert.ignore();

		$( '#editor-outside' ).ckeditor( function() {
			// Set data without refreshing textarea (this should be done by adapter).
			$( '#editor-outside' ).ckeditor().editor.setData( FOO, function() {
				$( '#form-outside' ).ajaxSubmit( {
					beforeSubmit: function() {
						resume( function() {
							assertTextareaValue( 'editor-outside', FOO, 'updateElement method should be called on submit and value should change.' );
						} );
						return false;
					}
				} );
			} );
		} );

		wait();
	},

	'test save button with jQuery form': function() {
		// jQuery slim does not support Ajax calls.
		if ( isJquerySlim ) {
			assert.ignore();
		}

		$( '#editor-save' ).ckeditor( function() {
			this.setData( FOO, function() {
				this.execCommand( 'save' );
			} );
		} );

		$( '#form-save' ).ajaxForm( function() {
			resume( function() {
				assertTextareaValue( 'editor-save', FOO, 'ajaxForm method should be called when command \'save\' is executed (if jQuery and jQuery.form are included).' );
			} );
		} );

		wait();
	},

	'test overwrite save button with adapter': function() {
		$( '#editor-overwrite-save' ).ckeditor().editor.on( 'save', function() {
			resume( function() {
				assert.isTrue( true, 'This method should be called instead of ajaxForm.' );
			} );
			return false;
		} );

		$( '#form-overwrite-save' ).ajaxForm( function() {
			resume( function() {
				assert.fail( 'Save button should be overwritten and this method shouldn\'t be called' );
			} );
		} );

		$( '#editor-overwrite-save' ).ckeditor( function() {
			this.execCommand( 'save' );
		} );

		wait();
	}
} );
