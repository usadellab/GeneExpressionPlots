module.exports = {
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true,
  },
  purge: [
    './src/**/*.js',
    './src/**/*.jsx',
  ],
  theme: {
    extend: { },
  },
  variants: {
    textColor: ['responsive', 'hover', 'focus', 'group-hover'],
  },
  plugins: [],
};
