/* bender-tags: editor,clipboard */
/* bender-ckeditor-plugins: pastefromword */
/* bender-include: _helpers/resetforcefromword.js, ../clipboard/_helpers/pasting.js, ./generated/_helpers/pfwTools.js */
/* global testScenario, pfwTools */

'use strict';

var tests = testScenario( [ 1, 0, 1, 0, 0 ], '%TEST_DIR%_assets/customfilter.js' );

pfwTools.ignoreTestsOnMobiles( tests );

bender.test( tests );
