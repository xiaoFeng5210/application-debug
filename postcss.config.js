export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    'postcss-pxtorem': {
      rootValue({ file }) {
        console.log(file);
        return file.indexOf('vant') !== -1 ? 15 : 30;
      },
      selectorBlackList: ['html'],
      propList: ['*'],
    }
  },
}
