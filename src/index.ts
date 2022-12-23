import * as core from '@actions/core'
import * as github from '@actions/github'

const token = core.getInput('token')
const exclude_drafts = core.getInput('exclude_drafts').toLowerCase() === "true"
const client = new github.GitHub(token)

async function main() {
    core.info("Starting update prs")
    const baseBranch = github.context.payload.ref
    const pullsResponse = await client.pulls.list({
        ...github.context.repo,
        base: baseBranch,
        state: 'open',
    })
    let prs = pullsResponse.data

    for (const pr1 of prs.filter(pr => !exclude_drafts || !pr.draft)) {
        try {
            core.info("Updating PR: " + pr1.url)
            await client.pulls.updateBranch({
                ...github.context.repo,
                pull_number: pr1.number,
            })
        } catch (error) {
            if (error instanceof Error)
                core.error("Failed to update branch: " + JSON.stringify(error))
        }
    }
}

main().then(r => r)
