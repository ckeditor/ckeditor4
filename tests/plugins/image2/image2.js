/* bender-tags: editor,unit,widget */

( function() {
	'use strict';

	var tcs = {},
		tools = widgetTestsTools,
		inlineEditorConfig = {
			language: 'en',
			autoParagraph: false
		},
		alignClassesEditorConfig = {
			language: 'en',
			autoParagraph: false,
			image2_alignClasses: [ 'l', 'c', 'r' ]
		};

	tools.addTests( tcs, {
		name: 'image',
		widgetName: 'image',
		extraPlugins: 'image2',
		extraAllowedContent: 'img[id]',
		editorConfig: inlineEditorConfig,
		initialInstancesNumber: 1,
		assertWidgets: assertWidgetData( {
			align: 'none',
			src: '_assets/foo.png',
			alt: 'foo',
			width: '',
			height: '',
			hasCaption: false
		}, null ),
		newData: newDialogData( {
			align: 'left',
			src: '_assets/bar.png',
			alt: 'bar',
			width: '200',
			height: '250',
			hasCaption: false
		} ),
		newWidgetPattern:
			'<img alt="bar" height="250" src="_assets/bar.png" style="float:left" width="200" />'
	} );

	tools.addTests( tcs, {
		name: 'imageAligned',
		widgetName: 'image',
		extraPlugins: 'image2',
		extraAllowedContent: 'img[id]',
		editorConfig: inlineEditorConfig,
		initialInstancesNumber: 1,
		assertWidgets: assertWidgetData( {
			align: 'right',
			src: '_assets/foo.png',
			alt: 'foo',
			width: '',
			height: '',
			hasCaption: false
		}, null ),
		newData: newDialogData( {
			align: 'center',
			src: '_assets/bar.png',
			alt: 'bar',
			width: '200',
			height: '250',
			hasCaption: false
		} ),
		newWidgetPattern:
			'<p style="text-align:center">' +
				'<img alt="bar" height="250" src="_assets/bar.png" width="200" />' +
			'</p>'
	} );

	tools.addTests( tcs, {
		name: 'imageCentered',
		widgetName: 'image',
		extraPlugins: 'image2',
		extraAllowedContent: 'img[id]',
		editorConfig: inlineEditorConfig,
		initialInstancesNumber: 1,
		assertWidgets: assertWidgetData( {
			align: 'center',
			src: '_assets/foo.png',
			alt: 'foo',
			width: '',
			height: '',
			hasCaption: false
		}, null ),
		newData: newDialogData( {
			align: 'none',
			src: '_assets/bar.png',
			alt: 'bar',
			width: '200',
			height: '250',
			hasCaption: false
		} ),
		newWidgetPattern:
			'<img alt="bar" height="250" src="_assets/bar.png" width="200" />'
	} );

	tools.addTests( tcs, {
		name: 'captioned',
		widgetName: 'image',
		extraPlugins: 'image2',
		extraAllowedContent: 'figure[id]',
		editorConfig: inlineEditorConfig,
		initialInstancesNumber: 1,
		assertWidgets: assertWidgetData( {
			align: 'none',
			src: '_assets/foo.png',
			alt: 'foo',
			width: '',
			height: '',
			hasCaption: true
		}, 'caption1' ),
		newData: newDialogData( {
			align: 'left',
			src: '_assets/bar.png',
			alt: 'bar',
			width: '200',
			height: '250',
			hasCaption: true
		} ),
		newWidgetPattern:
			'<figure class="image" style="float:left">' +
				'<img alt="bar" height="250" src="_assets/bar.png" width="200" />' +
				'<figcaption>Caption</figcaption>' +
			'</figure>'
	} );

	tools.addTests( tcs, {
		name: 'captionedAligned',
		widgetName: 'image',
		extraPlugins: 'image2',
		extraAllowedContent: 'figure[id]',
		editorConfig: inlineEditorConfig,
		initialInstancesNumber: 1,
		assertWidgets: assertWidgetData( {
			align: 'right',
			src: '_assets/foo.png',
			alt: 'foo',
			width: '',
			height: '',
			hasCaption: true
		}, 'caption1' ),
		newData: newDialogData( {
			align: 'center',
			src: '_assets/bar.png',
			alt: 'bar',
			width: '200',
			height: '250',
			hasCaption: true
		} ),
		newWidgetPattern:
			'<div style="text-align:center">' +
				'<figure class="image" style="display:inline-block">' +
					'<img alt="bar" height="250" src="_assets/bar.png" width="200" />' +
					'<figcaption>Caption</figcaption>' +
				'</figure>' +
			'</div>'
	} );

	tools.addTests( tcs, {
		name: 'captionedCentered',
		widgetName: 'image',
		extraPlugins: 'image2',
		extraAllowedContent: 'figure[id]',
		editorConfig: inlineEditorConfig,
		initialInstancesNumber: 1,
		assertWidgets: assertWidgetData( {
			align: 'center',
			src: '_assets/foo.png',
			alt: 'foo',
			width: '',
			height: '',
			hasCaption: true
		}, 'caption1' ),
		newData: newDialogData( {
			align: 'left',
			src: '_assets/bar.png',
			alt: 'bar',
			width: '200',
			height: '250',
			hasCaption: true
		} ),
		newWidgetPattern:
			'<figure class="image" style="float:left">' +
				'<img alt="bar" height="250" src="_assets/bar.png" width="200" />' +
				'<figcaption>Caption</figcaption>' +
			'</figure>'
	} );

	// -- alignClasses -------------------------------------------------

	tools.addTests( tcs, {
		name: 'image_alignClasses',
		widgetName: 'image',
		extraPlugins: 'image2',
		extraAllowedContent: 'img[id]',
		editorConfig: alignClassesEditorConfig,
		initialInstancesNumber: 1,
		assertWidgets: assertWidgetData( {
			align: 'none',
			src: '_assets/foo.png',
			alt: 'foo',
			width: '',
			height: '',
			hasCaption: false
		}, null ),
		newData: newDialogData( {
			align: 'left',
			src: '_assets/bar.png',
			alt: 'bar',
			width: '200',
			height: '250',
			hasCaption: false
		} ),
		newWidgetPattern:
			'<img alt="bar" class="l" height="250" src="_assets/bar.png" width="200" />'
	} );

	tools.addTests( tcs, {
		name: 'imageAligned_alignClasses',
		widgetName: 'image',
		extraPlugins: 'image2',
		extraAllowedContent: 'img[id]',
		editorConfig: alignClassesEditorConfig,
		initialInstancesNumber: 1,
		assertWidgets: assertWidgetData( {
			align: 'right',
			src: '_assets/foo.png',
			alt: 'foo',
			width: '',
			height: '',
			hasCaption: false
		}, null ),
		newData: newDialogData( {
			align: 'center',
			src: '_assets/bar.png',
			alt: 'bar',
			width: '200',
			height: '250',
			hasCaption: false
		} ),
		newWidgetPattern:
			'<p class="c">' +
				'<img alt="bar" height="250" src="_assets/bar.png" width="200" />' +
			'</p>'
	} );

	tools.addTests( tcs, {
		name: 'imageCentered_alignClasses',
		widgetName: 'image',
		extraPlugins: 'image2',
		extraAllowedContent: 'img[id]',
		initialInstancesNumber: 1,
		editorConfig: alignClassesEditorConfig,
		assertWidgets: assertWidgetData( {
			align: 'center',
			src: '_assets/foo.png',
			alt: 'foo',
			width: '',
			height: '',
			hasCaption: false
		}, null ),
		newData: newDialogData( {
			align: 'none',
			src: '_assets/bar.png',
			alt: 'bar',
			width: '200',
			height: '250',
			hasCaption: false
		} ),
		newWidgetPattern:
			'<img alt="bar" height="250" src="_assets/bar.png" width="200" />'
	} );

	tools.addTests( tcs, {
		name: 'captioned_alignClasses',
		widgetName: 'image',
		extraPlugins: 'image2',
		extraAllowedContent: 'figure[id]',
		editorConfig: alignClassesEditorConfig,
		initialInstancesNumber: 1,
		assertWidgets: assertWidgetData( {
			align: 'none',
			src: '_assets/foo.png',
			alt: 'foo',
			width: '',
			height: '',
			hasCaption: true
		}, 'caption1' ),
		newData: newDialogData( {
			align: 'left',
			src: '_assets/bar.png',
			alt: 'bar',
			width: '200',
			height: '250',
			hasCaption: true
		} ),
		newWidgetPattern:
			'<figure class="image l">' +
				'<img alt="bar" height="250" src="_assets/bar.png" width="200" />' +
				'<figcaption>Caption</figcaption>' +
			'</figure>'
	} );

	tools.addTests( tcs, {
		name: 'captionedAligned_alignClasses',
		widgetName: 'image',
		extraPlugins: 'image2',
		extraAllowedContent: 'figure[id]',
		editorConfig: alignClassesEditorConfig,
		initialInstancesNumber: 1,
		assertWidgets: assertWidgetData( {
			align: 'right',
			src: '_assets/foo.png',
			alt: 'foo',
			width: '',
			height: '',
			hasCaption: true
		}, 'caption1' ),
		newData: newDialogData( {
			align: 'center',
			src: '_assets/bar.png',
			alt: 'bar',
			width: '200',
			height: '250',
			hasCaption: true
		} ),
		newWidgetPattern:
			'<div class="c">' +
				'<figure class="image">' +
					'<img alt="bar" height="250" src="_assets/bar.png" width="200" />' +
					'<figcaption>Caption</figcaption>' +
				'</figure>' +
			'</div>'
	} );

	tools.addTests( tcs, {
		name: 'captionedCentered_alignClasses',
		widgetName: 'image',
		extraPlugins: 'image2',
		extraAllowedContent: 'figure[id]',
		editorConfig: alignClassesEditorConfig,
		initialInstancesNumber: 1,
		assertWidgets: assertWidgetData( {
			align: 'center',
			src: '_assets/foo.png',
			alt: 'foo',
			width: '',
			height: '',
			hasCaption: true
		}, 'caption1' ),
		newData: newDialogData( {
			align: 'left',
			src: '_assets/bar.png',
			alt: 'bar',
			width: '200',
			height: '250',
			hasCaption: true
		} ),
		newWidgetPattern:
			'<figure class="image l">' +
				'<img alt="bar" height="250" src="_assets/bar.png" width="200" />' +
				'<figcaption>Caption</figcaption>' +
			'</figure>'
	} );

	// -- linking -------------------------------------------------

	tools.addTests( tcs, {
		name: 'captioned_linked',
		widgetName: 'image',
		extraPlugins: 'image2,link',
		extraAllowedContent: 'figure a[id]',
		editorConfig: inlineEditorConfig,
		initialInstancesNumber: 1,
		assertWidgets: function( editor ) {
			var link = editor.document.getById( 'l1' );

			assert.isNotUndefined( link, 'Link exists' );

			assertWidgetData( {
				align: 'none',
				src: '_assets/foo.png',
				alt: 'foo',
				width: '',
				height: '',
				hasCaption: true,
				link: link
			}, 'caption1' )
		},
		newData: newDialogData( {
			align: 'left',
			src: '_assets/bar.png',
			alt: 'bar',
			width: '200',
			height: '250',
			hasCaption: true
		} ),
		newWidgetPattern:
			'<figure class="image" style="float:left">' +
				'<img alt="bar" height="250" src="_assets/bar.png" width="200" />' +
				'<figcaption>Caption</figcaption>' +
			'</figure>'
	} );

	bender.test( tcs );

	function assertWidgetData( data, caption ) {
		return function( editor, msg ) {
			var widget = tools.getWidgetById( editor, 'w1' );

			for ( var key in data )
				assert.areSame( data[ key ], widget.data[ key ], 'data.' + key + ': ' + msg );

			if ( caption )
				assert.areSame( caption, widget.parts.caption.getText(), 'parts.caption.getText ' + msg );
			else
				assert.isFalse( !!widget.parts.caption, 'there\'s no caption' );
		}
	}

	function newDialogData( data ) {
		var newData = [];

		for ( var key in data )
			newData.push( [ 'info', key, data[ key ] ] );

		return newData;
	}
} )();