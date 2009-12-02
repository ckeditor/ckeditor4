/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @fileOverview The "show border" plugin. The command display visible outline
 * border line around all table elements if table doesn't have a none-zero 'border' attribute specified.
 */

(function() {
	var showBorderClassName = 'cke_show_border',
		cssStyleText,
		cssTemplate =
		// TODO: For IE6, we don't have child selector support,
		// where nested table cells could be incorrect.
		( CKEDITOR.env.ie6Compat ? [
			'.%1 table.%2,',
				'.%1 table.%2 td, .%1 table.%2 th',
				'{',
				'border : #d3d3d3 1px dotted',
				'}'
			] : [
			'.%1 table.%2,',
			'.%1 table.%2 > tr > td, .%1 table.%2 > tr > th,',
			'.%1 table.%2 > tbody > tr > td, .%1 table.%2 > tbody > tr > th,',
			'.%1 table.%2 > thead > tr > td, .%1 table.%2 > thead > tr > th,',
			'.%1 table.%2 > tfoot > tr > td, .%1 table.%2 > tfoot > tr > th',
			'{',
				'border : #d3d3d3 1px dotted',
			'}'
			] ).join( '' );

	cssStyleText = cssTemplate.replace( /%2/g, showBorderClassName ).replace( /%1/g, 'cke_show_borders ' );

	var commandDefinition = {
		preserveState: true,
		editorFocus: false,

		exec: function( editor ) {
			this.toggleState();
			this.refresh( editor );
		},

		refresh: function( editor ) {
			var funcName = ( this.state == CKEDITOR.TRISTATE_ON ) ? 'addClass' : 'removeClass';
			editor.document.getBody()[ funcName ]( 'cke_show_borders' );
		}
	};

	CKEDITOR.plugins.add( 'showborders', {
		requires: [ 'wysiwygarea' ],
		modes: { 'wysiwyg':1 },

		init: function( editor ) {

			var command = editor.addCommand( 'showborders', commandDefinition );
			command.canUndo = false;

			if ( editor.config.startupShowBorders != false )
				command.setState( CKEDITOR.TRISTATE_ON );

			editor.addCss( cssStyleText );

			// Refresh the command on setData.
			editor.on( 'mode', function() {
				if ( command.state != CKEDITOR.TRISTATE_DISABLED )
					command.refresh( editor );
			}, null, null, 100 );

			// Refresh the command on wysiwyg frame reloads.
			editor.on( 'contentDom', function() {
				if ( command.state != CKEDITOR.TRISTATE_DISABLED )
					command.refresh( editor );
			});
		},

		afterInit: function( editor ) {
			var dataProcessor = editor.dataProcessor,
				dataFilter = dataProcessor && dataProcessor.dataFilter,
				htmlFilter = dataProcessor && dataProcessor.htmlFilter;

			if ( dataFilter ) {
				dataFilter.addRules({
					elements: {
						'table': function( element ) {
							var attributes = element.attributes,
								cssClass = attributes[ 'class' ],
								border = parseInt( attributes.border );

							if ( !border || border <= 0 )
								attributes[ 'class' ] = ( cssClass || '' ) + ' ' + showBorderClassName;
						}
					}
				});
			}

			if ( htmlFilter ) {
				htmlFilter.addRules({
					elements: {
						'table': function( table ) {
							var attributes = table.attributes,
								cssClass = attributes[ 'class' ];

							cssClass && ( attributes[ 'class' ] = cssClass.replace( showBorderClassName, '' ).replace( /\s{2}/, ' ' ).replace( /^\s+|\s+$/, '' ) );
						}
					}
				});
			}

			// Table dialog must be aware of it.
			CKEDITOR.on( 'dialogDefinition', function( ev ) {
				if ( ev.editor != editor )
					return;

				var dialogName = ev.data.name;

				if ( dialogName == 'table' || dialogName == 'tableProperties' ) {
					var dialogDefinition = ev.data.definition,
						infoTab = dialogDefinition.getContents( 'info' ),
						borderField = infoTab.get( 'txtBorder' ),
						originalCommit = borderField.commit;

					borderField.commit = CKEDITOR.tools.override( originalCommit, function( org ) {
						return function( data, selectedTable ) {
							org.apply( this, arguments );
							var value = parseInt( this.getValue() );
							selectedTable[ ( !value || value <= 0 ) ? 'addClass' : 'removeClass' ]( showBorderClassName );
						}
					});
				}
			});
		}

	});
})();

/**
 * Whether to automatically enable the "show borders" command when the editor loads.
 * @type Boolean
 * @default true
 * @example
 * config.startupShowBorders = false;
 */
