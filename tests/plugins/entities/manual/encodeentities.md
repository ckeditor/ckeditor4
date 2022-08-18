@bender-tags: bug, 4.20.0, 4941
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, entities, sourcearea

1. Open the source mode.

**Expected** There is only one HTML entity `&#128077;`.

**Unexpected** Two HTML entities appears: `&#55357;&#56397;`.

2. Close source area.

**Expected** 👍  entity is preserved.

**Unexpected** A surrogate pair appears ��.

