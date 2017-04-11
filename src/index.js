#!/usr/bin/env node
const GitUtil = require('./util/gitutil');
const setIOSVersion = require('./ios/set-ios-version');

const program = require('commander');

program
  .version('0.0.1')
  .usage('[options] <keywords>');

program
  .command('git-head-sha1-to-decimal')
  .description('Get git head sha1 in decimal')
  .action((sha1) => {
    const result = GitUtil.getGitHeadSha1Decimal(sha1);
    console.log('Git SHA1: ', result.sha1);
    console.log('Git SHA1 Decimal: ', result.sha1Decimal);
  });

program
  .command('decimal-to-sha1 <sha1Decimal>')
  .description('Convert the given sha1 decimal to sha1')
  .action((sha1Decimal) => {
    console.log('Git SHA1 Decimal: ', sha1Decimal);
    console.log('Git SHA1: ', GitUtil.getSha1FromDecimal(sha1Decimal));
  });

program
  .command('increment-build <platform> [buildNumber]')
  .description('Increment the given Android or iOS build version')
  .action((platform, buildNumber) => {
    GitUtil.incrementBuild(platform, buildNumber);
  });

program
  .command('update-ios-plist-version [buildNumber]')
  .description('Update iOS plist version')
  .action(() => {
    setIOSVersion();
  });

program.parse(process.argv);


if (!program.args.length) {
  program.help();
}
