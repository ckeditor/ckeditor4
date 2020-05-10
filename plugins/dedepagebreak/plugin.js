CKEDITOR.plugins.add( 'dedepagebreak', {

	icons: 'dedepagebreak',

	init: function( editor ) {

		editor.addCommand( 'insertDedePageBreak', {

			exec: function( editor ) {
				var now = new Date();
				editor.insertHtml( '#p#分页标题#e#' );
			}
		});

		editor.ui.addButton( 'DedePageBreak', {
			label: 'Insert PageBreak',
			command: 'insertDedePageBreak',
			toolbar: 'insert'
		});
	}
});