#!/usr/bin/env bash

# Add escaped newline character at the end of each line
for name in gettingStarted headingHelp blockFormatHelp inlineStyleHelp linkHelp
do
  sed -e 's/$/\\n\\/' -e "s/'/\\\'/g" "${name}.md" > "${name}.tmp"
done

# sed -e 's/$/\\n\\/' gettingStarted.md > gettingStarted.tmp
# sed -e '/GETTINGSTARTED\\/r gettingStarted.tmp' setLang.js > setLang.0

# Insert the markdown content for each help topic
sed -e '/GETTINGSTARTED\\/ {'  -e 'r gettingStarted.tmp'  -e 'd' -e '}' setLang.js   > setLang-1.js
sed -e '/HEADINGHELP\\/ {'     -e 'r headingHelp.tmp'     -e 'd' -e '}' setLang-1.js > setLang-2.js
sed -e '/BLOCKFORMATHELP\\/ {' -e 'r blockFormatHelp.tmp' -e 'd' -e '}' setLang-2.js > setLang-3.js
sed -e '/INLINESTYLEHELP\\/ {' -e 'r inlineStyleHelp.tmp' -e 'd' -e '}' setLang-3.js > setLang-4.js
sed -e '/LINKHELP\\/ {'        -e 'r linkHelp.tmp'        -e 'd' -e '}' setLang-4.js > en.js

# Copy the end result to the lang directory
mv en.js ../../lang/

# Remove temp files
rm -f *.tmp setLang-?.js
