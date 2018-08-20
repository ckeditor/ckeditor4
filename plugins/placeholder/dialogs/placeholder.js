/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

/**
 * @fileOverview Definition for placeholder plugin dialog.
 *
 */

'use strict';

CKEDITOR.dialog.add('placeholder', function(editor) {
  var lang = editor.lang.placeholder,
    generalLabel = editor.lang.common.generalTab,
    validNameRegex = /^[^\[\]<>]+$/;

  return {
    title: lang.title,
    minWidth: 300,
    minHeight: 80,
    contents: [
      {
        id: 'info',
        label: generalLabel,
        title: generalLabel,
        style: 'border-top: 1px solid #eff1f3;padding-top:20px;',
        elements: [
          // Dialog window UI elements.
          {
            id: 'name',
            type: 'select',
            style: 'margin-top:0px;margin-bottom:10px;',
            label: lang.name,
            items: [
              ['Candidate Name', ' candidate.name '],
              ['Recruiter Name', ' recruiter.name ']
            ],
            required: true,
            validate: CKEDITOR.dialog.validate.regex(
              validNameRegex,
              lang.invalidName
            ),
            setup: function(widget) {
              if (!widget.data.name) {
                this.setValue(' candidate.name ');
              } else {
                this.setValue(widget.data.name);
              }
            },
            commit: function(widget) {
              widget.setData('name', this.getValue());
            }
          },
          {
            type: 'html',
            html: '<span class="placeholder-note">Note: Candidate name will only be picked when included in name field of csv or in the "To" field with candidate email eg- John Hue &lt;john.hue@gmail.com&gt;</span>',
            width: '30px'
          }
        ]
      }
    ]
  };
});
