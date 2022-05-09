@bender-tags: 4.19.0, bug, 1904
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea,toolbar

**Note:** This test is intended for screen readers.

1. Focus the first editor.

	**Expected** The screen reader announces the editor is readonly.
1. Repeat the test for the second editor.

Sample screen readers' outputs (essential part bolded):

* VoiceOver: "&lt;editor's name&gt; **clickable, text**. &lt;editor's content&gt;"
* JAWS: "&lt;editor's name&gt; **readonly** edit/type and text"
* NVDA: "&lt;application name&gt;, &lt;editor's name&gt; **edit readonly**"
