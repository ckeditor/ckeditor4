# A11yFirst Help

This plug-in adds a dialog box to CKEditor explaning:

* The importance of accesibility, which can be customized to use your organizations name and a link to organization policies
* Features to support accessible authoring
* How the toolbar options and layout help accessible authoring
 

## Configuration Options

There is the abiity to customize the importance message to include the organizations name and a link to accessibility policies by adding a `a11yfirst` object to the configuration file.   

The `a11yfirst` object has three options:
* `organization`: *name of the organization* 
* `a11yPolicyLink`: *URL to a resource describing the organizations accessibility policies*
* `a11yPolicyLabel`: *Text label for the URL*

If the `a11yfirst` option is not present a generic importance message is used.

## Example Configuration

```
CKEDITOR.replace('editor', {
  a11yfirst: {
    organization: 'library',
    a11yPolicyLink: 'http://guides.library.illinois.edu/usersdisabilities/',
    a11yPolicyLabel: 'Information for Users With Disabilities',
  },
  headings: 'h1:h4',
  oneLevel1: true,
  height: 480,
  skin: 'a11yfirst',
  startupFocus: true,
  toolbar: [
    { name: 'heading',      items: [ 'Heading' ] },
    { name: 'list',         items: [ 'NumberedList', 'BulletedList', 'Indent', 'Outdent' ] },

  .....
  
```