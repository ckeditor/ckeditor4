CKEDITOR.dialog.add( 'testDialog2', function() {
	return {
		title: 'Test Dialog 2',
		contents: [
			{
				id: 'info',
				label: 'Test',
				elements: [
					{
						type: 'text',
						id: 'foo',
						label: 'bar'
					}
				]
			}
		]
	};
} );
