/* bender-tags: editor,unit,utils */

'use strict';

bender.editors = {
	none: {
		name: 'none'
	},
	color: {
		name: 'color',
		config: {
			uiColor: 'red'
		}
	},
	langColor: {
		name: 'langColor',
		config: {
			language: 'fr',
			uiColor: 'red'
		}
	}
};

bender.editorsConfig = {
	language: 'pl'
};

bender.test( {
	'test none': function() {
		assert.areSame( 'pl', this.editors.none.config.language );
	},

	'test color': function() {
		assert.areSame( 'pl', this.editors.color.config.language );
		assert.areSame( 'red', this.editors.color.config.uiColor );
	},

	'test langColor': function() {
		assert.areSame( 'fr', this.editors.langColor.config.language );
		assert.areSame( 'red', this.editors.langColor.config.uiColor );
	}
} );