function format(string) {
  var username = string.toLowerCase();
  return username.replace(/\s/g, '');
}

module.exports = (function () {
  var homeDir = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE,
    workingDirName = process.cwd().split('/').pop().split('\\').pop(),
    osUserName = homeDir && homeDir.split('/').pop() || 'root',
    configFile = homeDir + '/.gitconfig',
    user = {};

  if (require('fs').existsSync(configFile)) {
    user = require('iniparser').parseSync(configFile).user;
  }
  return {
    projectName: workingDirName,
    username: format(user.name) || osUserName,
    email: user.email || ''
  };
})();