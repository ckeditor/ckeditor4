'use strict';

var CKCONSOLE = (function() {
	var	that = {
			container: null,
			definitions: {},

			add: function( consoleName, definition ) {
				this.definitions[ consoleName ] = definition;
				definition.name = consoleName;
			},

			create: function( consoleName, config ) {
				var editor = config.editor,
					definition = CKEDITOR.tools.prototypedCopy( this.definitions[ consoleName ] );

				if ( typeof editor == 'string' )
					editor = CKEDITOR.instances[ editor ];

				createConsole( editor, definition );
			},

			panels: {
				box: panelBox,
				log: panelLog
			}
		};

	function createConsole( editor, definition ) {
		createContainer();

		var editorPanel = createEditorPanel( editor, definition ),
			panels = [],
			panels2Refresh = [],
			refreshTimeout,
			panelDefinition,
			panel;

		for ( var i = 0; i < definition.panels.length; ++i ) {
			panelDefinition = definition.panels[ i ];
			panel = new that.panels[ panelDefinition.type ]( editor, editorPanel, panelDefinition );

			panels.push( panel );
			if ( panel.refresh )
				panels2Refresh.push( panel );
			if ( panel.init )
				panels2Init.push( panel );
		}

		editor.on( 'focus', function() {
			editorPanel.addClass( 'ckconsole_active' );

			if ( refreshTimeout )
				clearTimeout( refreshTimeout );
			refresh();
		} );

		editor.on( 'blur', function() {
			editorPanel.removeClass( 'ckconsole_active' );

			if ( refreshTimeout )
				clearTimeout( refreshTimeout );
		} );

		editor.on( 'instanceReady', function() {
			refresh( true );
		} );

		function refresh( once ) {
			for ( var i = 0; i < panels2Refresh.length; ++i )
				panels2Refresh[ i ].refresh();

			editorPanel.addClass( 'ckconsole_refreshed' );

			if ( !once )
				refreshTimeout = setTimeout( refresh, 2000 );
			setTimeout( removeRefreshed, 100 );
		}

		function removeRefreshed() {
			editorPanel.removeClass( 'ckconsole_refreshed' );
		}
	}

	function createContainer() {
		if ( !that.container ) {
			that.container = fromHtml( '<div class="ckconsole cke_reset_all"></div>' );
			CKEDITOR.document.getBody().append( that.container );

			var link = fromHtml( '<link rel="stylesheet" href="' + CKEDITOR.getUrl( 'dev/console/console.css' ) + '">' );
			CKEDITOR.document.getHead().append( link );
		}
	}

	function createEditorPanel( editor, definition ) {
		var el = fromHtml( editorPanelTpl, {
			name: editor.name + '/' + definition.name
		} );

		that.container.append( el );
		return el;
	}

	function fromHtml( html, data ) {
		if ( html instanceof CKEDITOR.template )
			html = html.output( data );

		return CKEDITOR.dom.element.createFromHtml( html );
	}

	function panelBox( editor, editorPanel, panelDefinition ) {
		var container = fromHtml( panelTpl, {
			header: '<span class="ckconsole_value" data-value="header"></span>',
			content: '<div class="ckconsole_content">' + panelDefinition.content + '</div>'
		} );

		editorPanel.append( container );

		var valuesElements = container.getElementsByClass( 'ckconsole_value' ),
			values = {};

		for ( var el, i = 0, l = valuesElements.count(); i < l; ++i ) {
			el = valuesElements.getItem( i );
			values[ el.data( 'value' ) ] = el;
		}

		return {
			editor: editor,
			definition: panelDefinition,
			container: container,
			valuesElements: values,
			refresh: function() {
				var values = this.definition.refresh( this.editor ),
					valueName;

				for ( valueName in values )
					this.valuesElements[ valueName ].setHtml( values[ valueName ] );
			}
		};
	}

	function panelLog( editor, editorPanel, panelDefinition ) {
		var container = fromHtml( panelTpl, {
			header: 'Console',
			content: '<ul class="ckconsole_log"></ul>'
		} );

		editorPanel.append( container );

		var logList = container.getElementsByClass( 'ckconsole_log' ).getItem( 0 );

		editor.on( 'pluginsLoaded', function() {
			panelDefinition.on( editor, log, logFn );
		} );

		// Scroll list to the end after it has been shrinked.
		editor.on( 'blur', function() {
			logList.$.scrollTop = logList.$.scrollHeight;
		}, null, null, 999 );

		function log( msg ) {
			var time = new Date().toString().match( /\d\d:\d\d:\d\d/ )[ 0 ],
				item = fromHtml( logItemTpl, { time: time, msg: msg } );

			logList.append( item );
			logList.$.scrollTop = logList.$.scrollHeight;
		}

		function logFn( msg ) {
			return function() {
				log( msg );
			}
		}

		return {
			editor: editor,
			definition: panelDefinition,
			container: container
		};
	}

	var editorPanelTpl = new CKEDITOR.template(
			'<section class="ckconsole_editor_panel"><h1 class="ckconsole_header ckconsole_editor_header">&#9658; Editor: {name}</h1></section>'
		),
		panelTpl = new CKEDITOR.template(
			'<section class="ckconsole_panel">' +
				'<h1 class="ckconsole_header ckconsole_panel_header">{header}</h1>' +
				'{content}' +
			'</section>'
		),
		logItemTpl = new CKEDITOR.template(
			'<li class="ckconsole_log_item"><time datetime="{time}" class="ckconsole_time">{time}</time> <code>{msg}</code></li>'
		);

	return that;
})();