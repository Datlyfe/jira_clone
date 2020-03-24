// eslint-disable-next-line
const purgecss = require('@fullhuman/postcss-purgecss')({
  content: [`./public/**/*.html`, `./src/**/*.vue`],
  defaultExtractor(content) {
    const contentWithoutStyleBlocks = content.replace(
      /<style[^]+?<\/style>/gi,
      ''
    )
    return (
      contentWithoutStyleBlocks.match(/[A-Za-z0-9-_/:]*[A-Za-z0-9-_/]+/g) || []
    )
  },
  whitelistPatterns: [/^ql/, /^tippy/, /^toast/],
  whitelistPatternsChildren: [/^ql/, /^tippy/, /^toast/]
})
module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    ...(process.env.NODE_ENV === 'production' ? [purgecss] : [])
  ]
}
