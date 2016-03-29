@bender-tags: 12240, tc, 4.5.8
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, colorbutton, floatingspace

Make sure the dev console is open during testing so any possible errors or warnings can be noticed.

### Scenario 1:

1. Click *Text Color* button in Editor 1.
	* **Expected**: There is no *Automatic* option.
1. Click *Background Color* button in Editor 1.
	* **Expected**: There is no *Automatic* option.

### Scenario 2:

1. Click *Text Color* button in Editor 2.
	* **Expected**: There is *Automatic* option.
1. Click *Background Color* button in Editor 2.
	* **Expected**: There is *Automatic* option.
