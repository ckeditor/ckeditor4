( function() {
	'use strict';

	CKEDITOR.dialog.add( 'testdialog2', function() {
		var dialogDefinition = {
			title: 'Test dialog 2',
			contents: [
				{
					id: 'tab1',
					label: 'Test Label 1',
					title: 'Test Title 1',
					elements: [
						{
							type: 'vbox',
							align: 'right',
							width: '200px',
							children: [
								{
									type: 'text',
									id: 'name',
									label: 'Name'
								},
								{
									type: 'text',
									id: 'age',
									label: 'Age'
								}
							]
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
				return true;
			},
			onCancel: function() {
				return false;
			},
			buttons: [
				CKEDITOR.dialog.okButton,
				CKEDITOR.dialog.cancelButton
			]
		};

		return dialogDefinition;
	} );
} )();
