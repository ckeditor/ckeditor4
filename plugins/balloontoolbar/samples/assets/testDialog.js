( function() {
	'use strict';

	CKEDITOR.dialog.add( 'testDialog', function() {
		var dialogDefinition = {
			title: 'Test dialog',
			contents: [
				{
					id: 'tab1',
					label: 'Test Label',
					title: 'Test Title',
					elements: [
						{
							type: 'html',
							html: '<p>Hello World</p>'
						}
					]
				},
				{
					id: 'tab2',
					label: 'Test Label 2',
					title: 'Test Title 2',
					elements: [
						{
							type: 'vbox',
							align: 'right',
							width: '200px',
							children: [
								{
									type: 'text',
									id: 'age',
									label: 'Age'
								},
								{
									type: 'text',
									id: 'sex',
									label: 'Sex'
								},
								{
									type: 'text',
									id: 'nationality',
									label: 'Nationality'
								}
							]
						}
					]
				}
			],
			onOk: function() {
				console.log( 'OK OK OK!!!' ); // jshint ignore:line
			},
			buttons: [
				CKEDITOR.dialog.okButton,
				CKEDITOR.dialog.cancelButton
			]
		};

		return dialogDefinition;
	} );
} )();
