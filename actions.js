const { data } = require('jquery');
const fetch = require('./node_modules/node-fetch');

var rqst = 'https://api.github.com/repos/elena-martin/qimo-bot/actions/workflows/27516000/runs';
function getStatus(){
    const response = fetch(rqst)
    .then(response => response.json())
    .then(data => {
        let run = data.workflow_runs[0].status;
        console.log(run);
    });
};
getStatus();

