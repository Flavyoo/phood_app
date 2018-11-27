module.exports = {
  assetsDir: '/public/',
  css: {
    modules: true,
	loaderOptions: {
      // options for the sass loader
      sass: {
        // @/ is an alias to src/
        // so this assumes you have a file named `src/variables.scss`
        data: `@import "@/sass/vars.sass";`
      }
    }
  },
}
