module.exports = {
  entry: "./app/initialize.js",
  output: {
    filename: "./dist/bundle.js"
  },
  module: {
    loaders: {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        cacheDirectory: true,
        presets: ['es2015']
      }
    }
  },
  resolve : {
    extensions: ['.js']
  }
}
