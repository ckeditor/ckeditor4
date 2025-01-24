/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
 */

( function() {
	// Basic HTML entities.
	var htmlbase = 'nbsp,gt,lt,amp';

	var entities =
	// Latin-1 entities
	'quot,iexcl,cent,pound,curren,yen,brvbar,sect,uml,copy,ordf,laquo,' +
		'not,shy,reg,macr,deg,plusmn,sup2,sup3,acute,micro,para,middot,' +
		'cedil,sup1,ordm,raquo,frac14,frac12,frac34,iquest,times,divide,' +

		// Symbols
		'fnof,bull,hellip,prime,Prime,oline,frasl,weierp,image,real,trade,' +
		'alefsym,larr,uarr,rarr,darr,harr,crarr,lArr,uArr,rArr,dArr,hArr,' +
		'forall,part,exist,empty,nabla,isin,notin,ni,prod,sum,minus,lowast,' +
		'radic,prop,infin,ang,and,or,cap,cup,int,there4,sim,cong,asymp,ne,' +
		'equiv,le,ge,sub,sup,nsub,sube,supe,oplus,otimes,perp,sdot,lceil,' +
		'rceil,lfloor,rfloor,lang,rang,loz,spades,clubs,hearts,diams,' +

		// Other special characters
		'circ,tilde,ensp,emsp,thinsp,zwnj,zwj,lrm,rlm,ndash,mdash,lsquo,' +
		'rsquo,sbquo,ldquo,rdquo,bdquo,dagger,Dagger,permil,lsaquo,rsaquo,' +
		'euro';

	// Latin letters entities
	var latin = 'Agrave,Aacute,Acirc,Atilde,Auml,Aring,AElig,Ccedil,Egrave,Eacute,' +
		'Ecirc,Euml,Igrave,Iacute,Icirc,Iuml,ETH,Ntilde,Ograve,Oacute,Ocirc,' +
		'Otilde,Ouml,Oslash,Ugrave,Uacute,Ucirc,Uuml,Yacute,THORN,szlig,' +
		'agrave,aacute,acirc,atilde,auml,aring,aelig,ccedil,egrave,eacute,' +
		'ecirc,euml,igrave,iacute,icirc,iuml,eth,ntilde,ograve,oacute,ocirc,' +
		'otilde,ouml,oslash,ugrave,uacute,ucirc,uuml,yacute,thorn,yuml,' +
		'OElig,oelig,Scaron,scaron,Yuml';

	// Greek letters entities.
	var greek = 'Alpha,Beta,Gamma,Delta,Epsilon,Zeta,Eta,Theta,Iota,Kappa,Lambda,Mu,' +
		'Nu,Xi,Omicron,Pi,Rho,Sigma,Tau,Upsilon,Phi,Chi,Psi,Omega,alpha,' +
		'beta,gamma,delta,epsilon,zeta,eta,theta,iota,kappa,lambda,mu,nu,xi,' +
		'omicron,pi,rho,sigmaf,sigma,tau,upsilon,phi,chi,psi,omega,thetasym,' +
		'upsih,piv';

	// Create a mapping table between one character and its entity form from a list of entity names.
	// @param reverse {Boolean} Whether to create a reverse map from the entity string form to an actual character.
	function buildTable( entities, reverse ) {
		var table = {},
			regex = [];

		// Entities that the browsers' DOM does not automatically transform to the
		// final character.
		var specialTable = {
			nbsp: '\u00A0', // IE | FF
			shy: '\u00AD', // IE
			gt: '\u003E', // IE | FF |   --   | Opera
			lt: '\u003C', // IE | FF | Safari | Opera
			amp: '\u0026', // ALL
			apos: '\u0027', // IE
			quot: '\u0022' // IE
		};

		entities = entities.replace( /\b(nbsp|shy|gt|lt|amp|apos|quot)(?:,|$)/g, function( match, entity ) {
			var org = reverse ? '&' + entity + ';' : specialTable[ entity ],
				result = reverse ? specialTable[ entity ] : '&' + entity + ';';

			table[ org ] = result;
			regex.push( org );
			return '';
		} );

		// Drop trailing comma (#2448).
		entities = entities.replace( /,$/, '' );

		if ( !reverse && entities ) {
			// Transforms the entities string into an array.
			entities = entities.split( ',' );

			// Put all entities inside a DOM element, transforming them to their
			// final characters.
			var div = document.createElement( 'div' ),
				chars;
			div.innerHTML = '&' + entities.join( ';&' ) + ';';
			chars = div.innerHTML;
			div = null;

			// Add all characters to the table.
			for ( var i = 0; i < chars.length; i++ ) {
				var charAt = chars.charAt( i );
				table[ charAt ] = '&' + entities[ i ] + ';';
				regex.push( charAt );
			}
		}

		table.regex = regex.join( reverse ? '|' : '' );

		return table;
	}

	CKEDITOR.plugins.add( 'entities', {
		afterInit: function( editor ) {
			var config = editor.config;

			function getChar( character ) {
				return baseEntitiesTable[ character ];
			}

			function getEntity( character ) {
				return config.entities_processNumerical == 'force' || !entitiesTable[ character ] ? '&#' + getCodePoint( character ) + ';'
				: entitiesTable[ character ];
			}

			// (#4941)
			function getCodePoint( character ) {
				return CKEDITOR.env.ie ? character.charCodeAt( 0 ) : character.codePointAt( 0 );
			}

			var dataProcessor = editor.dataProcessor,
				htmlFilter = dataProcessor && dataProcessor.htmlFilter;

			if ( !htmlFilter ) {
				return;
			}

			// Mandatory HTML basic entities.
			var selectedEntities = [];

			if ( config.basicEntities !== false )
				selectedEntities.push( htmlbase );

			if ( config.entities ) {
				if ( selectedEntities.length )
					selectedEntities.push( entities );

				if ( config.entities_latin )
					selectedEntities.push( latin );

				if ( config.entities_greek )
					selectedEntities.push( greek );

				if ( config.entities_additional )
					selectedEntities.push( config.entities_additional );
			}

			var entitiesTable = buildTable( selectedEntities.join( ',' ) );

			// Create the Regex used to find entities in the text, leave it matches nothing if entities are empty.
			var entitiesRegex = entitiesTable.regex ? '[' + entitiesTable.regex + ']' : 'a^';
			delete entitiesTable.regex;

			if ( config.entities && config.entities_processNumerical ) {
				entitiesRegex = '[^ -~]|' + entitiesRegex;
			}


			// IE does not support unicode option in the Regex constructor (#4941).
			entitiesRegex = new RegExp( entitiesRegex, CKEDITOR.env.ie ? 'g' : 'gu' );

			// Decode entities that the browsers has transformed
			// at first place.
			var baseEntitiesTable = buildTable( [ htmlbase, 'shy' ].join( ',' ), true ),
				baseEntitiesRegex = new RegExp( baseEntitiesTable.regex, 'g' );

			htmlFilter.addRules( {
				text: function( text ) {
					return text.replace( baseEntitiesRegex, getChar ).replace( entitiesRegex, getEntity );
				}
			}, {
				applyToAll: true,
				excludeNestedEditable: true
			} );
		}
	} );
} )();

