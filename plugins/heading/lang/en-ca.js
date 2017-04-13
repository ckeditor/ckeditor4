/*
Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.md or http://ckeditor.com/license
*/
CKEDITOR.plugins.setLang( 'heading', 'en-ca', {
  label:      'Heading',
  panelTitle: 'Select heading level',
  level_h1:   'Level 1',
  level_h2:   'Level 2',
  level_h3:   'Level 3',
  level_h4:   'Level 4',
  level_h5:   'Level 5',
  level_h6:   'Level 6',
  remove:     'Remove format',
  helpLabel:  'Help',

  helpFeatureLabel:  'Features',
  helpFeatureTitle:  'Heading Menu Features',
  helpFeatureItems: ['The Heading menu shows the <strong>allowed</strong> heading levels based on the position of the cursor in the document to support proper nesting of headings.',
    'If the cursor is on a heading, the menu highlights the current level and lists the allowed changes to that level.',
    'The Outline option allows you to view a headings-based outline of the document, insert the outline as a table of contents and check all headings for proper nesting.'
  ],

  helpRuleLabel:  'Usage',
  helpRuleTitle:  'Using Heading Levels',
  helpRuleItems: [
    'Heading levels identify the  structural relationships between sections of content in a document.',
    ' Higher level headings (e.g. level 1 and 2) identifty the main topics of a document and lower level headings (e.g. level 3, 4, 5 and 6) identify subsections of the document.',
    'A subsection is identified by using the next lower level heading, for example subsections of a level 2 heading use level 3 headings, subsections of level 3 headings use level 4 headings and so on to level 6 headings.',
    'Break content into subsections when there are two or more ideas or concepts that explain the topic of the section.  Use headings of the same level to label each subsection.',
    'Heading levels should <strong>never</strong> be used for inline visual styling of content (e.g. larger or smaller font size, bold or italic). Instead use the "Inline Styling" options.'
  ],

  helpImportanceLabel:  'Importance',
  helpImportanceTitle:  'Why Headings Are Important',
  helpImportanceItems: ['The proper use and nesting of heading levels improves the ability to find and read information on a page.',
    'People read information more efficiently when content is broken up into digestable sections of information, with headings identifying each section and sub-section of information.',
    'Headings used consistently and in a meaningful way improve Search Engine Optimization (SEO) for search engines like Google&trade;, Bing&trade;, DuckDuckGo&trade; and many others.',
    'Headings can also be used to generate a table of contents to provide an overview and quick navigation to sections of content.',
    'Assistive technologies used by people with disabilities can also easily navigate a document with properly nested headings.'
  ],

  outlineLabel: 'Outline / TOC',
  includeLevelLabel: 'Include the following heading levels a in table of contents',
  includeLevel2: 'Level 2',
  includeLevel3: 'Level 2 and 3',
  includeLevel4: 'Level 2, 3 and 4',
  includeLevel5: 'Level 2, 3, 4 and 5',
  includeLevel6: 'Level 2, 3, 4, 5 and 6'
});
