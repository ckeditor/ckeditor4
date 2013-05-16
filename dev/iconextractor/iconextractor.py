# Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
# For licensing, see LICENSE.html or http://ckeditor.com/license
#
# A dummy script for extracting icons from the image. The image is assumed
# to be as follows:
#										Columns
#
#               0       1       2       3      ...
#             +---+---+---+---+---+---+---+---+---+-----------------------+
#         0   |   |   |   |   |   |   |   |   |   |   ...                 |
#             +---+   +---+   +---+   +---+   +---+                       |
#             |                                                           |
#             +---+   +---+   +---+   +---+   +---+   +---+   +---+       |
#         1   |   |   |   |   |   |   |   |   |   |   |   |   |   |       |
#             +---+   +---+   +---+   +---+   +---+   +---+   +---+       |
#  Rows       |                                                           |
#             +---+   +---+                                               |
#         2   |   |   |   |                                               |
#             +---+   +---+                                               |
#             |                                                           |
#       ...   | ...                                                       |
#             |                                                           |
#             +-----------------------------------------------------------+
#
#	The structure of the image should correspond with "names" with is a
#	multi-dimensional array. Each icon (and each gap) is determined by the "size" parameter.
#
#	Sample usage:
#		python iconextractor.py --image=/absolute/path/to/icons.png --dest=/absolute/path/to/dest --size=16
#
#	Requires:
#		Imagemagick suite (http://www.imagemagick.org/)

import os, sys, getopt
import Image
import shutil

# Defaults
size = 12
image = False
dest = False
tempPath = 'temp.png'

names = [
	[
		'source',
		'source-rtl',
		'save',
		'newpage',
		'newpage-rtl',
		'preview',
		'preview-rtl',
		'print',
		[ 'templates', 'templates-rtl' ],
		'docprops',
		'docprops-rtl'
	],
	[
		[ 'cut', 'cut-rtl' ],
		[ 'copy', 'copy-rtl' ],
		[ 'paste', 'paste-rtl' ],
		'pastetext',
		'pastetext-rtl',
		'pastefromword',
		'pastefromword-rtl',
		'undo',
		'undo-rtl',
		'redo',
		'redo-rtl'
	],
	[
		[ 'find', 'find-rtl' ],
		'replace',
		'selectall',
		[ 'scayt', 'spellchecker' ],
	],
	[
		'form',
		'checkbox',
		'radio',
		[ 'textfield', 'textfield-rtl' ],
		'textarea',
		'textarea-rtl',
		'select',
		'select-rtl',
		'button',
		'imagebutton',
		'hiddenfield'
	],
	[
		'bold',
		'italic',
		'underline',
		'strike',
		'superscript',
		'subscript',
		'removeformat'
	],
	[
		'numberedlist',
		'numberedlist-rtl',
		'bulletedlist',
		'bulletedlist-rtl',
		'outdent',
		'indent',
		'indent-rtl',
		'outdent-rtl',
		'blockquote',
		'creatediv',
		'justifyleft',
		'justifycenter',
		'justifyright',
		'justifyblock',
		'bidiltr',
		'bidirtl',
	],
	[
		'link',
		'unlink',
		'anchor',
		'anchor-rtl',
	],
	[
		'image',
		'flash',
		'table',
		'horizontalrule',
		'smiley',
		'specialchar',
		'pagebreak',
		'pagebreak-rtl',
		'iframe'
	],
	[
		'textcolor',
		'bgcolor'
	],
	[
		'maximize',
		'showblocks',
		'showblocks-rtl'
	],
	[
		'about',
		'uicolor',
		'placeholder'
	]
]

# Compare icons pixel by pixel.
def compareIcons( path1, path2 ):
	try:
		icon1 = Image.open( path1 )
		icon2 = Image.open( path2 )

		img1 = icon1.load()
		img2 = icon2.load()

		x = 0
		while x < size:
			y = 0
			while y < size:
				if img1[ x, y ] != img2[ x, y ]:
					return False
				y += 1
			x += 1

		return True
	except IOError:
		return False

def extractIcon( row, column, name ):
	x = 2 * column * size
	y = 2 * row * size

	targetPath = os.path.join( dest, name + '.png' )

	# Create temp icon file.
	os.system( 'convert {} -crop {}x{}+{}+{} +repage -sharpen 0x1.0 png32:{}'.format(
		image, size, size, x, y, tempPath )
	)

	# Compare temp icon file with the existing one (if any).
	# Update icon if it's different.
	if not compareIcons( tempPath, targetPath ):
		print '\tUpdating icon: ' + name + '.png ...'
		shutil.copy( tempPath, targetPath )


#-------------------------------------------------------------------------------

try:
	opts, args = getopt.getopt( sys.argv[ 1: ], '', [ 'image=', 'size=', 'dest=' ] )
except getopt.GetoptError, err:
	print 'python iconextractor.py --image=/absolute/path/to/icons.png --dest=/absolute/path/to/dest --size=16'
	sys.exit( 2 )
for opt, arg in opts:
	if opt == '--size':
		size = int( arg )
	elif opt == '--image':
		image = os.path.abspath( arg )
	elif opt == '--dest':
		dest = os.path.abspath( arg )

if not os.path.isfile( image ):
	print 'Image ' + image + ' not found. Aborting.'
	sys.exit( 2 )

if not dest:
	print 'No destination directory specified. Aborting.'
	sys.exit( 2 )

if not os.path.exists( dest ):
	print dest + ' directory doesn\'t exist. Creating.'
	os.makedirs( dest )

print 'Extracting icons...'

for rowindex, row in enumerate( names ):
	for column, icon in enumerate( row ):
		if isinstance( icon, str ):
			extractIcon( rowindex, column, icon )
		else:
			for subicon in icon:
				extractIcon( rowindex, column, subicon )

print 'Cleaning temp file...'

# Cleaning...
os.remove( tempPath )

print 'Extracting is done. Finishing.'