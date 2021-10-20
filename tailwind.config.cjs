const config = {
  mode: 'jit',
  purge: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    fontFamily: {
      display: ['Comfortaa', 'cursive'],
      body: ['"Open Sans"', 'sans-serif'],
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',

      n0: '#ffffff',
      n50: '#f7f7f8',
      n100: '#eff0f0',
      n200: '#dfe0e1',
      n300: '#c8c9cb',
      n500: '#8e9195', // base
      n700: '#545759',
      n900: '#252627',
      n1000: '#121212',

      b100: '#c9e0f8',
      b300: '#73b0ed',
      b500: '#3c91e6', // base
      b600: '#1a70c7',
      b900: '#0e3d6c',

      g100: '#9ef5c4',
      g300: '#15cb64',
      g500: '#11a652', // base
      g700: '#0a6130',
      g900: '#084a24',

      r100: '#fdd4d3',
      r300: '#fb8884',
      r500: '#f9564f',
      r600: '#e20f08',
      r900: '#8f0a05',
    },
  },

  plugins: [],
};

module.exports = config;
