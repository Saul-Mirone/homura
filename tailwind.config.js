module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: [],
  theme: {
    extend: {},
    typography: {
      default: {
        css: {
          code: {
            color: 'none',
            backgroundColor: 'none',
          },
          pre: {
            color: 'none',
            backgroundColor: 'none',
            paddingTop: 'auto',
            paddingLeft: 'auto',
            paddingBottom: 'auto',
            paddingRight: 'auto',
          },
          'pre code': {
            padding: 'auto',
            backgroundColor: 'auto',
            borderWidth: 'auto',
            borderRadius: 'auto',
            color: 'auto',
            lineHeight: 'auto',
          },
        },
      },
    },
  },
  variants: {},
  plugins: [require('@tailwindcss/typography')],
};
