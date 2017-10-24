/**
* Copyright (c) 2017 University of Illinois - Jon Gunderson and Nicholas Hoyt. All rights reserved.
* For licensing, see LICENSE.md or http://ckeditor.com/license
*/
CKEDITOR.plugins.setLang( 'a11yfirsthelp', 'en', {
  label:        'A11yFirst Help',
  panelTitle:   'Learn about A11yFirst features',
  keyboardShortcutsLabel: 'Keyboard Shortcuts',

  a11yFirstHelpLabel: 'A11yFirst Help: Content Accessibility',
  a11yFirstHelpTitle: 'Information to help authors understand how the A11yFirst features help \
  them make content more accessible to people with disabilites',

  aboutA11yFirst: {
    'menu':  'About A11yFirst',
    'label': 'About A11yFirst',
    'title': 'About A11yFirst',

    'no_org': '\
## About A11yFirst\n\
\n\
### Importance of Accessibility\n\
This organization has made a committment to accessibility, not only to comply with the \
Americans with Disabilities Act (ADA) and Section 504 requirements, but also because making \
sure everyone has equal access to the information in this website is the right thing \
to do.\n\n\
**You play an important part** in making sure this organization creates and maintains online \
content that is accessible. The changes to the editor toolbar are designed to help you create \
and maintain accessible content and learn more about accessibility.\n',

    'has_org':'\
## About A11yFirst\n\
\
### Importance of Accessibility\n\
The %org has made a committment to accessibility, not only to comply with the Americans with \
Disabilities Act (ADA) and Section 504 requirements, but also because making sure everyone has \
equal access to the information in this website is the right thing to do.\n\n\
**You play an important part** in making sure the %org creates and maintains online \
content that is accessible. The changes to the editor toolbar are designed to help you create \
and maintain accessible content and learn more about accessibility.\n',

    'policy_link':  '\n[%policy_label](%policy_url)\n',

    'content': '\
### What Is Accessibility?\n\
\n\
* Information should be perceivable and usable by everyone, including people\n\
with disabilities.\n\
\n\
* Documents should be organized and structured to make them as easy to read\n\
and understand as possible.\n\
\n\
* Accessible documents are compatible with assistive technologies and\n\
operating system accessibility features.\n\
\n\
### People with disabilities include people who:\n\
\n\
* cannot see very well or are blind;\n\
\n\
* cannot hear very well or are deaf;\n\
\n\
* have impaired motor skills or are paralyzed;\n\
\n\
* have learning or cognitive disabilities that affect their ability to read\n\
text or understand images.\n\
\n\
### A11yFirst Toolbar Features\n\
\n\
* **Heading**: Assists you in choosing the proper heading levels to make the\n\
heading structure in your document more meaningful to readers.\n\
\n\
* **Block Format**: Provides special formatting for blocks of text (e.g.\n\
paragraphs) within your document.\n\
\n\
* **Inline Style**: Provides styling to highlight or emphasize a word or group\n\
of words (i.e. characters) within a block of text.\n\
\n\
### Project Information\n\
\n\
Version: %version\n\
\n\
GitHub Repository: <a href="https://github.com/a11yfirst/plugins-dev" target="_resource">a11yfirst/plugins-dev</a>\n\
\n\
### Additional Resources\n\
\n\
* <a href="https://webaim.org/techniques/semanticstructure/" target="_resource">WebAIM: Semantic Structure</a>\n\
\n\
* <a href="http://accessibility.umn.edu/core-skills/headings" target="_resource">Accessible U: Headings</a>\n\
\n\
* <a href="https://webaim.org/techniques/hypertext/" target="_resource">WebAIM: Links and Hypertext</a>\n\
\n\
* <a href="http://accessibility.umn.edu/core-skills/hyperlinks" target="_resource">Accessible U: Links</a>\n\
\n\
* <a href="https://webaim.org/techniques/images/" target="_resource">WebAIM: Accessible Images</a>\n\
\n\
* <a href="http://accessibility.umn.edu/core-skills/alt-text" target="_resource">Accessible U: ALT Text</a>\n\
\n\
* <a href="http://diagramcenter.org/" target="_resource">Diagram Center: Image Description Guidelines</a>\n\
\n\
* <a href="https://webaim.org/techniques/tables/data" target="_resource">WebAIM: Creating Accessible Tables</a>\n\
\n\
'
  },

  headingHelp: {
    'menu':  'Heading',
    'label': 'Heading',
    'title': 'Heading Help',
    'content': '\
## Heading\n\
\n\
### How it works\n\
* The Heading menu only enables the **allowed** heading levels.\n\
\n\
* The cursor position relative to other headings in the document determines\n\
which heading levels are allowed.\n\
\n\
* To create a new heading, move the cursor to a text block and select an\n\
allowed heading level.\n\
\n\
* To convert a heading to normal text, move the cursor to a heading and select\n\
the *Normal text* option.\n\
\n\
### Why it\'s important\n\
* The purpose of a heading is to label the content that follows it.\n\
\n\
* The proper nesting of heading levels improves the ability of all users to\n\
find and read information on a page.\n\
\n\
* Headings used consistently and in meaningful ways improve Search Engine\n\
Optimization (SEO).\n\
\n\
* Properly nested headings enable people using assistive technologies to easily\n\
navigate to each section of a document.\n\
\n\
### More information\n\
* Documents are easier to read and understand when headings identify the topics\n\
they contain.\n\
\n\
* Headings make it easier to scan and find topics of interest within a document.\n\
\n\
* Heading levels identify the structural relationships between sections of\n\
content in a document.\n\
\n\
* Higher-level headings (Levels 1 and 2) identify the main topics of a document\n\
and lower-level headings (Levels 3, 4, 5 and 6) identify subsections of the\n\
document.\n\
\n\
* A subsection is identified by using the next lower-level heading. For\n\
example, subsections of Level 2 headings use Level 3 headings, subsections of\n\
Level 3 headings use Level 4 headings, and so on to Level 6 headings.\n\
\n\
* Break content into subsections when there are two or more ideas or concepts\n\
that correspond to the topics covered in the section. Use headings of the same\n\
level to label each subsection.\n\
\n\
* Heading levels should **never** be used for inline visual styling of content\n\
(e.g. larger or smaller font size, bold or italic). Instead, use the `Inline\n\
Style` options.\n\
'
  },

  blockFormatHelp: {
    'menu':  'Block Format',
    'label': 'Block Format',
    'title': 'Block Format Help',
    'content': '\
## Block Format\n\
\n\
### How it works\n\
\n\
* A block format can be applied by placing your cursor within a text block and\n\
selecting an item from the *Block Format* menu.\n\
\n\
* The baseline block format is *Normal text*, which is a simple paragraph.\n\
\n\
* To remove an active block format, either toggle it off by selecting it in the\n\
menu, or select the *Normal text* option from the menu.\n\
\n\
* Headings are a specialized type of block format used to label other text\n\
blocks, and are specified using the *Heading* menu.\n\
\n\
### Why it\'s important\n\
\n\
* Thinking in terms of blocks within your document is a higher-level approach\n\
to providing structure and semantics that are important for all users.\n\
\n\
* When block formats are used properly (e.g. *Preformatted text* or *Address*),\n\
they help users of assistive technologies understand the intended role of the\n\
content.\n\
\n\
* Visual styling for block formats is predetermined by your organization, thus\n\
freeing up your time and energy for concentrating on the structure and meaning\n\
of the content within your document.\n\
\n\
### More information\n\
\n\
* <a href="https://en.wikiversity.org/wiki/Technical_writing" target="_resource">Wikiversity: Technical writing</a>\n\
\n\
* <a href="https://en.wikipedia.org/wiki/Chunking_&lpar;writing&rpar;" target="_resource">Chunking (writing)</a>\n\
\n\
'
  },

  inlineStyleHelp: {
    'menu':  'Inline Style',
    'label': 'Inline Style',
    'title': 'Inline Style Help',
    'content': '\
## Inline Style\n\
\n\
### How it works\n\
\n\
* Inline styles have a different purpose than block formats. They are used\n\
at a lower level to highlight words or phrases within blocks of text.\n\
\n\
* To apply an inline style to existing text, select a range of text and then\n\
choose an option from the menu.\n\
\n\
* To apply inline styles to text you are about to type, choose an option from\n\
the menu and begin typing. The style will continue to be applied until you\n\
choose another option or move the cursor to a different point in the document.\n\
\n\
* Multiple inline styles can be applied to selected text.\n\
\n\
### Why it\'s important\n\
\n\
* Thinking in terms of block formats first, and then using inline styles to\n\
emphasize key words or phrases within text blocks, results in documents that\n\
are easier to read and understand.\n\
\n\
* Inline styles, when used properly, help screen reader users better understand\n\
the types and meanings of lower-level stylistic changes within blocks of text.\n\
\n\
* When block formats are considered as primary, and inline styles secondary,\n\
many visual styling decisions are already made by default.\n\
\n\
* When inline styles are used to change the styling of blocks of text, it\n\
makes the document more difficult to read and understand within the context of\n\
the website.\n\
\n\
* Using block formats and inline styles properly will make it easier for you to\n\
maintain stylistic consistency.\n\
\n\
\n\
'
  },

  linkHelp: {
    'menu':  'Link',
    'label': 'Link',
    'title': 'Link Help',
    'content' : '\
## Link\n\
\n\
### How it works\n\
\n\
* When the *Link* button is activated, the *Link* dialog is displayed with\n\
the focus set to the *URL* field. If a text selection was previously made,\n\
the *Display Text* field is populated with the selected text.\n\
\n\
* However, if you activate the *Link* button with an empty selection, the\n\
default behavior is to use the *URL* text as the *Display Text*. This is\n\
problematic because URLs are often not very descriptive.\n\
\n\
### About display text\n\
\n\
* The *Display Text* for a link should be descriptive, unique and start with\n\
keywords (NNG).\n\
\n\
* The *Display Text* must **not** be empty, since it results in the URL being\n\
used as the display text for the link.\n\
\n\
* The *Display Text* must **not** use ambiguous text, for example "Click Here"\n\
or "More".\n\
\n\
* The *Display Text* for links is like a sign post. It should tell you what\n\
you’ll find when you follow it (NOMENSA).\n\
\n\
* Be consistent: Links to the same URL should have the same *Display Text*.\n\
\n\
### Why it\'s important\n\
\n\
* Descriptive link text makes it easier for everyone to find and follow links\n\
on a page that are of interest to them.\n\
\n\
* Descriptive link text is especially important for people using screen\n\
readers, who typically only hear the display text spoken to them through speech\n\
synthesis and do not "see" the link in the context of other content on the page.\n\
\n\
* When URLs or ambiguous text are used as the display text for a link, it is\n\
impossible in many cases, and much more difficult in the remaining cases, for\n\
screen reader users to find and follow links of interest to them.\n\
\n\
### More information\n\
\n\
* <a href="https://www.nomensa.com/blog/2011/writing-good-link-text" target="_resource">NNG: Writing Hyperlinks: Salient, Descriptive, Start with Keyword</a>\n\
\n\
* <a href="https://www.nomensa.com/blog/2011/writing-good-link-text" target="_resource">NOMENSA: Writing good link text</a>\n\
\n\
* <a href="http://accessibility.umn.edu/core-skills/hyperlinks" target="_resource">Accessible U: Hyperlinks (Good ad Bad Examples)</a>\n\
'
  }
} );
