var BENDER_CONFIG = {
	"path": "/Users/krzysztofkrzton/Workspace/CKSource/CKEditor4/ckeditor/ckeditor-dev/.bender/bender.js",
	"applications": {
		"ckeditor": {
			"path": ".",
			"files": [
				"ckeditor.js"
			]
		}
	},
	"framework": "yui",
	"privateKey": "tests/_benderjs/ssl/key.pem",
	"certificate": "tests/_benderjs/ssl/cert.pem",
	"coverage": {
		"paths": [
			"adapters/**/*",
			"core/**/*",
			"dev/**/*",
			"lang/**/*",
			"plugins/**/*",
			"samples/**/*",
			"*.js"
		],
		"options": {
			"checkTrackerVar": true
		}
	},
	"plugins": [
		"benderjs-coverage",
		"benderjs-yui",
		"benderjs-sinon",
		"benderjs-jquery",
		"tests/_benderjs/ckeditor",
		"benderjs-yui-beautified"
	],
	"tests": {
		"Adapters": {
			"applications": [
				"ckeditor"
			],
			"basePath": "tests/",
			"paths": [
				"adapters/**",
				"!**/_*/**"
			],
			"jQuery": [
				"1.8.3",
				"1.11.1",
				"2.1.1"
			],
			"include": [
				"tests/adapters/**"
			],
			"exclude": [
				"**/_*/**"
			],
			"basePaths": [
				"tests/"
			]
		},
		"Core": {
			"applications": [
				"ckeditor"
			],
			"basePath": "tests/",
			"paths": [
				"core/**",
				"!**/_*/**"
			],
			"include": [
				"tests/core/**"
			],
			"exclude": [
				"**/_*/**"
			],
			"basePaths": [
				"tests/"
			]
		},
		"Plugins": {
			"applications": [
				"ckeditor"
			],
			"basePath": "tests/",
			"paths": [
				"plugins/**",
				"!**/_*/**"
			],
			"include": [
				"tests/plugins/**"
			],
			"exclude": [
				"**/_*/**"
			],
			"basePaths": [
				"tests/"
			]
		},
		"External Plugins": {
			"applications": [
				"ckeditor"
			],
			"basePath": "plugins/",
			"paths": [
				"*/tests/**",
				"!**/_*/**"
			],
			"include": [
				"plugins/*/tests/**"
			],
			"exclude": [
				"**/_*/**"
			],
			"basePaths": [
				"plugins/"
			]
		},
		"Tickets": {
			"applications": [
				"ckeditor"
			],
			"basePath": "tests/",
			"paths": [
				"tickets/**",
				"!**/_*/**"
			],
			"include": [
				"tests/tickets/**"
			],
			"exclude": [
				"**/_*/**"
			],
			"basePaths": [
				"tests/"
			]
		},
		"Utils": {
			"applications": [
				"ckeditor"
			],
			"basePath": "tests/",
			"paths": [
				"utils/**",
				"!**/_*/**"
			],
			"include": [
				"tests/utils/**"
			],
			"exclude": [
				"**/_*/**"
			],
			"basePaths": [
				"tests/"
			]
		}
	},
	"yui-beautified": {
		"indent_with_tabs": true,
		"wrap_line_length": 0,
		"unformatted": "none",
		"indent_inner_html": true,
		"preserve_newlines": true,
		"max_preserve_newlines": 0,
		"indent_handlebars": false,
		"end_with_newline": true,
		"extra_liners": "head, body, div, p, /html"
	},
	"mathJaxLibPath": "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=TeX-AMS_HTML",
	"browsers": [
		"ie8",
		"ie9",
		"ie10",
		"ie11",
		"edge",
		"firefox",
		"safari",
		"chrome",
		"opera"
	],
	"captureTimeout": 10000,
	"defermentTimeout": 5000,
	"manualBrowsers": [
		"ie8",
		"ie9",
		"ie10",
		"ie11",
		"edge",
		"firefox",
		"safari",
		"chrome",
		"opera"
	],
	"manualTestTimeout": 60000,
	"secure": false,
	"slowAvgThreshold": 200,
	"slowThreshold": 30000,
	"startBrowser": "phantomjs",
	"testRetries": 3,
	"testTimeout": 60000,
	"jQueryDefault": "1.11.1",
	"port": 1030,
	"hostname": "0.0.0.0",
	"address": "http://0.0.0.0:1030"
};
