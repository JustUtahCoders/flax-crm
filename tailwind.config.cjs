const colors = require("tailwindcss/colors");

module.exports = {
  theme: {
    colors: {
      primary: {
        DEFAULT: "#2a467b",
      },
      white: colors.white,
      gray: colors.gray,
      coolGray: colors.coolGray,
    },
    extend: {
      outline: {
        primary: ["2px solid #2a467b"],
      },
    },
  },
};
