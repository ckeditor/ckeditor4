# tabletoolstoolbar
A plugin for CKEditor 4, that add toolbar's groups with buttons relevant to [tabletools plugin's](http://ckeditor.com/addon/tabletools) table's context menu items actions.

![tabletoolstoolbar](images/tabletoolstoolbar.png)

## Toolbar's groups and buttons
- table - contains buttons for work with tables
  - ![tableinsert](icons/tableinsert.png) tableinsert - add new table
  - ![tabledelete](icons/tabledelete.png) tabledelete - delete current table
  - ![tableproperties](icons/tableproperties.png) tableproperties - show dialog with table properties
- tablerow - contains buttons for work with rows
  - ![tablerowinsertbefore](icons/tablerowinsertbefore.png) tablerowinsertbefore - add row above current cell
  - ![tablerowinsertafter](icons/tablerowinsertafter.png) tablerowinsertafter - add row under current cell
  - ![tablerowdelete](icons/tablerowdelete.png) tablerowdelete - delete row with current cell
- tablecolumn - contains buttons for work with columns
  - ![tablecolumninsertbefore](icons/tablecolumninsertbefore.png) tablecolumninsertbefore - add column before current cell
  - ![tablecolumninsertafter](icons/tablecolumninsertafter.png) tablecolumninsertafter - add column after current cell
  - ![tablecolumndelete](icons/tablecolumndelete.png) tablecolumndelete - delete column with current cell
- tablecell - contains buttons for work with cells (except merge/split)
  - ![tablecellinsertbefore](icons/tablecellinsertbefore.png) tablecellinsertbefore - add cell before current cell
  - ![tablecellinsertafter](icons/tablecellinsertafter.png) tablecellinsertafter - add cell after current cell
  - ![tablecelldelete](icons/tablecelldelete.png) tablecelldelete - delete current cell
  - ![tablecellproperties](icons/tablecellproperties.png) tablecellproperties - whow dialog with current cell properties
- tablecellmergesplit - contains buttons for cell merge/split
  - ![tablecellsmerge](icons/tablecellsmerge.png) tablecellsmerge - merge selected cells
  - ![tablecellmergeright](icons/tablecellmergeright.png) tablecellmergeright - merge current cell with right cell
  - ![tablecellmergedown](icons/tablecellmergedown.png) tablecellmergedown - merge current cell with down cell
  - ![tablecellsplithorizontal](icons/tablecellsplithorizontal.png) tablecellsplithorizontal - split horizontal current cell
  - ![tablecellsplitvertical](icons/tablecellsplitvertical.png) tablecellsplitvertical - split vertical current cell

## How to use

Add required toolbar's group to your toolbar's config:

```javascript
toolbarGroups : [
		{ name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
        ...
		{ name: 'others', groups: [ 'others' ] },
		'/',
		{ name: 'tables', groups: [ 'table','tablerow','tablecolumn', 'tablecell','tablecellmergesplit' ] }
	]
    });
```

For more info please read [official toolbar configuration guide](http://docs.ckeditor.com/#!/guide/dev_toolbar).

## Third-party components
Icons (some with partial changes)from ["Farm-Fresh Web Icons"](http://www.fatcow.com/free-icons).

## Licence
[MIT License](https://tldrlegal.com/license/mit-license).
