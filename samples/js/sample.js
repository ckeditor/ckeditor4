/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* exported initSample */

if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 )
	CKEDITOR.tools.enableHtml5Elements( document );

// The trick to keep the editor in the sample quite small
// unless user specified own height.
CKEDITOR.config.height = 150;
CKEDITOR.config.width = 'auto';

var initSample = ( function() {
	var wysiwygareaAvailable = isWysiwygareaAvailable(),
		isBBCodeBuiltIn = !!CKEDITOR.plugins.get( 'bbcode' );

	return function() {
		var editorElement = CKEDITOR.document.getById( 'editor' );

		// :(((
		if ( isBBCodeBuiltIn ) {
			editorElement.setHtml(
				'Hello world!\n\n' +
				'I\'m an instance of [url=https://ckeditor.com]CKEditor[/url].'
			);
		}

		// Depending on the wysiwygarea plugin availability initialize classic or inline editor.
		if ( wysiwygareaAvailable ) {
			var PLACEHOLDERS = [{
				id: 1,
				name: 'address',
				title: 'Address',
				description: 'Customer Support correspondence address.'
			  },
			  {
				id: 2,
				name: 'assignee',
				title: 'Assignee Name',
				description: 'Ticket assignee name.'
			  },
			  {
				id: 3,
				name: 'deadline',
				title: 'Deadline Time',
				description: 'Utmost time to which technician should handle the issue.'
			  },
			  {
				id: 4,
				name: 'department',
				title: 'Department Name',
				description: 'Department name responsible for servicing this ticket.'
			  },
			  {
				id: 5,
				name: 'caseid',
				title: 'Case ID',
				description: 'Unique case number used to distinguish tickets.'
			  },
			  {
				id: 6,
				name: 'casename',
				title: 'Case Name',
				description: 'Name of the ticket provided by the user.'
			  },
			  {
				id: 7,
				name: 'contact',
				title: 'Contact E-mail',
				description: 'Customer Support contact e-mail address.'
			  },
			  {
				id: 8,
				name: 'customer',
				title: 'Customer Name',
				description: 'Receipent of your response.'
			  },
			  {
				id: 9,
				name: 'hotline',
				title: 'Hotline Number',
				description: 'Customer Support Hotline number.'
			  },
			  {
				id: 10,
				name: 'technician',
				title: 'Technician Name',
				description: 'Technician which will handle this ticket.'
			  }
			];

			CKEDITOR.addCss('span > .cke_placeholder { background-color: #ffeec2; }');

			CKEDITOR.replace('editor', {
			  extraPlugins: 'autocomplete,textmatch,toolbar,wysiwygarea,basicstyles,link,undo,placeholder',
			//   toolbar: [{
			// 	  name: 'document',
			// 	  items: ['Undo', 'Redo']
			// 	},
			// 	{
			// 	  name: 'basicstyles',
			// 	  items: ['Bold', 'Italic']
			// 	},
			// 	{
			// 	  name: 'links',
			// 	  items: ['Link', 'Unlink']
			// 	}
			//   ],
			  on: {
				instanceReady: function(evt) {
				//   var itemTemplate = '<li data-id="{id}">' +
				// 	'<div><strong class="item-title">{title}</strong></div>' +
				// 	'<div><i>{description}</i></div>' +
				// 	'</li>',
				var outputTemplate = '[[{title}]]<span>&nbsp;</span>';

				var autocomplete = new CKEDITOR.plugins.autocomplete(evt.editor, {
					textTestCallback: textTestCallback,
					dataCallback: dataCallback,
					// itemTemplate: itemTemplate,
					outputTemplate: outputTemplate
				  });

				  // Override default getHtmlToInsert to enable rich content output.
				  autocomplete.getHtmlToInsert = function(item) {
					return this.outputTemplate.output(item);
				  }
				}
			  }
			});

			function textTestCallback(range) {
			  if (!range.collapsed) {
				return null;
			  }

			  return CKEDITOR.plugins.textMatch.match(range, matchCallback);
			}

			function matchCallback(text, offset) {
			  var pattern = /\[{2}([A-z]|\])*$/,
				match = text.slice(0, offset)
				.match(pattern);

			  if (!match) {
				return null;
			  }

			  return {
				start: match.index,
				end: offset
			  };
			}

			function dataCallback(matchInfo, callback) {
			  var data = PLACEHOLDERS.filter(function(item) {
				var itemName = '[[' + item.name + ']]';
				return itemName.indexOf(matchInfo.query.toLowerCase()) == 0;
			  });

			  callback(data);
			}
		} else {
			editorElement.setAttribute( 'contenteditable', 'true' );
			CKEDITOR.inline( 'editor' );

			// TODO we can consider displaying some info box that
			// without wysiwygarea the classic editor may not work.
		}
	};

	function isWysiwygareaAvailable() {
		// If in development mode, then the wysiwygarea must be available.
		// Split REV into two strings so builder does not replace it :D.
		if ( CKEDITOR.revision == ( '%RE' + 'V%' ) ) {
			return true;
		}

		return !!CKEDITOR.plugins.get( 'wysiwygarea' );
	}
} )();

// %LEAVE_UNMINIFIED% %REMOVE_LINE%
