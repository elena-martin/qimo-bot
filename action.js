const octokit = new Octokit({})

await octokit.request('POST /repos/{owner}/{repo}/dispatches', {
  owner: 'elena-martin',
  repo: 'qimo-bot',
  event_type: 'on-demand-test',
  client_payload: {
    unit: false,
    integration: true
  }
})