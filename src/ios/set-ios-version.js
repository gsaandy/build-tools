/* eslint-disable no-console,import/no-dynamic-require */
const exec = require('child_process').exec;
const path = require('path');
const GitUtil = require('../util/gitutil');
const propParser = require('properties-parser');

const pJson = require(path.resolve(process.cwd(), 'package.json'));
const buildProps = propParser.createEditor(path.resolve(process.cwd(), 'build.properties'));

const updatePList = (marketingVersion, buildNumber) => {
  function reporter(error, stdout) {
    if (error) {
      throw error;
    }
    console.log(stdout);
  }

  console.log(`Setting iOS version. Marketing = ${marketingVersion}, build number = ${buildNumber}`);
  exec(`cd ios && agvtool new-marketing-version ${marketingVersion} && agvtool new-version -all ${buildNumber}`, reporter);
};

const setVersion = () => {
  const npmPackageVersion = pJson.version;
  const [version] = npmPackageVersion.split('-');

  const { sha1Decimal } = GitUtil.getGitHeadSha1Decimal();
  const iosBuild = buildProps.get('ios.build.number');

  const buildNumber = `${iosBuild}.${sha1Decimal}`;
  updatePList(version, buildNumber);
};

module.exports = setVersion;
