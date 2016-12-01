import devConfig from './webpack.dev';
import WebpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';

const HOST = 'localhost';
const PORT = '8080';

const config = devConfig;
const contentBase = `http://${HOST}:${PORT}`;
const compiler = webpack(config.toJS());

console.info('Starting development server. Please wait...'); // eslint-disable-line no-console

const server = new WebpackDevServer(compiler, {
  // Configure hot replacement
  hot: true,

  // The rest is terminal configurations
  quiet: false,
  noInfo: false,
  lazy: false,
  publicPath: `${contentBase}/build`,
  contentBase: './examples/',
  stats: {
    colors: true,
  },
});

server.listen(PORT, HOST);
