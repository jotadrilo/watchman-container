'use strict';

const https = require('https');
const fs = require('fs');

function updateDockerfile(tag) {
  const file = './Dockerfile';
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      return console.log(err);
    }
    data = data.replace(/^ENV\s*WATCHMAN_VERSION\s*.*$/gm, `ENV WATCHMAN_VERSION ${tag.substr(1)}`);
    fs.writeFile(file, data, 'utf8');
  });
}

function getLatestWatchmanTag(callback) {
  return https.request({
    hostname: 'api.github.com',
    port: 443,
    path: '/repos/facebook/watchman/tags',
    method: 'GET',
    headers: {
      'user-agent': "This-is-a-valid-agent-for-GitHub-API"
    }
  }, res => {
    // Consume data from the stream
    var response = '';
    res.on('data', (d) => {
      response += d;
    });

    // Once all the data in the stream has been consumed
    res.on('end', () => {
      // console.log(JSON.stringify(data, null, 2));
      const latestTag = JSON.parse(response).map(t => t.name).sort().reverse()[0];

      // If the tag is stable, update dockerfile
      if (Array.isArray(latestTag.match(/^((?!rc).)*$/))) {
        callback(latestTag);
      }
    });
  }).on('error', e => {
    // Do nothing
  }).end();
}

getLatestWatchmanTag(updateDockerfile);
