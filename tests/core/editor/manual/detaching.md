@bender-ui: collapsed
@bender-tags: bug, 4.12.0, 3115
@bender-ckeditor-plugins: about,a11yhelp,basicstyles,bidi,blockquote,clipboard,colorbutton,colordialog,copyformatting,contextmenu,dialogadvtab,div,elementspath,enterkey,entities,filebrowser,find,flash,floatingspace,font,format,forms,horizontalrule,htmlwriter,image,iframe,indentlist,indentblock,justify,language,link,list,liststyle,magicline,maximize,newpage,pagebreak,pastefromword,pastetext,preview,print,removeformat,resize,save,selectall,showblocks,showborders,smiley,sourcearea,specialchar,stylescombo,tab,table,tableselection,tabletools,templates,toolbar,undo,uploadimage,wysiwygarea
@bender-include: ../_helpers/tools.js

## Chrome

1. Open Chrome with flags for precise memory testing. [Click for more details](https://github.com/ckeditor/ckeditor-dev/blob/memory-test/tests/core/memory/memory.md#testing)
1. Open developer tools, switch to `memory`.
1. Use buttons to do create-destroy cycles few times (3-4) for each editor type. Destroy editor **after** it is fully initialised.
1. Press `Collect Garbage`.
1. Press `Take heap snapshot`.
1. Perform create-destroy cycles for various editor types multiple times. Try to destroy editor **before** it is initialised.
1. Repeat steps 4. and 5.

### Expected
- No significant increase in snapshot memory size.
- No errors in console.

### Unexpected
- Errors are thrown in console.

## Other browsers

1. Open developer console.
1. Perform create-destroy cycles for various editor types multiple times.

### Expected
- No errors in console.

### Unexpected
- Errors are thrown in console.
