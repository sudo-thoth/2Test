const chalk = require("chalk");
console.log("Checked Connecting");
module.exports = {
  name: "connecting",
  execute() {
    console.log(chalk.cyan("[Database Status]: Connecting . . ."));
  },
};
