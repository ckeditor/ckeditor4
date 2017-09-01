/*
Copyright (c) 2017, University of Illinois - Nicholas Hoyt and Jon Gunderson. All rights reserved.
For licensing, see LICENSE.md or http://ckeditor.com/license
*/
CKEDITOR.plugins.setLang( 'blockformat', 'en', {
  label:      'Format',
  panelTitle: 'Select block format',
  blockquoteLabel: 'Block quotation',
  remove:     'Normal text',
  pre:        'Preformatted (preserves spaces and line breaks)',
  address:    'Address (e.g. street, city, room information..)',
  helpLabel:  'Help',

  featuresTitle: 'Format Menu Features',
  featuresItems: [
    'The Format menu provides a way to change the styling of a block of text from a paragraph style (e.g. Normal Text) to a style that represents the semantics of the content.',

    'The <strong>Blockquote</strong> option provides a way to identify and style quotations in a standardized to make quotes more consistly styles across pages and accessible to users of assisitve technologies.',

    'The <strong>Preformatted</strong> option provides a way to preserve white space and line breaks for blocks of text representing like programming languages or a sequence of command line options.',

    'The <strong>Address</strong> option provides a way to identify and style text text associated with a street address in a standardized to make address infromation more consistly styles across pages and accessible to users of assisitve technologies.'

  ]

} );
