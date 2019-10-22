import * as core from '@actions/core'
import * as github from '@actions/github'
import yaml from 'js-yaml'
import * as fs from 'fs'
import readConfig from './read-config'

const config = readConfig()
console.log('config!', config)

const token = core.getInput('token')
const client = new github.GitHub(token)

const mode = core.getInput('mode')

// console.log(JSON.stringify(github.context.payload, null, 4))

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
