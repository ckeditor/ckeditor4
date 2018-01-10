# A11yFirst Help

This plug-in adds a dialog box to CKEditor explaining:

* The importance of accessibility, which can be customized to use your
  organization's name and a link to its accessibility policies
* Features to support accessible authoring
* How the toolbar options and layout help accessible authoring

## Configuration Options

You can customize the importance message to include your organization's
name and a link to its accessibility policies by adding an `a11yfirst`
object to the CKEditor configuration file.

The `a11yfirst` object has three options:
* `organization`: *name of the organization*
* `a11yPolicyLink`: *URL to a resource describing the organization's
  accessibility policies*
* `a11yPolicyLabel`: *Text label for the URL*

If the `a11yfirst` option is not present, a generic importance message
is used.

## Example Configuration

```
CKEDITOR.replace('editor', {
  a11yfirst: {
    organization: 'University of Illinois Library',
    a11yPolicyLink: 'http://guides.library.illinois.edu/usersdisabilities/',
    a11yPolicyLabel: 'Information for Users With Disabilities',
  },
  headings: 'h1:h4',
  oneLevel1: true
}
```
