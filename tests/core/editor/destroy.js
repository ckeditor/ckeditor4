/* bender-tags: editor */
/* bender-ckeditor-plugins: toolbar,button,stylescombo,wysiwygarea */

( function() {

	bender.editor = {
		config: {
			startupFocus: true
		}
	};

	bender.test( {
		'test destroy editor with rich combo panel opened': function() {
			var bot = this.editorBot, editor = this.editor;
			bot.combo( 'Styles', function( combo ) {
				var panelEl = combo._.panel.element;
				editor.destroy();
				assert.isFalse( CKEDITOR.document.getBody().contains( panelEl ) );

				// https://dev.ckeditor.com/ticket/4552: Do that one more time.
				bender.editorBot.create( {}, function( bot ) {
					this.wait( function() {
						bot.combo( 'Styles', function( combo ) {
							var panelEl = combo._.panel.element;

							bot.editor.destroy();
							assert.isFalse( CKEDITOR.document.getBody().contains( panelEl ) );
						} );
					}, 0 );
				} );

			} );
		},

		// https://dev.ckeditor.com/ticket/13385.
		'test getSnapshot returns empty string after editor destroyed': function() {
			bender.editorBot.create( {}, function( bot ) {
				this.wait( function() {
					var editor = bot.editor;
					editor.destroy();
					assert.areSame( '', editor.getSnapshot() );
				}, 0 );
			} );
		},

		'test destroy editor before it is fully initialized': function() {
			var name = 'test_editor',
				element,
				editor,
				warnStub = sinon.stub( CKEDITOR, 'warn' );

			element = CKEDITOR.document.getById( name );
			this.editor.destroy();

			editor = CKEDITOR.replace( element );
			editor.destroy();

			// initConfig is called asynchronously.
			wait( function() {
				warnStub.restore();
				assert.isFalse( warnStub.called, 'CKEDITOR.warn shouldn\'t be called.' );
			}, 0 );
		},

		'test check editable existence on blur': function() {
			CKEDITOR.replace( 'focused', {
				on: {
					instanceReady: function( evt ) {
						resume( function() {
							var editor = evt.sender;
							// Simulate the circumstances instead of creating them.
							editor.focusManager.hasFocus = true;
							sinon.stub( editor, 'editable' ).returns( null );
							editor.focusManager.blur( 1 );
							assert.pass();
						} );
					}
				}
			} );

			wait();
		},

		// (#1722)
		'test destroy attached filters': function() {
			var filters = countFilters();
			bender.editorBot.create( { name: 'editor_filter_destroy' }, function( bot ) {
				var editor = bot.editor;

				new CKEDITOR.filter( editor, 'br' );
				new CKEDITOR.filter( editor );
				new CKEDITOR.filter( 'br' );

				editor.destroy();

				assert.areEqual( 0, countFilters( editor ) );
				assert.areEqual( filters + 1, countFilters() );
			} );
		}
	} );

	function countFilters( editor ) {
		var filters = bender.tools.objToArray( CKEDITOR.filter.instances );
		return editor ? CKEDITOR.tools.array.filter( filters, function( filter ) {
			return filter.editor === editor;
		} ).length : filters.length;
	}

} )();
