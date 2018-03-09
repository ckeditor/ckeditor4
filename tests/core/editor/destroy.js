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

		// (#1722)
		'test destroy destorys attached filters': function() {
			bender.editorBot.create( { name: 'editor_destorys_filters' }, function( bot ) {
				var editor = bot.editor;

				new CKEDITOR.filter( 'b', editor );
				new CKEDITOR.filter( editor );
				new CKEDITOR.filter( 'b ' );

				// +1 because there is additional filter attached on editor creation.
				assert.areEqual( 3, getEditorFilters( editor ).length, 'Should be 3 editor filters' );
				assert.areEqual( 1, getEditorFilters().length, 'Should be 1 global filter' );

				editor.destroy();

				assert.areEqual( 0, getEditorFilters( editor ).length, 'Editor filters should have been destroyed' );
				assert.areEqual( 1, getEditorFilters().length, 'Global filter should not have been destroyed' );
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
				assert.isTrue( warnStub.calledOnce, 'CKEDITOR.warn should be called once.' );
				assert.areEqual( 'editor-incorrect-destroy', warnStub.firstCall.args[ 0 ],
					'CKEDITOR.warn error code should be "editor-incorrect-destroy".' );
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
		}
	} );

	function getEditorFilters( editor ) {
		return bender.tools.objToArray( CKEDITOR.filter.instances ).filter( function( filter ) {
			return filter.editor === editor;
		} );
	}

} )();
