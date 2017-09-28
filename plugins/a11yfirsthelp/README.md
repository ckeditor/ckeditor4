# A11yFirst Help

This plug-in adds a dialog box to CKEditor explaning:

* The importance of accesibility, which can be customized to use your organizations name and a link to organization policies
* Features to support accessible authoring
* How the toolbar options and layout help accessible authoring
 

## Configuration Options

There is the abiity to customize the importance message to include the organizations name and a link to accessibility policies by adding a `a11yfirst` object to the configuration file.   

The `attyfirst` object has three options:
1. *organization*: name of the organization
1. *a11yPolicyLink*: URL to a link describing the organizations accessibility policies
1. *a11yPolicyLabel*: Text label for the URL to the policies

## Example A11yFirst help customization

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