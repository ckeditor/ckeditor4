/**
* Copyright (c) 2017 University of Illinois - Jon Gunderson and Nicholas Hoyt. All rights reserved.
* For licensing, see LICENSE.md or http://ckeditor.com/license
*/
CKEDITOR.plugins.setLang( 'a11yfirsthelp', 'en', {
  label:        'A11yFirst Help',
  panelTitle:   'learn about A11yFirst features',
  headingHelpLabel:    'Heading Help',

  a11yFirstHelpLabel:   'A11yFirst Help: Content Accessibility',
  a11yFirstHelpTitle:   'Information to help authors understand how the A11yFirst features help them make content more accessible to people with disabilites',

  gettingStarted: {
    'menu': 'Getting Started',
    'label': 'Getting Started',
    'title': 'Getting Started with accessibility using the A11yFirst Toolbar',

    'no_org': '\
## Getting Started\n\
\n\
### Importance of Accessibility\n\
This organization has made a committment to accessibility, not only to comply with the American\'s with Disabilities Act(ADA) or Section 504 requirements, but also because it the right thing to do to make sure everyone has equal access to the information in this website.\n\n\
**You play an important part** in making sure this organization creates and maintains online content that is accessible.  The changes to the editor toolbar are designed to help you create and maintain accessible content and learn more about accessibility.\n',

    'has_org':'\
## Getting Started\n\
\
### Importance of Accessibility\n\  The %org has made a committment to accessibility, not only to comply with the American\'s with Disabilities Act(ADA) or Section 504 requirements, but also because it the right thing to do to make sure everyone has equal access to the information in this website.\n\n\
**You play an important part** in making sure the %org creates and maintains online content that is accessible.  The changes to the editor toolbar are designed to help you create and maintain accessible content and learn more about accessibility.\n',

    'policy_link':  '\n[%policy_label](%policy_url)\n',

    'content': '\
### What Is Accessibility?\n\n\
* Information should be perceivable and usable to everyone, including people with disabilities.\n\
* Information should be organized and structured for people understand the purpose of the content.\n\
* Compatibility with assistive technologies and operating system accessibility features.\n\n\
\n\
### People with disabilities include people who:\n\
* Cannot see very well or are blind.\n\
* Cannot hear very well or are deaf.\n\
* Have impaired motor skills or are paralyzed.\n\
* Have learning or cognitive disabilities that affects their ability to read text or understand images.\n\
\n\
### A11yFirst Toolbar Features\n\
* *Headings*: The Heading menu helps you keep the heading and sub-heading structure of your page propertly nested.\n\
* *Block Format*: Provides special styling for blocks of text (e.g paragraphs) information on a page.\n\
* *Inline Styles*: Provides styling to highlight or emphasize a word or group of words (e.g. characters) with in a block of text\n\
\n\
### Additional Resources\n\
* <a href="https://webaim.org/techniques/semanticstructure/" target="_resoruce">WebAIM: Semantic Structure</a>\n\
* <a href="https://webaim.org/techniques/hypertext/" target="_resoruce">WebAIM: Links and Hypertext</a>\n\
* <a href="https://webaim.org/techniques/images/" target="_resoruce">WebAIM: Accessible Images</a>\n\
* <a href="https://webaim.org/techniques/tables/data" target="_resoruce">WebAIM: Creating Accessible Tables</a>\n\
* <a href="http://diagramcenter.org/" target="_resoruce">Diagram Center: Image Description Guidelines</a>\n\
\n\
',
},

  // Heading help content

  headingHelp: {
    'menu': 'Heading Help',
    'label': 'Heading',
    'title': 'Headings identify the section and sub-section of the document, and provide a consistent styling of the structure of a document to help users understand the organization of the documents.',
    'content': '\
## Heading\n\
\n\
### Heading Menu Features\n\
* The Heading menu only enables the **allowed** heading levels, based on the position of the cursor in the document, to support proper nesting of headings.\n\
* If the cursor is in a block of text that is not already a heading, selecting one of the enabled heading levels in the menu will convert the block to a heading of that level.\n\
* If the cursor is on a heading, the menu item with a checkmark indicates its <strong>current level</strong>. Additional menu items that correspond to **any allowed changes** to the current level are enabled.\n\
* When the cursor is on a heading, selecting the **Remove format** menu item, or selecting the <strong>current level</strong> menu item, converts the heading block to a plain text paragraph.\n\
\n\
### Using Heading Levels\n\
* Heading levels identify the structural relationships between sections of content in a document.\n\
* Higher-level headings (Levels 1 and 2) identify the main topics of a document and lower-level headings (Levels 3, 4, 5 and 6) identify subsections of the document.\n\
* A subsection is identified by using the next lower-level heading. For example, subsections of Level 2 headings use Level 3 headings, subsections of Level 3 headings use Level 4 headings, and so on to Level 6 headings.\n\
* Break content into subsections when there are two or more ideas or concepts that correspond to the topics covered in the section. Use headings of the same level to label each subsection.\n\
* Heading levels should <strong>never</strong> be used for inline visual styling of content (e.g. larger or smaller font size, bold or italic). Instead, use the "Inline Style" options.\n\
\n\
### Why Headings Are Important\n\
* The proper use and nesting of heading levels improves the ability of all users to find and read information on a page.\n\
* Headings used consistently and in meaningful ways improve Search Engine Optimization (SEO) for search engines like Google&trade;, Bing&trade;, DuckDuckGo&trade; and many others.\n\
* When documents are created with properly nested headings, assistive technologies used by people with disabilities can easily provide quick navigation to the various sections of content.\n\
* Headings can also be used to generate a table of contents, which can provide an overview of the document and quick navigation to sections of content.\n\
  ',
},

  // Block Format help content

  blockFormatHelp: {
    'menu': 'Block Format Help',
    'label': 'Block Format',
    'title': 'Block format applies styles to an entire block of text, for example a paragraph or a list item.',
    'content': '\
## Block Format\n\
\n\
### Donec scelerisque sapien\n\
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam at nisi nisi. Maecenas vulputate aliquam eros vel auctor. Nam bibendum varius placerat. Etiam sit amet quam orci. Aenean accumsan ultrices turpis, sit amet convallis quam bibendum eu. Aliquam tempor, dui a malesuada dignissim, ipsum lacus tincidunt nunc, in aliquam leo libero sit amet libero.\n\
\n\
### Aliquam dictum ac\n\
* Fusce vitae iaculis lectus, quis pellentesque turpis.\n\
* Donec placerat condimentum interdum.\n\
* Um sit amet, hendreri morbi eu risus eget lacus ve.\n\
* C enim enim, interdum ac mauris eu, viverra tempor.\n\
\n\
',
},

  // Inline style help content

  inlineStyleHelp: {
    'menu': 'Inline Style Help',
    'label': 'Inline Style',
    'title': 'Inline style applies styles to an selected block of text, for example applying emphasis to a few words in a sentence',
    'content': '\
## Inline Style\n\
\n\
### Consectetur adipiscing elit\n\
Fusce vitae iaculis lectus, quis pellentesque turpis, consectetur adipiscing elit. enim enim, interdum ac mauris eu, viverra tempor. Maecenas vulputate aliquam eros vel auctor. Nam bibendum varius placerat. Etiam sit amet quam orci. Aenean accumsan hendreri morbi eu risus quam bibendum eu. Aliquam tempor, dui a malesuada dignissim, ipsum lacus tincidunt nunc, in aliquam leo libero sit amet libero.\n\
\n\
### Hendreri morbi\n\
* Nam bibendum varius placerat.\n\
* Aliquam tempor, dui a malesuada dignissim.\n\
* Urpis, sit amet convallis lacus ve.\n\
* C vulputate aliquam eros vel auctor.\n\
\n\
',
},

  // Link help content

  linkHelp: {
    'menu': 'Link Help',
    'label': 'Link',
    'title': 'Inline style applies styles to an selected block of text, for example applying emphasis to a few words in a sentence',
    'content' : '\
## Link\n\
\n\
### Vestibulum elementum\n\
Maecenas faucibus rhoncus ultricies. Etiam eget porttitor elit. Aenean congue rhoncus commodo. Nulla et condimentum nulla. Phasellus tempor ligula vel ipsum vehicula, a condimentum turpis sagittis. Nunc elementum arcu nec odio euismod, non sodales mi convallis. Nunc vitae libero nibh. Phasellus condimentum velit non porttitor pharetra. Sed accumsan elit nulla, ut pretium libero sollicitudin at. Morbi tempus interdum fermentum..\n\
\n\
### Maecenas lobortis\n\
* Aliquam non scelerisque nisl.\n\
* Aenean nec semper erat. Aliquam erat volutpat. \n\
* Proin mattis egestas libero a ultricies.\n\
* Aliquam hendrerit ultrices neque.\n\
\n\
',
},
} );
