module.exports = {
  purge: ['./src/**/*.js', './src/**/*.jsx'],
  theme: {
    extend: {
      boxShadow: {
        outer:
          '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
      },
      maxHeight: {
        '3xl': '48rem',
      },
      spacing: {
        68: '18rem',
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['odd'],
      borderWidth: ['first'],
      margin: ['first'],
      visibility: ['group-hover'],
    },
  },
};
