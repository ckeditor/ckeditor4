/* bender-tags: editor,pastetools */
/* bender-ckeditor-plugins: wysiwygarea,pastetools,font,toolbar */
/* bender-include: ../_helpers/ptTools.js */
/* global ptTools */

( function() {
	'use strict';

	bender.editor = {
		config: {
			removePlugins: 'pastefromword,pastefromlibreoffice,pastefromgdocs',
			allowedContent: true
		}
	};

	var tests = {
		'test #getGroup() can extract custom groups from RTF-like string': function() {
			var filterPath = CKEDITOR.plugins.getPath( 'pastetools' ) + 'filter/common.js',
				expectedGroup = '{\\comandeer test}',
				rtf = '{\\somegroup\\withcontrol\\words' + expectedGroup + '}',
				startIndex = rtf.indexOf( expectedGroup ),
				endIndex = startIndex + expectedGroup.length;

			return ptTools.asyncLoadFilters( filterPath, 'CKEDITOR.plugins.pastetools.filters.common.rtf' )
				.then( function( filter ) {
					var extracted = filter.getGroup( rtf, 'comandeer' );

					assert.areSame( startIndex, extracted.start, 'extracted group start' );
					assert.areSame( endIndex, extracted.end , 'extracted group end' );
					assert.areSame( expectedGroup, extracted.content, 'extracted group content' );
				} );
		},

		'test #getGroup() can extract custom groups from RTF-like string from given position': function() {
			var filterPath = CKEDITOR.plugins.getPath( 'pastetools' ) + 'filter/common.js',
				expectedGroup = '{\\comandeer test}',
				rtf = '{\\somegroup\\withcontrol\\words{\\comandeer fail}}' + expectedGroup + '{\\comandeer fail}',
				startIndex = rtf.indexOf( expectedGroup ),
				endIndex = startIndex + expectedGroup.length;

			return ptTools.asyncLoadFilters( filterPath, 'CKEDITOR.plugins.pastetools.filters.common.rtf' )
				.then( function( filter ) {
					var extracted = filter.getGroup( rtf, 'comandeer', {
						start: startIndex
					} );

					assert.areSame( startIndex, extracted.start, 'extracted group start' );
					assert.areSame( endIndex, extracted.end , 'extracted group end' );
					assert.areSame( expectedGroup, extracted.content, 'extracted group content' );
				} );
		},

		'test #getGroups() get all matching groups in given string': function() {
			var filterPath = CKEDITOR.plugins.getPath( 'pastetools' ) + 'filter/common.js',
				expectedGroup1 = '{\\comandeer test1}',
				expectedGroup2 = '{\\comandeer test2}',
				expectedGroup3 = '{\\comandeer test3}',
				rtf = '{\\somegroup\\withcontrol\\words' + expectedGroup1 + '}' + expectedGroup2 + '{\\group{\\subgroup' +
					expectedGroup3 + '}}',
				startIndex1 = rtf.indexOf( expectedGroup1 ),
				endIndex1 = startIndex1 + expectedGroup1.length,
				startIndex2 = rtf.indexOf( expectedGroup2 ),
				endIndex2 = startIndex2 + expectedGroup2.length,
				startIndex3 = rtf.indexOf( expectedGroup3 ),
				endIndex3 = startIndex3 + expectedGroup3.length;

			return ptTools.asyncLoadFilters( filterPath, 'CKEDITOR.plugins.pastetools.filters.common.rtf' )
				.then( function( filter ) {
					var extracted = filter.getGroups( rtf, 'comandeer' );

					assert.areSame( 3, extracted.length, 'extracted groups count' );

					assert.areSame( startIndex1, extracted[ 0 ].start, 'extracted group #1 start' );
					assert.areSame( endIndex1, extracted[ 0 ].end , 'extracted group #1 end' );
					assert.areSame( expectedGroup1, extracted[ 0 ].content, 'extracted group #1 content' );

					assert.areSame( startIndex2, extracted[ 1 ].start, 'extracted group #2 start' );
					assert.areSame( endIndex2, extracted[ 1 ].end , 'extracted group #2 end' );
					assert.areSame( expectedGroup2, extracted[ 1 ].content, 'extracted group #2 content' );

					assert.areSame( startIndex3, extracted[ 2 ].start, 'extracted group #3 start' );
					assert.areSame( endIndex3, extracted[ 2 ].end , 'extracted group #3 end' );
					assert.areSame( expectedGroup3, extracted[ 2 ].content, 'extracted group #3 content' );
				} );
		},

		'test #extractGroupContent() can extract content from group': function() {
			var filterPath = CKEDITOR.plugins.getPath( 'pastetools' ) + 'filter/common.js',
				imageContent = 'hublabubla',
				group = '{\\pict\\picscalex100\\picscaley100\\piccropl0\\piccropr0\\piccropt0\\piccropb0\\picw1693\\pich1693' +
					'\\picwgoal960\\pichgoal960\\wmetafile8\\bliptag1808877785\\blipupi95' +
					'{\\*\\blipuid 6bd148d9e5b07a01faa49a3be548c51a}\n' +
					imageContent + '}';

			return ptTools.asyncLoadFilters( filterPath, 'CKEDITOR.plugins.pastetools.filters.common.rtf' )
				.then( function( filter ) {
					var extracted = filter.extractGroupContent( group );

					assert.areSame( imageContent, extracted, 'extracted group content' );
				} );
		}
	};

	tests = bender.tools.createAsyncTests( tests );
	bender.test( tests );
} )();
