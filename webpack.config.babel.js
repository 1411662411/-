const buildConfig = (env) => {
    console.log('***************************');
    console.log(`now environment is ${env}`);
    console.log('***************************');
    const config = require(`./webpackConfigs/${env}.js`).default({env, __dirname});
    return config;
}
module.exports = buildConfig;