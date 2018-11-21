/* eslint-disable no-console */
/* eslint-env node */
import rollup from 'rollup';
import minimist from 'minimist';
import babel from 'rollup-plugin-babel';
import minify from 'rollup-plugin-babel-minify';

const args = minimist(process.argv.slice(2));

function babelPlugin(format) {
	if (format === 'esm') {
		return babel({
			presets: [
				['@babel/preset-env', {
					'targets': {
						'browsers': [
							'last 5 Chrome versions',
							'last 5 Firefox versions',
							'last 3 Safari versions',
							'last 3 Edge versions'
						]
					},
					'useBuiltIns': false
				}]
			]
		});
	}

	return babel();
}

async function build(format, file, libName) {
	const fileExt = args.prod ? `${format}.min.js` : `${format}.js`;
	const plugins = [
		babelPlugin(format)
	];

	if (args.prod) {
		plugins.push(minify());
	}

	const inputOptions = {
		input: `./src/${file}.js`,
		plugins
	};

	const outputOptions = {
		file: `dist/${file}.${fileExt}`,
		format,
		name: libName
	};

	const bundle = await rollup.rollup(inputOptions);

	await bundle.write(outputOptions);
}

async function buildAll() {
	console.log('Building ESM builds...');
	await build('esm', 'data-handler', 'DataHandler');
	await build('esm', 'data-object', 'DataHandler');
	console.log('Building UMD builds...');
	await build('umd', 'data-handler', 'DataObject');
	await build('umd', 'data-object', 'DataObject');
}

buildAll();
