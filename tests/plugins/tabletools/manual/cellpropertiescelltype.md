@bender-tags: 4.20.0, 5084, feature
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, table, tabletools, sourcearea

**Note:** Please verify cell structure via toggling `Source` mode.

1. Right click at any cell, and select `Cell` -> `Cell Properties`.

**Expected** Cell has `Data` type.

2. Change cell type to `Header`.

**Expected** Cell has `th` type and do not have `scope` attribute.

3. Right click at recent cell, and select `Cell` -> `Cell Properties`.

**Expected** Cell has `Header` type.

4. Change cell type to `Column Header`.

**Expected** Cell has `th` type and `scope` attribute set on `col`.

5. Right click at recent cell, and select `Cell` -> `Cell Properties`.

**Expected** Cell has `Column Header` type.

6. Change cell type to `Row Header`.

**Expected** Cell has `th` type and `scope` attribute set on `row`.

7. Right click at recent cell, and select `Cell` -> `Cell Properties`.

**Expected** Cell has `Row Header` type.

8. Change cell type to `Data`.

**Expected** Cell has `td` type and do not have `scope` attribute.

9. Play with cell types and verify if they type matches expectations from the above.
