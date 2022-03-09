module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  prefix: "tw-",
  darkMode: false, // or 'media' or 'class'
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        silver: "#bac3d8",
        silverPrimary: "#ebeef4",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
