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
      boxShadow: {
        'outer': '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)'
      },
      colors: {
        blue: {
          '100': '#fbfdff',
          '200': '#eff7ff',
          '300': '#daecff',
          '400': '#b7daff',
          '500': '#87c1ff',
          '600': '#439eff',
          '700': '#0072ec',
          '800': '#004ea1',
          '900': '#002750',
        },
        gray: {
          '100': '#fdfdfd',
          '200': '#f6f6f6',
          '300': '#eaeaea',
          '400': '#d6d6d6',
          '500': '#bcbcbc',
          '600': '#9b9b9b',
          '700': '#767676',
          '800': '#505050',
          '900': '#272727',
        },
        olive: {
          '100': '#fdfdf9',
          '200': '#f7f7e8',
          '300': '#edecc8',
          '400': '#dcda95',
          '500': '#c5c14d',
          '600': '#a39f35',
          '700': '#7c7928',
          '800': '#54521b',
          '900': '#29280d'
        },
        pink: {
          '100': '#fffcfd',
          '200': '#fff3f7',
          '300': '#ffe3ed',
          '400': '#ffc7db',
          '500': '#ffa1c2',
          '600': '#ff659b',
          '700': '#ea0052',
          '800': '#a20039',
          '900': '#55001e',
        }
      },
      fontFamily: {
        abeeze: [ 'ABeeZee', 'Roboto', 'sans-serif' ],
      }
    },
  },
  variants: [
    'responsive',
    'first',
    'hover', 'group-hover',
    'focus', 'focus-within', 'group-focus'
  ],
  plugins: [],
};