/**
 * Whether to escape basic HTML entities in the document, including:
 *
 * * `&nbsp;`
 * * `&gt;`
 * * `&lt;`
 * * `&amp;`
 *
 * **Note:** This option should not be changed unless when outputting a non-HTML data format like BBCode.
 *
 *		config.basicEntities = false;
 *
 * @cfg {Boolean} [basicEntities=true]
 * @member CKEDITOR.config
 */
CKEDITOR.config.basicEntities = true;

/**
 * Whether to use HTML entities in the editor output.
 *
 *		config.entities = false;
 *
 * @cfg {Boolean} [entities=true]
 * @member CKEDITOR.config
 */
CKEDITOR.config.entities = true;

/**
 * Whether to convert some Latin characters (Latin alphabet No. 1, ISO 8859-1)
 * to HTML entities. The list of entities can be found in the
 * [W3C HTML 4.01 Specification, section 24.2.1](http://www.w3.org/TR/html4/sgml/entities.html#h-24.2.1).
 *
 *		config.entities_latin = false;
 *
 * @cfg {Boolean} [entities_latin=true]
 * @member CKEDITOR.config
 */
CKEDITOR.config.entities_latin = true;

/**
 * Whether to convert some symbols, mathematical symbols, and Greek letters to
 * HTML entities. This may be more relevant for users typing text written in Greek.
 * The list of entities can be found in the
 * [W3C HTML 4.01 Specification, section 24.3.1](http://www.w3.org/TR/html4/sgml/entities.html#h-24.3.1).
 *
 *		config.entities_greek = false;
 *
 * @cfg {Boolean} [entities_greek=true]
 * @member CKEDITOR.config
 */
CKEDITOR.config.entities_greek = true;

/**
 * Whether to convert all remaining characters not included in the ASCII
 * character table to their relative decimal numeric representation of HTML entity.
 * When set to `force`, it will convert all entities into this format.
 *
 * For example the phrase: `'This is Chinese: 汉语.'` would be output
 * as: `'This is Chinese: &#27721;&#35821;.'`
 *
 *		config.entities_processNumerical = true;
 *		config.entities_processNumerical = 'force'; // Converts from '&nbsp;' into '&#160;';
 *
 * @cfg {Boolean/String} [entities_processNumerical=false]
 * @member CKEDITOR.config
 */

/**
 * A comma-separated list of  additional entities to be used. Entity names
 * or numbers must be used in a form that excludes the `'&amp;'` prefix and the `';'` ending.
 *
 *		config.entities_additional = '#1049'; // Adds Cyrillic capital letter Short I (Й).
 *
 * @cfg {String} [entities_additional='#39' (The single quote (') character)]
 * @member CKEDITOR.config
 */
CKEDITOR.config.entities_additional = '#39';
