#!/usr/bin/env bash

# Process the markdown files so that they can be included in
# the JavaScript language file as single-quoted strings:
# 1. Add new line and line continuation characters at the end of each line
# 2. Escape all single quote characters with backslash
for name in headingHelp listHelp inlineStyleHelp imageHelp linkHelp gettingStarted
do
  sed -e 's/$/\\n\\/' -e "s/'/\\\'/g" "${name}.md" > "${name}.tmp"
done

# Insert the modified markdown content for each help topic into the language file
sed -e '/HEADINGHELP\\/ {'     -e 'r headingHelp.tmp'     -e 'd' -e '}' setLang.js   > setLang-1.js
sed -e '/LISTHELP\\/ {'        -e 'r listHelp.tmp'        -e 'd' -e '}' setLang-1.js > setLang-2.js
sed -e '/INLINESTYLEHELP\\/ {' -e 'r inlineStyleHelp.tmp' -e 'd' -e '}' setLang-2.js > setLang-3.js
sed -e '/LINKHELP\\/ {'        -e 'r linkHelp.tmp'        -e 'd' -e '}' setLang-3.js > setLang-4.js
sed -e '/IMAGEHELP\\/ {'       -e 'r imageHelp.tmp'       -e 'd' -e '}' setLang-4.js > setLang-5.js
sed -e '/GETTINGSTARTED\\/ {'  -e 'r gettingStarted.tmp'  -e 'd' -e '}' setLang-5.js > en.js

# Move the end result to the lang folder
mv en.js ../../lang/

# Remove temp files
rm -f *.tmp setLang-?.js
