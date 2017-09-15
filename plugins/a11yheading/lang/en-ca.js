/**
* Copyright (c) 2017 University of Illinois - Jon Gunderson and Nicholas Hoyt. All rights reserved.
* For licensing, see LICENSE.md or http://ckeditor.com/license
*/
CKEDITOR.plugins.setLang( 'a11yheading', 'en-ca', {
  label:        'Heading',
  panelTitle:   'Select heading level',
  level_suffix: ' (Document title)',
  level_h1:     'Level 1',
  level_h2:     'Level 2',
  level_h3:     'Level 3',
  level_h4:     'Level 4',
  level_h5:     'Level 5',
  level_h6:     'Level 6',
  remove:       'Normal text',
  helpLabel:    'Help',

  helpFeatureLabel: 'Features',
  helpFeatureTitle: 'Heading Menu Features',
  helpFeatureItems: [
    'The Heading menu only enables the <strong>allowed</strong> heading levels, based on the position of the cursor in the document, to support proper nesting of headings.',

    'If the cursor is in a block of text that is not already a heading, selecting one of the enabled heading levels in the menu will convert the block to a heading of that level.',

    'If the cursor is on a heading, the menu item with a checkmark indicates its <strong>current level</strong>. Additional menu items that correspond to <strong> any allowed changes</strong> to the current level are enabled.',

    'When the cursor is on a heading, selecting the <strong>Remove format</strong> menu item, or selecting the <strong>current level</strong> menu item, converts the heading block to a plain text paragraph.'

  ],

  helpRuleLabel: 'Usage',
  helpRuleTitle: 'Using Heading Levels',
  helpRuleItems: [
    'Heading levels identify the structural relationships between sections of content in a document.',

    'Higher-level headings (Levels 1 and 2) identify the main topics of a document and lower-level headings (Levels 3, 4, 5 and 6) identify subsections of the document.',

    'A subsection is identified by using the next lower-level heading. For example, subsections of Level 2 headings use Level 3 headings, subsections of Level 3 headings use Level 4 headings, and so on to Level 6 headings.',

    'Break content into subsections when there are two or more ideas or concepts that correspond to the topics covered in the section. Use headings of the same level to label each subsection.',

    'Heading levels should <strong>never</strong> be used for inline visual styling of content (e.g. larger or smaller font size, bold or italic). Instead, use the "Inline Style" options.'
  ],

  helpImportanceLabel: 'Importance',
  helpImportanceTitle: 'Why Headings Are Important',
  helpImportanceItems: [
    'The proper use and nesting of heading levels improves the ability of all users to find and read information on a page.',

    'People read information more efficiently when content is broken up into digestable sections of information, with headings identifying each section and subsection of information.',

    'Headings used consistently and in meaningful ways improve Search Engine Optimization (SEO) for search engines like Google&trade;, Bing&trade;, DuckDuckGo&trade; and many others.',

    'When documents are created with properly nested headings, assistive technologies used by people with disabilities can easily provide quick navigation to the various sections of content.',

    'Headings can also be used to generate a table of contents, which can provide an overview of the document and quick navigation to sections of content.'
  ]

} );
