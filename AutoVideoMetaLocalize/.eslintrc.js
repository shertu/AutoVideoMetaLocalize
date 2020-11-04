const Typescript = require('typescript'); // added to clear dependency check

module.exports = {
	settings: {
		react: {
			version: "detect"
		}
	},
	env: {
		browser: true,
		es6: true
	},
	extends: [
		"plugin:react/recommended",
		"google"
	],
	globals: {
		Atomics: "readonly",
		SharedArrayBuffer: "readonly"
	},
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaFeatures: {
			"jsx": true
		},
		ecmaVersion: 2018,
		sourceType: "module"
	},
	plugins: [
		"react",
		"@typescript-eslint"
	],
	rules: {
		// disable rules from base configurations
		"max-len": "off",
		"no-unused-vars": "off"
	}
}
