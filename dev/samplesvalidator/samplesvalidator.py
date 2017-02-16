# Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
# For licensing, see LICENSE.md or http://ckeditor.com/license

# Validates HTML files in a directory with W3C validator.
# To use this script simply call:
# python samplesvalidator.py
#
# By default this script validates samples directory ( 'project/samples' ).
# To validate some other directory an environmental variable must be set:
# export CKSAMPLESPATH=/home/me/some/path/to/be/validated
#
# To change validation service url you can also set an environmental variable:
# export CKSAMPLESURL='http://my.validation.servi.ce'
#
# To revert any kind of variable type:
# unset VARIABLE

import urllib, urllib2
import json
import os
import re

pathEnvVar = 'CKSAMPLESPATH'
urlEnvVar = 'CKSAMPLESURL'
scriptPath = os.path.dirname( os.path.realpath( __file__ ) )

# Let's move to the desired directory.
# \-> Look for ENV variable or use default samples path.
if pathEnvVar in os.environ:
	path = os.environ[ pathEnvVar ]
else:
	path = os.path.abspath( os.path.join( scriptPath, '../../samples/' ) )

os.chdir( path )

# Let's determine validator url.
# \-> Look for ENV variable or use default url.
url = os.environ[ urlEnvVar ] if urlEnvVar in os.environ else 'http://validator.w3.org/check'

# Find all HTML files in path.
directoryFiles = os.listdir( '.' )
htmlRegex = re.compile( '.html$', re.IGNORECASE )
htmlFiles = filter( htmlRegex.search, directoryFiles )

# Iterate over HTML files.
for index, fileName in enumerate( htmlFiles ):
	# Determine the full path of the file.
	filePath = os.path.join( path, fileName )

	print '(%(index)s/%(total)s) Validating %(filePath)s...' % {
		'filePath': filePath,
		'total': len( htmlFiles ),
		'index': index + 1
	}

	# Open the file.
	fileHandler = open( filePath, 'r' )

	# Prepare POST request.
	postData = {
		'fragment': fileHandler.read(),
		'charset': 'utf-8',
		'output': 'json'
	}

	# Close file.
	fileHandler.close()

	# Do the request. Keep the response.
	data = urllib.urlencode( postData )
	request = urllib2.Request( url, data )
	response = json.loads( urllib2.urlopen( request ).read() )

	# Print validation messages.
	for message in response[ 'messages' ]:
		message[ 'type' ] = message[ 'type' ].upper()
		message[ 'message' ] = message[ 'message' ].title()
		print '\t* %(type)s (Last line: %(lastLine)s, Last column: %(lastColumn)s): %(message)s' % message
