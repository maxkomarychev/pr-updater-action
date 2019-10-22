import * as core from '@actions/core'
import * as github from '@actions/github'

const token = core.getInput('token')
const client = new github.GitHub(token)

client.pulls
    .list({
        ...github.context.repo,
        base: 'master',
        state: 'open',
    })
    .then((prs) => {
        // console.log('prs!', prs)
        const array = prs.data
        return Promise.all(
            array.map((pr) => {
                console.log('updating pr branch #', pr.number)
                return client.pulls.updateBranch({
                    ...github.context.repo,
                    pull_number: pr.number,
                })
            }),
        ).then((responses) => {
            console.log('responses!', responses)
        })
    })
    .catch((error) => {
        console.log('can not fetch all prs', error)
        core.setFailed(error.message)
    })
