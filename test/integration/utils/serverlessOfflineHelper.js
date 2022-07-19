const { spawn } = require('child_process');

let slsOfflineProcess;

const finishLoading = () => new Promise((resolve, reject) => {
  slsOfflineProcess.stdout.on('data', (data) => {
    if (data.includes('[HTTP] server ready:')) {
      console.log(data.toString().trim());
      console.log(`Serverless: Offline started with PID : ${slsOfflineProcess.pid}`);
      resolve('ok');
    }

    if (data.includes('address already in use')) {
      reject(data.toString().trim());
    }
    console.log(data.toString().trim());
  });

  slsOfflineProcess.stderr.on('data', (errData) => {
    console.log(`Serverless Offline error:\n${errData.toString()}`);
    // reject(errData.toString());
  });
});

function startSlsOffline() {
  const cmdArr = 'offline start -r eu-west-1 --noTimeout --stage local --ignoreJWTSignature'.split(' ');
  slsOfflineProcess = spawn('./node_modules/.bin/serverless', cmdArr, { shell: true, cwd: process.cwd() });
  console.log('starting sls offline');

  return finishLoading();
}

function stopSlsOffline() {
  slsOfflineProcess.stdin.write('q\n');
  slsOfflineProcess.stdin.pause();
  slsOfflineProcess.kill();

  console.log('Serverless Offline stopped');
}

module.exports = {
  stopSlsOffline,
  startSlsOffline
};
