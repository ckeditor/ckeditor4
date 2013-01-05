/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

(function() {
	'use strict';

	CKEDITOR.dataFilter = function( editor ) {
		this.customConfig = true;
		this.allowedRules = [];

		var allowedContent = editor.config.allowedContent;

		if ( !allowedContent ) {
			allowedContent = defaultAllowedContent;
			this.customConfig = false;
		}

		this.addRules( allowedContent, 1 );
	};

	CKEDITOR.dataFilter.prototype = {
		addRules: function( newRules, overrideCustom ) {
			// Don't override custom user's configuration if not explicitly requested.
			if ( this.customConfig && !overrideCustom )
				return;

			if ( typeof newRules == 'string' )
				newRules = parseRulesString( newRules );

			var rules = this.allowedRules,
				groupName, rule;

			for ( groupName in newRules ) {
				rule = newRules[ groupName ];

				if ( typeof rule == 'boolean' )
					rule = {};
				else if ( typeof rule == 'function' )
					rule = { validate: rule };

				if ( groupName.charAt( 0 ) != '$' )
					rule.elements = groupName;

				rules.push( rule );
			}
		}
	};

	function parseRulesString( input ) {
			//              <   elements   >< classes ><   styles and attributes   >< separator >
		var groupPattern = /^([a-z0-9*\s]+)(\.[\w-,]+)?({[\w\-,]+}|\[[\w\-,]+\]){0,2}(?:;\s*|$)/i,
			match,
			elements, attrsAndStyles, styles, attrs, classes,
			rules = {},
			groupNum = 1;

		input = CKEDITOR.tools.trim( input );

		while ( ( match = input.match( groupPattern ) ) ) {
			elements = match[ 1 ].toLowerCase();
			classes = match[ 2 ] || null;
			styles = attrs = null;

			if ( classes )
				classes = classes.slice( 1 );

			if ( ( attrsAndStyles = match[ 3 ] ) ) {
				attrsAndStyles = attrsAndStyles.toLowerCase();

				styles = attrsAndStyles.match( /{([^}]+)}/ );
				if ( styles )
					styles = styles[ 1 ];

				attrs = attrsAndStyles.match( /\[([^\]]+)\]/ );
				if ( attrs )
					attrs = attrs[ 1 ];
			}

			rules[ '$' + groupNum++ ] = {
				elements: elements,
				classes: classes,
				styles: styles,
				attrs: attrs
			};

			// Move to the next group.
			input = input.slice( match[ 0 ].length );
		}

		return rules;
	}

	// Default editor's rules.
	// TODO... shouldn't be default completely empty?
	var defaultAllowedContent = {
		'p br div span': true
	};

})();