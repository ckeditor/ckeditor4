@bender-tags: find, tc, 4.7.1, 16980
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea,a11yhelp,pastetext

### Scenario:

1. Open Accessibility Help `ALT+0`.
2. Scroll down to `Commands` section.

### Expected:
1. Mac users should see:


Chrome, Firefox:
```
Paste as plain text
    Press Shift+Command+V
```

Safari:
```
Paste as plain text
    Press Alt+Shift+Command+V
```

2. Windows users should see:

IE:
```
Paste as plain text
    Press Shift+Ctrl+V
```

Edge:
```
Paste as plain text
    Press Shift+Ctrl+V, followed by Ctrl+V
```

