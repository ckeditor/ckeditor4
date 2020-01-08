module.exports = {
	env: {
		browser: true,
		node: true
	},
	globals: {
		CKEDITOR: true
	},
	rules: {
		// Possible candidates:
		// 'camelcase': [ 'error' ],
		// Things that should be introduced step-by-step:
		// 'no-else-return': 'warn',
		// 'no-empty': 'warn',
		// 'no-implicit-coercion': [ 'warn', { 'boolean': false } ],
		// 'strict': [ 'error', 'safe' ],
		'array-bracket-spacing': [
			'error',
			'always'
		],
		'block-scoped-var': 'error',
		'brace-style': [
			'error',
			'1tbs'
		],
		'comma-style': [
			'error',
			'last'
		],
		'curly': [
			'error',
			'all'
		],
		'dot-notation': [
			'error',
			{
				'allowKeywords': false
			}
		],
		'eol-last': [
			'error',
			'always'
		],
		'indent': [
			1,
			'tab',
			{
				'SwitchCase': 1
			}
		],
		'key-spacing': [
			'error',
			{
				'beforeColon': false,
				'afterColon': true
			}
		],
		'keyword-spacing': [
			'error',
			{}
		],
		'linebreak-style': [
			'error',
			'unix'
		],
		'max-len': [
			'error',
			200
		],
		'new-cap': 0,
		'no-caller': 'error',
		'no-cond-assign': [
			'error',
			'except-parens'
		],
		'no-debugger': 'error',
		'no-duplicate-case': 'error',
		'no-empty': 0,
		'no-eq-null': 'error',
		'no-eval': 'error',
		'no-extra-semi': 'error',
		'no-invalid-this': 0,
		'no-irregular-whitespace': 'error',
		'no-loop-func': 'error',
		'no-mixed-spaces-and-tabs': 'error',
		'no-multi-spaces': [ 'error', {
			exceptions: {
				'Property': false
			}
		} ],
		'no-multi-str': 'error',
		'no-multiple-empty-lines': 'error',
		'no-spaced-func': 'error',
		'no-trailing-spaces': 'error',
		'no-undef': 'error',
		'no-unused-expressions': 'error',
		'no-unused-vars': 'error',
		'no-use-before-define': [
			'error',
			{
				'functions': false
			}
		],
		'no-whitespace-before-property': 'error',
		'no-with': 'error',
		'object-curly-spacing': [
			'error',
			'always'
		],
		'operator-linebreak': [
			'error',
			'after'
		],
		'padded-blocks': [
			'error',
			'never'
		],
		'quote-props': [
			'error',
			'as-needed'
		],
		'quotes': [
			'error',
			'single',
			{
				'avoidEscape': true
			}
		],
		'semi': [
			'error',
			'always'
		],
		'space-before-blocks': [
			'error',
			'always'
		],
		'space-before-function-paren': [
			'error',
			'never'
		],
		'space-in-parens': [
			'error',
			'always'
		],
		'space-infix-ops': 'error',
		'space-unary-ops': [
			'error',
			{
				'words': false,
				'nonwords': false
			}
		],
		'unicode-bom': [
			'error',
			'never'
		],
		'valid-typeof': 'error',
		'wrap-iife': [
			'error',
			'inside'
		],
		'yoda': [
			'error',
			'never'
		]
	}
};
