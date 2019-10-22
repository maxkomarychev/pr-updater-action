import * as core from '@actions/core'
import * as github from '@actions/github'
import chalk from 'chalk'

const token = core.getInput('token')
const client = new github.GitHub(token)

console.log('payload', github.context.payload)
console.log('ref', github.context.ref)

async function main() {
    const pullsResponse = await client.pulls.list({
        ...github.context.repo,
        base: 'master',
        state: 'open',
    })
    const prs = pullsResponse.data
    await Promise.all(
        prs.map((pr) => {
            // console.log(chalk.yellow("Updating pull request"))
            client.pulls.updateBranch({
                ...github.context.repo,
                pull_number: pr.number,
            })
        }),
    )
}

main()
