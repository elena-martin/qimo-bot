const octokit = new Octokit({
    auth: 'personal-access-token123'
  })
  
  await octokit.request('GET /repos/elena-martin/qimo-bot/actions/jobs/{job_id}/logs', {
    owner: 'OWNER',
    repo: 'REPO',
    job_id: 'JOB_ID'
  })