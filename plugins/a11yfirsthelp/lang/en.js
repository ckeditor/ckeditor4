/**
* Copyright (c) 2017 University of Illinois - Jon Gunderson and Nicholas Hoyt. All rights reserved.
* For licensing, see LICENSE.md or http://ckeditor.com/license
*/
CKEDITOR.plugins.setLang( 'a11yfirsthelp', 'en', {
  label:        'A11yFirst Help',
  panelTitle:   'Learn about A11yFirst Toolbar',
  headingHelpLabel:    'Heading Help',

  a11yFirstHelpLabel:   'Accessibility Help',
  a11yFirstHelpTitle:   'Information to help authors understand how the A11yFirst features help them make content more accessible to people with disabilites',

  gettingStartedLabel: 'Getting Started',
  gettingStartedTitle: 'Getting Started with accessibility using the A11yFirst Toolbar',

  gettingStartedButtonLabel: 'Getting Started',

  gettingStartedImportanceHeading: 'Importance of Accessibility',
  gettingStartedImportanceContent: 'This organization has made a committment to accessibility, not only to comply with the American\'s with Disabilities Act(ADA) or Section 504 requirements, but also because it the right thing to do to make sure everyone has equal access to the information in this website.\n<strong>You play an important part</strong> in making sure this organization creates and maintains online content that is accessible.  The changes to the editor toolbar are designed to help you create and maintain accessible content and learn more about accessibility.',

  gettingStartedImportanceOrganizationContent: 'The %org has made a committment to accessibility, not only to comply with the American\'s with Disabilities Act(ADA) or Section 504 requirements, but also because it the right thing to do to make sure everyone has equal access to the information in this website.\n<strong>You play an important part</strong> in making sure the %org creates and maintains online content that is accessible.  The changes to the editor toolbar are designed to help you create and maintain accessible content and learn more about accessibility.',

  gettingStartedWhatIsHeading: 'What Is Accessibility?',
  gettingStartedWhatIsContent: ['Information should be perceivable and usable to everyone, including people with disabilities',
'Information should be organized and structured for people understand the purpose of the content.',  
'Compatibility with assistive technologies and operating system accessibility features.'],

  gettingStartedPeopleWithHeading: 'People with disabilities include people who:',
  gettingStartedPeopleWithContent: ['Cannot see very well or are blind.',
  'Cannot hear very well or are deaf.',
  'Have impaired motor skills or are paralyzed.',
  'Have learning or cognitive disabilities that affects their ability to read text or understand images.'],


  gettingStartedFeaturesHeading: 'A11yFirst Toolbar Features',
  gettingStartedFeaturesContent: [
    '<strong>Headings</strong>: The Heading menu helps you keep the heading and sub-heding structure of your page propertly nested.',
    '<strong>Block Format</strong>: Provides special styling for certain blocks of information on a page.',
    '<strong>Inline Styles</strong>: Provides styling to highlight or emphasize a word or group of words with in a block of text'
  ],     

  gettingStartedResourcesHeading: 'Additional Resources',
  gettingStartedResourcesContent: [
    '<a target="_reference" href="http://www.w3.org/WAI" style="text-decoration: underline">W3C Web Accessibility Initiative</a>',
    'Item 2',
    'Item 3',
    'Item 4',
    'Item 5'
  ],

  // Heading help content

  headingHelpLabel: 'Heading Help',
  headingHelpTitle: 'Headings identify the section and sub-section of the document, and provide a consistent styling of the structure of a document to help users understand the organization of the documents.',

  headingHelpButtonLabel: 'Heading',

  headingHelpFeatureHeading: 'Heading Menu Features',
  headingHelpFeatureContent: [
    'The Heading menu only enables the <strong>allowed</strong> heading levels, based on the position of the cursor in the document, to support proper nesting of headings.',

    'If the cursor is in a block of text that is not already a heading, selecting one of the enabled heading levels in the menu will convert the block to a heading of that level.',

    'If the cursor is on a heading, the menu item with a checkmark indicates its <strong>current level</strong>. Additional menu items that correspond to <strong> any allowed changes</strong> to the current level are enabled.',

    'When the cursor is on a heading, selecting the <strong>Remove format</strong> menu item, or selecting the <strong>current level</strong> menu item, converts the heading block to a plain text paragraph.'

  ],

  headingHelpRuleHeading: 'Using Heading Levels',
  headingHelpRuleContent: [
    'Heading levels identify the structural relationships between sections of content in a document.',

    'Higher-level headings (Levels 1 and 2) identify the main topics of a document and lower-level headings (Levels 3, 4, 5 and 6) identify subsections of the document.',

    'A subsection is identified by using the next lower-level heading. For example, subsections of Level 2 headings use Level 3 headings, subsections of Level 3 headings use Level 4 headings, and so on to Level 6 headings.',

    'Break content into subsections when there are two or more ideas or concepts that correspond to the topics covered in the section. Use headings of the same level to label each subsection.',

    'Heading levels should <strong>never</strong> be used for inline visual styling of content (e.g. larger or smaller font size, bold or italic). Instead, use the "Inline Style" options.'
  ],

  headingHelpImportanceHeading: 'Why Headings Are Important',
  headingHelpImportanceContent: [
    'The proper use and nesting of heading levels improves the ability of all users to find and read information on a page.',

    'People read information more efficiently when content is broken up into digestable sections of information, with headings identifying each section and subsection of information.',

    'Headings used consistently and in meaningful ways improve Search Engine Optimization (SEO) for search engines like Google&trade;, Bing&trade;, DuckDuckGo&trade; and many others.',

    'When documents are created with properly nested headings, assistive technologies used by people with disabilities can easily provide quick navigation to the various sections of content.',

    'Headings can also be used to generate a table of contents, which can provide an overview of the document and quick navigation to sections of content.'
  ],

  // Block Format help content

  blockFormatHelpButtonLabel: 'Block Format',

  blockFormatHelpLabel: 'Block Format Help',
  blockFormatHelpTitle: 'Block format applies styles to an entire block of text, for example a paragraph or a list item.',

  blockFormatHelp1Heading: 'Donec scelerisque sapien',
  blockFormatHelp1Content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam at nisi nisi. Maecenas vulputate aliquam eros vel auctor. Nam bibendum varius placerat. Etiam sit amet quam orci. Aenean accumsan ultrices turpis, sit amet convallis quam bibendum eu. Aliquam tempor, dui a malesuada dignissim, ipsum lacus tincidunt nunc, in aliquam leo libero sit amet libero.',

  blockFormatHelp2Heading: 'Aliquam dictum ac',
  blockFormatHelp2Content: [
    'Fusce vitae iaculis lectus, quis pellentesque turpis',
    'Donec placerat condimentum interdum. ',
    'Um sit amet, hendreri morbi eu risus eget lacus ve. ',
    'C enim enim, interdum ac mauris eu, viverra tempor.',
    'Donec scelerisque sapien sit amet ultrices consectetur.'
  ],

  // Inline Style help content

  inlineStyleHelpButtonLabel: 'Inline Style',

  inlineStyleHelpLabel: 'Inline Style Help',
  inlineStyleHelpTitle: 'Inline style applies styles to an selected block of text, for example applying emphasis to a few words in a sentence.',

  inlineStyleHelp1Heading: 'Donec scelerisque sapien',
  inlineStyleHelp1Content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam at nisi nisi. Maecenas vulputate aliquam eros vel auctor. Nam bibendum varius placerat. Etiam sit amet quam orci. Aenean accumsan ultrices turpis, sit amet convallis quam bibendum eu. Aliquam tempor, dui a malesuada dignissim, ipsum lacus tincidunt nunc, in aliquam leo libero sit amet libero.',

  inlineStyleHelp2Heading: 'Aliquam dictum ac',
  inlineStyleHelp2Content: [
    'Fusce vitae iaculis lectus, quis pellentesque turpis',
    'Donec placerat condimentum interdum. ',
    'Um sit amet, hendreri morbi eu risus eget lacus ve. ',
    'C enim enim, interdum ac mauris eu, viverra tempor.',
    'Donec scelerisque sapien sit amet ultrices consectetur.'
  ],

  // Link help content

  linkHelpButtonLabel: 'Link',

  linkHelpLabel: 'Link Help',
  linkHelpTitle: 'The text used to identify a linke is very important to all users, but especially to people using screen readers and some types of learning disabilies.',

  linkHelp1Heading: 'Donec scelerisque sapien',
  linkHelp1Content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam at nisi nisi. Maecenas vulputate aliquam eros vel auctor. Nam bibendum varius placerat. Etiam sit amet quam orci. Aenean accumsan ultrices turpis, sit amet convallis quam bibendum eu. Aliquam tempor, dui a malesuada dignissim, ipsum lacus tincidunt nunc, in aliquam leo libero sit amet libero.',

  linkHelp2Heading: 'Aliquam dictum ac',
  linkHelp2Content: [
    'Fusce vitae iaculis lectus, quis pellentesque turpis',
    'Donec placerat condimentum interdum. ',
    'Um sit amet, hendreri morbi eu risus eget lacus ve. ',
    'C enim enim, interdum ac mauris eu, viverra tempor.',
    'Donec scelerisque sapien sit amet ultrices consectetur.'
  ]      
} );
