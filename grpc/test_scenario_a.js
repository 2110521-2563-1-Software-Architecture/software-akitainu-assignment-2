const { exit } = require("process");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const data = [];

async function doExec(content) {
  const { stdout } = await exec(content);
  const response = stdout.split(": ");
  const responseTime = parseInt(response[response.length - 1]);
  data.push({ numberOfCall: data.length + 1, time: responseTime });
}

async function main(service) {
  const csvWriter = createCsvWriter({
    path: `../result/ScenarioA_gRPC_${service}.csv`,
    header: [
      { id: "numberOfCall", title: "Number of call" },
      { id: "time", title: "Time" },
    ],
  });

  for (let i = 0; i < 500; i++) {
    switch (service) {
      case "insert":
        await doExec(`node client.js insert ${i} test_title test_author`);
        break;
      case "list":
        await doExec(`node client.js list`);
        break;
      case "get":
        await doExec(`node client.js get ${i}`);
        break;
      case "delete":
        await doExec(`node client.js delete ${i}`);
        break;
      default:
        console.log("Invalid service");
        exit();
    }
  }

  csvWriter
    .writeRecords(data)
    .then(() => console.log("The CSV file was written successfully"));
}

var processName = process.argv.shift();
var scriptName = process.argv.shift();
var command = process.argv.shift();
main(command);
