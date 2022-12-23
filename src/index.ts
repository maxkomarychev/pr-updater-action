import * as core from '@actions/core'
import * as github from '@actions/github'

const token = core.getInput('token')
const exclude_drafts = core.getInput('exclude_drafts').toLowerCase() === "true"
const client = new github.GitHub(token)

async function main() {
    core.info("Starting update prs")
}

await main()
