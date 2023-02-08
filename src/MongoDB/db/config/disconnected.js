const chalk = require("chalk");
console.log("Checked disconected");
module.exports = {
  name: "disconnected",
  execute() {
    console.log(chalk.red("[Database Status]: Disconnected."));
  },
};
