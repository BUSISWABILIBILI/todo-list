import path from "node:path";
import HtmlWebpackPlugin from "html-webpack-plugin";

export default (env = {}, argv = {}) => {
  const isDevServer =
    Boolean(env.WEBPACK_SERVE) ||
    Boolean(argv.env?.WEBPACK_SERVE) ||
    process.argv.some((argument) => argument.includes("serve"));

  return {
    mode: isDevServer ? "development" : "production",

    entry: "./src/index.js",

    output: {
      filename: "main.js",
      path: path.resolve(import.meta.dirname, "docs"),
      publicPath: "",
      clean: {
        keep: ".nojekyll",
      },
    },

    devServer: {
      static: "./docs",
      watchFiles: ["./src/**/*.js", "./src/template.html", "./public/styles.css"],
      port: "auto",
    },

    performance: {
      hints: isDevServer ? false : "warning",
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/template.html",
      }),
    ],

    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: "asset/resource",
        },
      ],
    },
  };
};
