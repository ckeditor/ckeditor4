@bender-tags: 4.18.1, feature, 4052
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea,toolbar

**Note:** This test is intended for screen readers.

1. Focus the editor.

	**Expected** The screen reader announces that the user is inside an editable field.

Sample screen readers' outputs (essential part bolded):

* VoiceOver: "&lt;editor's name&gt; **edit text**. &lt;editor's content&gt;"
* JAWS: "&lt;frame's name&gt; frame, &lt;editor's name&gt; **edit, type and text**"
* NVDA: "&lt;application name&gt;, &lt;frame name&gt;, &lt;editor's name&gt; **document editable**"