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
    let prs = pullsResponse.data
        .filter(pr => !exclude_drafts || !pr.draft)
    prs.forEach((pr) => {
        core.info(JSON.stringify(pr))
            try {
                await client.pulls.updateBranch({
                    ...github.context.repo,
                    pull_number: pr.number,
                })
            } catch (e) {
                core.error("Failed to update branch: ", e.message)
            }
        })
}

await main()
