const util = require("util");
const exec = util.promisify(require("child_process").exec);
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
}

const csvWriter = createCsvWriter({
    path: '../result/ScenarioB_rest3.csv',
    header: [
      {id: 'numberOfCall', title: 'Number of call'},
      {id: 'time', title: 'Time'},
    ]
  });
const data = [];

const startTime = new Date();
async function doExec(content) {
    //console.log('content:',content);
    const { stdout, stderr } = await exec(content);
    //console.log('stdout:',stdout);
    const response = stdout.split(": ");
    //console.log('response:',response);
    const responseTime = parseInt(response[response.length - 1]);
    //console.log('responseTime:',responseTime);
    data.push({ numberOfCall: data.length + 1, time: responseTime });
    //console.log(content, endTime - startTime);
  }

main = async () => {


for(let i=0;i<1000;i++) {
    const clientId = getRandomInt(2);
    const rand = getRandomInt(50);
    const method = getRandomInt(4);
    if(clientId===1) {
        switch(method) {
            case 0:
                await doExec(`node client.js insert ${rand} a b`);
                break;
            case 1:
                await doExec(`node client.js delete ${rand}`);
                break;
            case 2:
                await doExec(`node client.js get ${rand}`);
                break;
            case 3:
                await doExec(`node client.js list`);
                break;
        }
    }
    else {
        switch(method) {
            case 0:
                await doExec(`node client2.js insert ${rand} a b`);
                break;
            case 1:
                await doExec(`node client2.js delete ${rand}`);
                break;
            case 2:
                await doExec(`node client2.js get ${rand}`);
                break;
            case 3:
                await doExec(`node client2.js list`);
                break;
        }
    }
}

csvWriter.writeRecords(data).then(()=> console.log('The CSV file was written successfully'));

}

main();