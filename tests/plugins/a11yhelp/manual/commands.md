@bender-tags: find, tc, 4.7.1, 16980
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea,sourcearea,htmlwriter,entities,toolbar,elementspath,undo,clipboard,format,basicstyles,autolink,autoembed,link,a11yhelp,pastetext

### Scenario:

1. Open Accessibility Help `ALT+0`.
2. Scroll down to `Commands` section.

### Expected:
1. Mac users should see `Command` instead of `Ctrl` in instructions:

```
Undo command
    Press Command+Z
Redo command
    Press Shift+Command+Z
Bold command
    Press Command+B
Italic command
    Press Command+I
Underline command
    Press Command+U
Link command
    Press Command+L
Accessibility Help
    Press Alt+0
Paste as plain text
    Press Shift+Command+V
```

2. Windows users should see `Ctrl` instead of `Command` in instructions:

```
Undo command
    Press Ctrl+Z
Redo command
    Press Shift+Ctrl+Z
Bold command
    Press Ctrl+B
Italic command
    Press Ctrl+I
Underline command
    Press Ctrl+U
Link command
    Press Ctrl+L
Accessibility Help
    Press Alt+0
Paste as plain text
    Press Shift+Ctrl+V
```

