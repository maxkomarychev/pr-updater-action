import * as core from '@actions/core'
import * as github from '@actions/github'

const token = core.getInput('token')
const exclude_drafts = core.getInput('exclude_drafts').toLowerCase() === "true"
const client = new github.GitHub(token)

async function main() {
    const baseBranch = github.context.payload.ref
    const pullsResponse = await client.pulls.list({
        ...github.context.repo,
        base: baseBranch,
        state: 'open',
    })
    const prs = pullsResponse.data
    await Promise.all(
        prs.map((pr) => {
            if (exclude_drafts && pr.draft) 
                return null

            client.pulls.updateBranch({
                ...github.context.repo,
                pull_number: pr.number,
            })
        }).filter(p => p),
    )
}

main()
