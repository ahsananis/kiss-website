const mix = require('laravel-mix')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ImageminPlugin = require('imagemin-webpack-plugin').default
const imageminMozjpeg = require('imagemin-mozjpeg')
require('laravel-mix-purgecss')

mix.setPublicPath('web/assets')
  .setResourceRoot('/assets')
  .js('src/js/main.js', 'web/assets/js')
  .less('src/less/styles.less', 'web/assets/css')
  .sass('src/sass/player.scss', 'web/assets/css')
  .copy('node_modules/picturefill/dist/picturefill.min.js', 'web/assets/js')
  .options({
    postCss: [
      require('tailwindcss')('./tailwind.js'),
    ]
  })
  .purgeCss({
    enabled: mix.inProduction(),
    folders: ['src', 'templates'],
    extensions: ['twig', 'html', 'js'],
    whitelist: ['turbolinks-progress-bar'],
    whitelistPatterns: [/^plyr/],
    whitelistPatternsChildren: [/^plyr/],
  })
  .webpackConfig({
    plugins: [
      new CopyWebpackPlugin([{
        from: 'src/img',
        to: 'img',
      }]),
      new ImageminPlugin({
        disable: process.env.NODE_ENV !== 'production',
        test: /\.(jpe?g|png|gif|svg)$/i,
        jpegtran: null,
        plugins: [
          imageminMozjpeg({
            quality: 80,
          })
        ]
      }),
    ],
  })
  .browserSync({
    proxy: 'kiss.test',
    open: false,
    ghostMode: false,
    files: [
        'templates/**/*.twig',
        'web/assets/**/*',
    ],
    snippetOptions: {
      rule: {
        match: /<\/head>/i,
        fn: function (snippet, match) {
          return snippet + match;
        }
      }
    }
  })

if (mix.inProduction()) {
  mix.version()
}
