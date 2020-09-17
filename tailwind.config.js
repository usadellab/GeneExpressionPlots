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
    extend: {
      fontFamily: {
        abeeze: [
          'ABeeZee', 'system-ui', '-apple-system', 'BlinkMacSystemFont', "Segoe UI",
          'Roboto', "Helvetica Neue", 'Arial', "Noto Sans", 'sans-serif', "Apple Color Emoji",
          "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"
        ]
      }
    },
  },
  variants: [ 'responsive', 'hover', 'focus', 'focus-within', 'group-hover', 'group-focus' ],
  plugins: [],
};
