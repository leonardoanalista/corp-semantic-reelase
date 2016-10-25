'use strict';
const semverValid = require('semver').valid;
const shell = require('shelljs');
const log = require('./log');

module.exports = function getLatestTag(verbose = false) {

  const regex = /tag:\s*(.+?)[,\)]/gi;
  const cmd = 'git log --date-order --tags --simplify-by-decoration --pretty=format:"%d"';
  var data = shell.exec(cmd, {silent: true}).output;
  var latestTag = null;

  data.split('\n').some(function(decorations) {
    var match;
    while (match = regex.exec(decorations)) { // eslint-disable-line no-cond-assign
      var tag = match[1];
      if (semverValid(tag)) {
        latestTag = tag;
        return true;
      }
    }
  });

  if (latestTag) {
    if (verbose) log.info('>> Your latest semantic tag is: ', latestTag);

    latestTag = `${latestTag}..HEAD`;
  } else {
    log.info('>> No SemVer tag found. It seems like your first release? Initial release will be set to v1.0.0 as per npmjs specification.');
    latestTag = 'HEAD';
  }

  return latestTag;
};
