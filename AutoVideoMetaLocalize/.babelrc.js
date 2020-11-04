const BabelPresetEnv = require('@babel/preset-env');
const BabelPresetReact = require('@babel/preset-react');
const BabelPresetTypescript = require('@babel/preset-typescript');
const BabelPluginClassProperties = require('@babel/plugin-proposal-class-properties');

module.exports = {
  presets: [
    BabelPresetEnv,
    BabelPresetReact,
    BabelPresetTypescript
  ],
  plugins: [
    BabelPluginClassProperties
  ]
};
