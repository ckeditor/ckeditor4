/*
Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.md or http://ckeditor.com/license
*/
CKEDITOR.plugins.setLang( 'heading', 'en-gb', {
  label:      'Heading',
  panelTitle: 'Select heading level',
  level_h1:   'Level 1',
  level_h2:   'Level 2',
  level_h3:   'Level 3',
  level_h4:   'Level 4',
  level_h5:   'Level 5',
  level_h6:   'Level 6',
  level_p:    'Remove format',
  helpLabel:  'Help',
  helpContent: '<h2 style="white-space: normal; font-weight: bold">Heading Menu Features</h2><ul style="margin-top: 0.25em;padding-left: 1em;"><li style="white-space: normal">The Heading menu shows the <strong>allowed</strong> heading levels based on the position of the cursor in the document to support proper nesting of headings.</li><li style="white-space: normal">If the cursor is on a heading it highlights the heading level in tthe menu and the allowed changes to the heading level.</li><li style="white-space: normal">The Outline option allows you to view an outline of the document, insert a table-of-contents (TOC) and check headings for proper nesting.</li></ul><h2 style="white-space: normal; font-weight: bold; margin-top: 1em;">Importance of Headings</h2><p style="margin-top: 0.25em; white-space: normal">The proper use and nesting of heading levels improves the ability to find and read information on a page.  People read information more efficiently when content is broken up into digestable sections of information, with headings identifying each section and sub-section of information.  Headings used consistently and in a meaningful way improve Search Engine Optimization (SEO) for search engines like Google&trade;, Bing&trade;, DuckDuckGo&trade; and many others.  Headings can also be used to generate a table of contents to provide an overview and quick navigation to sections of content.  Assistive technologies used by people with disabilities can also easily navigate a document with properly nested headings.</p><h2 style="white-space: normal; font-weight: bold; margin-top: 1em;">Heading Level Rules</h2><ol style="margin-top: 0.25em;padding-left: 1em;"><li style="white-space: normal">Heading levels identify the  structural relationships between sections of content in a document.</li><li style="white-space: normal">Higher level headings (e.g. level 1 and 2) idenifty the main topics of a document and lower level headings (e.g. level 3, 4, 5, and 6) identify sub-sections of the document.</li><li style="white-space: normal">A subsection is identified by using the next lower level heading, for example subsections of a level 2 heading use level 3 headings, subsections of level 3 headings use level 4 headings and so on to level 6 headings.</li><li style="white-space: normal">Subsections typically have at least two sections of content idenitfied with headings of the same level.</li><li style="white-space: normal">Heading levels should <strong>never</strong> be used for inline visual styling of content(e.g. larger or smaller font size or bolding of content), instead use the "Inline Styling" options.</li></ol>',
  outlineLabel: 'Heading Outline',
} );
