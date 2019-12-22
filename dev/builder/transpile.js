const { readdirSync, readFileSync, statSync, existsSync } = require( 'fs' );
const { resolve: resolvePath } = require( 'path' );
const chalk = require( 'chalk' );
const { rollup } = require( 'rollup' );
const nodeResolve = require( '@rollup/plugin-node-resolve' );
const commonJS = require( 'rollup-plugin-commonjs' );
const babel = require( 'rollup-plugin-babel' );
const CKE4_PATH = getCKE4Path( process.cwd() );

console.log( chalk`{green Transpiling source code…}` );

Promise.all( [ ...transpileCore( CKE4_PATH ), ...transpilePlugins( CKE4_PATH ) ] ).then( () => {
	console.log( chalk`{green Source code ready for building}` );
} ).catch( ( error ) => {
	console.error( chalk`{red Error occured:}`, error );
} );

function getCKE4Path( directory ) {
	const isCKE4Dir = readdirSync( directory ).some( ( file ) => {
		return file === 'package.json';
	} );

	if ( isCKE4Dir ) {
		return directory;
	}

	return getCKE4Path( resolvePath( directory, '..' ) );
}

function transpileCore( cke4Path ) {
	const corePath = resolvePath( cke4Path, 'src', 'core' );
	const modules = readdirSync( corePath ).filter( jsFileFilter );
	const paths = modules.map( ( module ) => {
		return {
			input: resolvePath( corePath, module ),
			output: resolvePath( cke4Path, 'core', module )
		};
	} );

	return transpile( paths );
}

function transpilePlugins( cke4Path ) {
	const pluginsPath = resolvePath( cke4Path, 'src', 'plugins' );
	const outputsPath = resolvePath( cke4Path, 'plugins' );
	const plugins = readdirSync( pluginsPath ).filter( ( file ) => {
		const filePath = resolvePath( pluginsPath, file );
		const stats = statSync( filePath );

		return stats.isDirectory();
	} );
	const transpiles = [];

	plugins.forEach( ( plugin ) => {
		const pluginPath = resolvePath( pluginsPath, plugin );
		const outputPath = resolvePath( outputsPath, plugin );
		const dialogsPath = resolvePath( pluginPath, 'dialogs' );
		const dialogsExists = existsSync( dialogsPath );

		transpiles.push( {
			input: resolvePath( pluginPath, 'plugin.js' ),
			output: resolvePath( outputPath, 'plugin.js' )
		} );

		if ( !dialogsExists ) {
			return;
		}

		const dialogs = readdirSync( dialogsPath ).filter( jsFileFilter );

		transpiles.push( ...dialogs.map( ( dialog ) => {
			return {
				input: resolvePath( dialogsPath, dialog ),
				output: resolvePath( outputPath, 'dialogs', dialog )
			};
		} ) );
	} );

	return transpile( transpiles );
}

function transpile( paths ) {
	if ( !Array.isArray( paths ) ) {
		paths = [ paths ];
	}

	const transpiles = paths.map( ( { input, output } ) => {
		return rollup( {
			input,
			plugins: [
				{
					load( path ) {
						if ( path !== input ) {
							return null;
						}

						const fileContent = readFileSync( path, 'utf8' );
						const code = `import 'core-js/modules/es.array.is-array.js';\n${ fileContent }`;

						return code;
					}
				},
				nodeResolve(),
				commonJS(),
				babel( {
					exclude: [
						'node_modules/core-js/**'
					],
					externalHelpers: false,
					presets: [
						[
							'@babel/preset-env',
							{
								targets: {
									ie: 8
								},
								useBuiltIns: 'usage',
								corejs: 3
							}
						]
					]
				} )
			]
		} ).then( ( bundle ) => {
			console.log( chalk`{blue Processing} ${ output }` );

			return bundle.write( {
				file: output,
				banner: `/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */\n`,
				format: 'iife'
			} );
		} );
	} );

	return transpiles;
}

function jsFileFilter( path ) {
	return path.endsWith( '.js' );
}
