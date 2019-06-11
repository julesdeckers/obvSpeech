const HtmlWebPackPlugin = require("html-webpack-plugin");
const postcssPresetEnv = require("postcss-preset-env");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const BrowserSyncPlugin = require("browser-sync-webpack-plugin");

module.exports = (env, { mode }) => {
  return {
    output: {
      filename: "[name].[chunkhash].js"
    },
    devServer: {
      overlay: true
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: `babel-loader`
        },
        {
          test: /\.html$/,
          loader: `html-srcsets-loader`,
          options: {
            attrs: [":src", ":srcset"]
          }
        },
        {
          test: /\.(jpe?g|svg|png|gif)$/,
          loader: `url-loader`,
          options: {
            limit: 1000,
            context: "./src",
            name: "[path][name].[hash].[ext]"
          }
        },
        {
          test: /\.css$/,
          loader: [
            mode === "production" ? MiniCssExtractPlugin.loader : "css-loader",
            "resolve-url-loader",
            {
              loader: "postcss-loader",
              options: {
                sourceMap: true,
                plugins: [
                  require(`postcss-import`),
                  postcssPresetEnv({ stage: 0 })
                ]
              }
            }
          ]
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[name].[ext]",
                outputPath: "fonts/"
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new HtmlWebPackPlugin({
        template: "./src/index.html"
      }),
      new MiniCssExtractPlugin({
        filename: "style.[contenthash].css"
      }),
      new OptimizeCSSAssetsPlugin(),
      new BrowserSyncPlugin(
        // BrowserSync options
        {
          // browse to http://localhost:3000/ during development
          host: "localhost",
          port: 3000,
          // proxy the Webpack Dev Server endpoint
          // (which should be serving on http://localhost:3100/)
          // through BrowserSync
          proxy: "http://localhost:8080/"
        },
        // plugin options
        {
          // prevent BrowserSync from reloading the page
          // and let Webpack Dev Server take care of this
          reload: false
        }
      )
    ]
  };
};
