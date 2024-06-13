export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    'postcss-pxtorem': {
      rootValue({file}) {
        console.log(file);
        return file.indexOf('vant') !== -1 ? 15 : 20;
      },
      selectorBlackList: ['html'],
      propList: ['*'],
    }
  },
}
