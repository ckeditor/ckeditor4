/* bender-tags: editor,dialog */
/* bender-ckeditor-plugins: wysiwygarea,toolbar,basicstyles,templates,format*/

( function() {
    'use strict';

    bender.test( {
        'Abort template insertion': function() {
            bender.editorBot.create( {
                startupData: '<p>Lorem ipsum</p>',
                config: {
                    templates_files: ['/tests//plugins/templates/_assets/test.js'],
                    templates: 'test'
                }
            }, function( bot ) {
                bot.dialog( 'templates', function( dialog ) {

                    dialog.getButton('cancel').click();
                    assert.areEqual( '<p>^Lorem ipsum</p>', bot.htmlWithSelection(), 'Editor data has not been altered.' );

                } );
            } );
        },

    } );
} )();
