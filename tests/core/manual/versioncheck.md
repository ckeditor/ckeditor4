@bender-ui: collapsed
@bender-tags: feature, 4.22.0
@bender-ckeditor-plugins: wysiwygarea,toolbar,about

## Scenarios

* any version with "Drupal" switch on:
	* no notification & console log,
	* no ino in the "About" dialog
* any version with the config set explicitly to true:
	* notification & console log if the version is insecure,
	* info in the "About" dialog
* any version with the config set explicitly to false:
	* no notification & console log,
	* no info in the "About" dialog
* secure non-LTS version with not set config:
	* no notification & console log,
	* info in the "About" dialog about the latest version
* insecure non-LTS version with not set config:
	* notification & console log
	* info in the "About" dialog about the vulnerabilities and the latest version
* LTS versions with not set config:
	* no notification & console log,
	* no info in the "About" dialog

## Sample versions

* `4.21.0`,
* `4.3.126`
* `4.13.3 (Standard)`,
* `4.35.799 DEV`,
* `4.4.13-lts`,
* `4.22.0-lts DEV`,
* `4.12.9-lts (Full)`.
