/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.dialog.add( 'a11yHelp', function( editor ) {
	var lang = editor.lang.a11yhelp,
		id = CKEDITOR.tools.getNextId();

	var variablesPattern = /\$\{(.*?)\}/g,
		replaceVariables = function( match, name ) {
			var keystrokeCode = editor.getCommandKeystroke( name );

			// Return the keystroke representation or leave match untouched
			// if there's no keystroke for such command.
			return keystrokeCode ? CKEDITOR.plugins.a11yhelp.representKeystroke( editor, keystrokeCode ) : match;
		};

	function populateWithAvailableCommands() {
		var commandsWithKeystrokes = [],
			commandName;
		for ( commandName in editor.commands ) {
			if ( editor.getCommandKeystroke( commandName ) ) {
				commandsWithKeystrokes.push( {
					'command': editor.getCommand( commandName ),
					'commandName': commandName
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

		var pageHtml = [];

		// Sections from lang files
		var sections = lang.legend,
			sectionLength = sections.length;

		for ( var i = 0; i < sectionLength; i++ ) {
			var section = sections[ i ],
				sectionHtml = [],
				items = section.items,
				itemsLength = items.length;

			for ( var j = 0; j < itemsLength; j++ ) {
				var item = items[ j ],
					itemLegend = item.legend;

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
		}

		// Section based on available commands
		// If you modify `commandRowTpl`, you need to change unit test in a simmilar way.
		var commandsSectionTpl = '<h1>%1</h1><table>%2</table>',
			commandRowTpl = '<tr><td>%1</td><td>%2</td></tr>',
			commandsTbodyTpl = '<tbody>%1</tbody>',
			commandsTbodyHtml = '',
			commandsTheadTpl = '<thead><tr><th>%1</th><th>%2</th></tr></thead>',
			commandsTheadHtml = '',
			commandItems;

		commandsTheadHtml = commandsTheadTpl.replace( '%1', lang.commandsList.command ).replace( '%2', lang.commandsList.keystroke );

		// get all commands with keystrokes
		commandItems = populateWithAvailableCommands();

		// get data necessary for filling table
		CKEDITOR.tools.array.forEach( commandItems, function( commandItem ) {

			if ( commandItem.command.label ) {
				commandItem.label = commandItem.command.label;
			} else if ( commandItem.command.uiItems && commandItem.command.uiItems.length && commandItem.command.uiItems[0].label ) {
				commandItem.label = commandItem.command.uiItems[0].label;
			} else {
				commandItem.label = '';
			}

			commandItem.description = commandItem.command.description || '';
			commandItem.keystrokeHtml = CKEDITOR.plugins.a11yhelp.representKeystroke( editor, editor.getCommandKeystroke( commandItem.command ) );

			editor.fire( 'keystrokeEntry', commandItem );
		} );

		// filter out commands without label
		commandItems = CKEDITOR.tools.array.filter( commandItems, function( command ) {
			return !!command.label;
		} );

		// create inner table with commands
		commandsTbodyHtml = commandsTbodyTpl.replace( '%1', CKEDITOR.tools.array.reduce( commandItems, function( acc, commandItem ) {
			return acc + commandRowTpl.replace( '%1', commandItem.label ).replace( '%2', commandItem.keystrokeHtml + ( commandItem.description ? '<br />' + commandItem.description : '' ) );
		} , '' ) );

		// push section html to output file.
		pageHtml.push( commandsSectionTpl.replace( '%1', lang.commandsList.sectionName ).replace( '%2', commandsTheadHtml + commandsTbodyHtml ) );

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
