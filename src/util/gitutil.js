/* eslint-disable global-require,import/no-dynamic-require */
const childProcess = require('child_process');
const path = require('path');
const fs = require('fs');
const propParser = require('properties-parser');

const BUILD_PROPERTIES_PATH = () => path.resolve(process.cwd(), 'build.properties');

const {execSync} = childProcess;

const GitUtil = {

  getGitHeadSha1Decimal: () => {
    // prepend 1 to avoid ignoring preceding zero
    const sha1 = execSync('git rev-parse --short HEAD').toString().trim();
    return {sha1, sha1Decimal: parseInt(`1${sha1.toUpperCase()}`, 16)};
  },

  getSha1FromDecimal: decimal => parseInt(decimal, 10).toString(16).substring(1),

  incrementBuild: (platform, customBuildNumber) => {
    if (['ios', 'android'].indexOf(platform) === -1) {
      console.error('Unsupported platform, should be \'ios\' or \'android\'');
      process.exit(1);
    }

    const buildProps = propParser.createEditor(BUILD_PROPERTIES_PATH());
    const buildNoProp = `${platform}.build.number`;

    const currentBuildNumber = parseInt(buildProps.get(buildNoProp), 10);
    const newBuildNumber = parseInt(customBuildNumber, 10) || (currentBuildNumber ? currentBuildNumber + 1 : 0);

    console.log('======================');
    console.log(`Platform: ${platform}`);
    console.log(`Current build number: ${currentBuildNumber}`);
    console.log(`New build number: ${newBuildNumber}`);
    console.log('======================');

    buildProps.set(buildNoProp, newBuildNumber.toString());

    buildProps.save(() => {
      execSync('git add build.properties');
      execSync(`git commit -m "Bump ${platform} build number [${newBuildNumber}]"`);

      console.log(`Updated ${platform} build to ${newBuildNumber}`);
    });

  },

};

module.exports = GitUtil;
