/* bender-tags: 14825 */

( function() {
	'use strict';

	bender.editors = {
		divarea: {
			name: 'divarea',
			startupData: '<p>Paragraph 1</p><p>Paragraph 2</p><p>Paragraph 3</p><p>Paragraph 4</p><p>Paragraph 5</p><p>Paragraph 6</p>',
			config: {
				extraPlugins: 'divarea',
				width: '100px',
				height: '100px'
			}
		}
	};

	bender.test( {
		'test scroll position after focusing scrolled editor': function() {
			if ( !( CKEDITOR.env.edge && CKEDITOR.env.version > 14 ) ) {
				assert.ignore();
			}

			var editor = this.editors.divarea,
				editable = editor.editable();

			assert.areSame( 0, editable.$.scrollTop, 'Initial scrollTop is 0.' );

			editable.find( 'p' ).getItem( 3 ).scrollIntoView();

			var currentScrollTop = editable.$.scrollTop;
			assert.isTrue( currentScrollTop > 0, 'Editor was scrolled successfully.' );

			editor.focus();
			wait( function() {
				assert.areSame( currentScrollTop, editable.$.scrollTop, 'Editor scrollTop value did not change after focus.' );
			}, 100 );
		}
	} );
} )();
