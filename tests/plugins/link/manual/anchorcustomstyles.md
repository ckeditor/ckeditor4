@bender-tags: 4.16.1, bug, link, 4728
@bender-ui: collapsed
@bender-ckeditor-plugins: link, toolbar, wysiwygarea, basicstyles, sourcearea, clipboard, enterkey, link, list, liststyle, tabletools, tableselection, undo, format, elementspath

### Scenario 1
1. Select `world!`.
1. Add an anchor.
1. Edit existing anchor and save it.

**Expected result:**
There is one anchor with changed `id` and `name`.

**Unexpected result:**
Anchors was doubled.

### Scenario 2
1. Select `world!` and add an anchor.
1. Select `Hello World!` and add an anchor.
1. Edit anchor and save it.


**Expected result:**
There is one anchor: `Hello World!`.

**Unexpected result:**
There are three anchors: One in `Hello` and doubled in `world!`.
