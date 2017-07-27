/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 *
 * Heavily modified for TAO usage
 * @author Christophe Noël <christophe@taotesting.com>
 */

CKEDITOR.plugins.add( 'taoqtitable', {
    requires: 'dialog',
    // jscs:disable maximumLineLength
    lang: 'af,ar,bg,bn,bs,ca,cs,cy,da,de,el,en,en-au,en-ca,en-gb,eo,es,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn', // %REMOVE_LINE_CORE%
    // jscs:enable maximumLineLength
    icons: this.path + 'images/taoqtitable.png',
    hidpi: false,
    init: function( editor ) {
        var registerButton = true;

        // do not register the button if the CK instance is directly bound to a table, so we don't allow nested tables creation
        if (editor.element.is('table')) {
            registerButton = false;
        } else {
            // do not register the plugin if the CK instance is not bound to a dom element allowing block content
            if (editor.blockless) {
                return;
            }
        }

        var lang = editor.lang.table;

        editor.addCommand( 'taoqtitable', new CKEDITOR.dialogCommand( 'taoqtitable', {
            context: 'table',
            allowedContent: 'table[summary];' +
                'caption tbody thead tfoot;' +
                'th td tr[scope];' +
                ( editor.plugins.dialogadvtab ? 'table' + editor.plugins.dialogadvtab.allowedContent() : '' ),
            requiredContent: 'table'
        } ) );

        editor.addCommand( 'taoqtitableProperties', new CKEDITOR.dialogCommand( 'taoqtitableProperties' ) );

        if (registerButton) {
            editor.ui.addButton && editor.ui.addButton( 'TaoQtiTable', {
                label: lang.toolbar,
                command: 'taoqtitable',
                toolbar: 'insert,30',
                icon: this.path + 'images/taoqtitable.png'
            } );
        }

        CKEDITOR.dialog.add( 'taoqtitable', this.path + 'dialogs/taoqtitable.js' );
        CKEDITOR.dialog.add( 'taoqtitableProperties', this.path + 'dialogs/taoqtitable.js' );

        editor.on( 'doubleclick', function( evt ) {
            if ( editor.element.is( 'table' ) )
                evt.data.dialog = 'taoqtitableProperties';
        } );
    }
} );
