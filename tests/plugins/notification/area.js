/* bender-tags: editor */
/* bender-ckeditor-plugins: toolbar,undo,notification */

'use strict';

bender.editor = {
	config: {
		extraPlugins: 'toolbar,undo,notification'
	}
};

bender.test( {
	tearDown: function() {
		var editor = this.editor,
			notifications = editor._.notificationArea.notifications;

		while ( notifications.length ) {
			editor._.notificationArea.remove( notifications[ 0 ] );
		}
	},

	'test add': function() {
		var editor = this.editor,
			area = editor._.notificationArea,
			doc = new CKEDITOR.dom.document( document );

		assert.areSame( 0, area.notifications.length );
		assert.areSame( 0, area.element.getChildCount() );
		assert.areSame( 0, doc.find( '.cke_notifications_area' ).count() );

		area.add( new CKEDITOR.plugins.notification( editor, { message: 'Foo' } ) );

		assert.areSame( 1, area.notifications.length );
		assert.areSame( 1, area.element.getChildCount() );
		assert.areSame( 1, doc.find( '.cke_notifications_area' ).count() );

		area.add( new CKEDITOR.plugins.notification( editor, { message: 'Foo' } ) );

		assert.areSame( 2, area.notifications.length );
		assert.areSame( 2, area.element.getChildCount() );
		assert.areSame( 1, doc.find( '.cke_notifications_area' ).count() );
	},

	'test remove': function() {
		var editor = this.editor,
			area = editor._.notificationArea,
			doc = new CKEDITOR.dom.document( document ),
			notification1 = new CKEDITOR.plugins.notification( editor, { message: 'Foo' } ),
			notification2 = new CKEDITOR.plugins.notification( editor, { message: 'Foo' } ),
			notification3 = new CKEDITOR.plugins.notification( editor, { message: 'Foo' } );

		area.add( notification1 );
		area.add( notification2 );
		area.add( notification3 );

		assert.areSame( 3, area.notifications.length );
		assert.areSame( 3, area.element.getChildCount() );
		assert.areSame( 1, doc.find( '.cke_notifications_area' ).count() );

		area.remove( notification2 );

		assert.areSame( 2, area.notifications.length );
		assert.areSame( 2, area.element.getChildCount() );
		assert.areSame( 1, doc.find( '.cke_notifications_area' ).count() );
		assert.areSame( notification1.id, area.notifications[ 0 ].id );
		assert.areSame( notification3.id, area.notifications[ 1 ].id );

		area.remove( notification1 );

		assert.areSame( 1, area.notifications.length );
		assert.areSame( 1, area.element.getChildCount() );
		assert.areSame( 1, doc.find( '.cke_notifications_area' ).count() );
		assert.areSame( notification3.id, area.notifications[ 0 ].id );

		area.remove( notification3 );

		assert.areSame( 0, area.notifications.length );
		assert.areSame( 0, area.element.getChildCount() );
		assert.areSame( 0, doc.find( '.cke_notifications_area' ).count() );
	},

	// This have to be the last test
	'test delete editor': function() {
		var win = CKEDITOR.document.getWindow(),
			doc = new CKEDITOR.dom.document( document ),
			editor = this.editor,
			area = editor._.notificationArea;

		area.add( new CKEDITOR.plugins.notification( editor, { message: 'Foo' } ) );

		assert.areSame( 1, doc.find( '.cke_notifications_area' ).count() );

		editor.destroy();

		assert.areSame( 0, doc.find( '.cke_notifications_area' ).count() );

		win.fire( 'scroll' );

		assert.isTrue( true, 'Listeners should be removed so there should be no errors.' );
	}
} );
