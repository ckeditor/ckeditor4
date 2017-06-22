/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.dialog.add( 'a11yHelp', function( editor ) {
	var lang = editor.lang.a11yhelp,
		coreLang = editor.lang.common.keyboard,
		id = CKEDITOR.tools.getNextId();

	// CharCode <-> KeyChar.
	var keyMap = {
		8: coreLang[ 8 ],
		9: lang.tab,
		13: coreLang[ 13 ],
		16: coreLang[ 16 ],
		17: coreLang[ 17 ],
		18: coreLang[ 18 ],
		19: lang.pause,
		20: lang.capslock,
		27: lang.escape,
		33: lang.pageUp,
		34: lang.pageDown,
		35: coreLang[ 35 ],
		36: coreLang[ 36 ],
		37: lang.leftArrow,
		38: lang.upArrow,
		39: lang.rightArrow,
		40: lang.downArrow,
		45: lang.insert,
		46: coreLang[ 46 ],
		91: lang.leftWindowKey,
		92: lang.rightWindowKey,
		93: lang.selectKey,
		96: lang.numpad0,
		97: lang.numpad1,
		98: lang.numpad2,
		99: lang.numpad3,
		100: lang.numpad4,
		101: lang.numpad5,
		102: lang.numpad6,
		103: lang.numpad7,
		104: lang.numpad8,
		105: lang.numpad9,
		106: lang.multiply,
		107: lang.add,
		109: lang.subtract,
		110: lang.decimalPoint,
		111: lang.divide,
		112: lang.f1,
		113: lang.f2,
		114: lang.f3,
		115: lang.f4,
		116: lang.f5,
		117: lang.f6,
		118: lang.f7,
		119: lang.f8,
		120: lang.f9,
		121: lang.f10,
		122: lang.f11,
		123: lang.f12,
		144: lang.numLock,
		145: lang.scrollLock,
		186: lang.semiColon,
		187: lang.equalSign,
		188: lang.comma,
		189: lang.dash,
		190: lang.period,
		191: lang.forwardSlash,
		192: lang.graveAccent,
		219: lang.openBracket,
		220: lang.backSlash,
		221: lang.closeBracket,
		222: lang.singleQuote
	};

	// Modifier keys override.
	keyMap[ CKEDITOR.ALT ] = coreLang[ 18 ];
	keyMap[ CKEDITOR.SHIFT ] = coreLang[ 16 ];
	keyMap[ CKEDITOR.CTRL ] = CKEDITOR.env.mac ? coreLang[ 224 ] : coreLang[ 17 ];

	// Sort in desc.
	var modifiers = [ CKEDITOR.ALT, CKEDITOR.SHIFT, CKEDITOR.CTRL ];

	// function representKeyStroke( keystroke ) {
	// 	var quotient, modifier,
	// 		presentation = [];
	// 	for ( var i = 0; i < modifiers.length; i++ ) {
	// 		modifier = modifiers[ i ];
	// 		quotient = keystroke / modifiers[ i ];
	// 		if ( quotient > 1 && quotient <= 2 ) {
	// 			keystroke -= modifier;
	// 			presentation.push( keyMap[ modifier ] );
	// 		}
	// 	}

	// 	presentation.push( keyMap[ keystroke ] || String.fromCharCode( keystroke ) );

	// 	return presentation.join( '+' );
	// }

	function representKeyStroke( keystroke ) {
		var quotient, modifier,
			presentation = [];
		for ( var i = 0; i < modifiers.length; i++ ) {
			modifier = modifiers[ i ];
			quotient = keystroke / modifiers[ i ];
			if ( quotient > 1 && quotient <= 2 ) {
				keystroke -= modifier;
				presentation.push( '<kbd>' + keyMap[ modifier ] + '</kbd>' );
			}
		}
		presentation.push( '<kbd>' + ( keyMap[ keystroke ] || String.fromCharCode( keystroke ) ) + '</kbd>' );

		return '<kbd>' + presentation.join( '+' ) + '</kbd>';
	}

	var variablesPattern = /\$\{(.*?)\}/g,
		replaceVariables = function( match, name ) {
			var keystrokeCode = editor.getCommandKeystroke( name );

			// Return the keystroke representation or leave match untouched
			// if there's no keystroke for such command.
			return keystrokeCode ? representKeyStroke( keystrokeCode ) : match;
		};

	function populateWithAvailableCommands() {
		var commands = editor.commands;
		var commandsWithKeystrokes = [];
		var command, commandName, keystroke, label;
		for ( commandName in commands ) {
			if ( keystroke = editor.getCommandKeystroke( commandName ) ) {
				command = editor.getCommand( commandName );

				if ( command.label ) {
					label = command.label;
				} else if ( command.uiItems && command.uiItems.length && command.uiItems[0].label ) {
					label = command.uiItems[0].label;
				} else {
					label = '';
				}

				commandsWithKeystrokes.push( {
					keystroke: representKeyStroke( keystroke ),
					label: label,
					description: command.description || ''
				} );
			}
		}
		return commandsWithKeystrokes;
	}


	// Create the help list directly from lang file entries.
	function buildHelpContents() {
		var pageTpl = '<div class="cke_accessibility_legend" role="document" aria-labelledby="' + id + '_arialbl" tabIndex="-1">%1</div>' +
				'<span id="' + id + '_arialbl" class="cke_voice_label">' + lang.contents + ' </span>',
			sectionTpl = '<h1>%1</h1><dl>%2</dl>',
			itemTpl = '<dt>%1</dt><dd>%2</dd>';

		var pageHtml = [],
			sections = lang.legend;
			// sectionLength = sections.length;

		var section = sections[0],
			sectionHtml = [],
			items = section.items,
			itemsLength = items.length;

		// for ( var i = 0; i < sectionLength; i++ ) {
		// 	var section = sections[ i ],
		// 		sectionHtml = [],
		// 		items = section.items,
		// 		itemsLength = items.length;

		for ( var j = 0; j < itemsLength; j++ ) {
			var item = items[ j ],
				// (http://dev.ckeditor.com/ticket/16980) There should be a different hotkey shown in Commands on Edge browser.
				itemLegend = CKEDITOR.env.edge && item.legendEdge ? item.legendEdge : item.legend;

			itemLegend = itemLegend.replace( variablesPattern, replaceVariables );

			// (http://dev.ckeditor.com/ticket/9765) If some commands haven't been replaced in the legend,
			// most likely their keystrokes are unavailable and we shouldn't include
			// them in our help list.
			if ( itemLegend.match( variablesPattern ) ) {
				continue;
			}

			sectionHtml.push( itemTpl.replace( '%1', item.name ).replace( '%2', itemLegend ) );
		}

		pageHtml.push( sectionTpl.replace( '%1', section.name ).replace( '%2', sectionHtml.join( '' ) ) );
		// }

		var commandsSectionTpl = '<h1>%1</h1><table>%2</table>';
		var commandRowTpl = '<tr><td>%1</td><td>%2</td></tr>';
		var commandsHtml = '';
		var commandsHtmlHeader = '<thead><tr><th>Command</th><th>Keystroke</th></tr></thead>';
		var commands = populateWithAvailableCommands();
		commands = CKEDITOR.tools.array.filter( commands, function() {
			return true; // later change to belo code
			// return !!command.label // ADD 'command' to function!!!!!!!!
		} );

		commandsHtml = CKEDITOR.tools.array.reduce( commands, function( acc, command ) {
			return acc + commandRowTpl.replace( '%1', command.label ).replace( '%2', command.keystroke + ( command.description ? '<br />' + command.description : '' ) );
		} , '' );

		pageHtml.push( commandsSectionTpl.replace( '%1', lang.commands ).replace( '%2', commandsHtmlHeader + commandsHtml ) );

		return pageTpl.replace( '%1', pageHtml.join( '' ) );
	}

	return {
		title: lang.title,
		minWidth: 600,
		minHeight: 400,
		contents: [ {
			id: 'info',
			label: editor.lang.common.generalTab,
			expand: true,
			elements: [
				{
					type: 'html',
					id: 'legends',
					style: 'white-space:normal;',
					focus: function() {
						this.getElement().focus();
					},
					html: buildHelpContents()
				}
			]
		} ],
		buttons: [ CKEDITOR.dialog.cancelButton ]
	};
} );
