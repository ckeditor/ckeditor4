/* bender-tags: editor,clipboard */
/* bender-ckeditor-plugins: pastefromword */
/* bender-include: _helpers/resetforcefromword.js, ../clipboard/_helpers/pasting.js, ./generated/_helpers/pfwTools.js, ../pastetools/_helpers/ptTools.js */
/* global testScenario, ptTools */


'use strict';

var tests = testScenario( [ 0, 1, 0, 1, 1, 0 ], '%TEST_DIR%_assets/customfilter.js' );

ptTools.ignoreTestsOnMobiles( tests );

bender.test( tests );
