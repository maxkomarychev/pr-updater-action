# Auto-update pull requests

[![Basic validation](https://github.com/castastrophe/actions-pr-auto-update/actions/workflows/basic-validation.yml/badge.svg?branch=main)](https://github.com/castastrophe/actions-pr-auto-update/actions/workflows/basic-validation.yml)

The goal of this action is to automatically update pull requests when their target branch is updated. This is useful when you have a long-running pull request that is not yet ready to be merged, but you want to keep it up to date with the target branch. Several customizations are available to control which pull requests are updated. Bot pull requests such as dependabot and closed pull requests are always ignored.

This project was forked from the cited repo below. This fork focuses on adding additional configurations and modernizing the tools and dependencies. ^[1](#citation)^

## Usage

For this action to run, you will need to ensure the access token used includes permission to update pull requests. This can be done by creating a [personal access token](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token) with the `pull-requests:write` scope. This token can then be added as a [repository secret](https://docs.github.com/en/actions/reference/encrypted-secrets) and referenced in the workflow.

Create a new workflow file in your repository (e.g. `.github/workflows/pr-update.yml`).

    ```yml
    name: Pull request update

    on:
        push:
            branches:
                - main

    jobs:
        autoupdate:
            runs-on: ubuntu-latest
            permissions:
                pull-requests: write
            steps:
            - uses: actions/checkout@v3
            - name: Update ALL THE PRS! 🎉
                uses: castastrophe/actions-pr-auto-update@v1.0.0
                with:
                    token: ${{ secrets.USER_TOKEN }}
                    # Optional: include a limit to the number of PRs to update (default is 100)
                    limit: 10
                    # Optional: set this to true if you want to include draft PRs in those to be updated
                    include_drafts: true
                    # Optional: include a list of labels which, if present, will prevent the PR from being updated; these are comma-separated.
                    exclude_labels: "do not update,skip update"
                    # Optional: include a list of labels, at least one of which are required to be present for the PR to be updated; these are comma-separated.
                    include_labels: "update,update me"
    ```

Once this is in place, every time a commit is pushed to one of the branches specified in your workflow, all pull requests targeting that branch (and that fall within the configured parameters) will be updated.

### Inputs

Various inputs are defined in [`action.yml`](action.yml) to let you configure this action:

| Name             | Description                                                                                                                                                   | Default        |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `token`          | Token used to perform API calls. The token will require `pull-requests:write` access.                                                                         | `github.token` |
| `limit`          | The number of pull requests to update. Once the limit is hit, any pull requests remaining will not be updated. Pull requests are sorted by last updated date. | `100`          |
| `include_drafts` | Whether or not to include draft pull rqeuests that are currently open.                                                                                        | `false`        |
| `include_labels` | A comma-separated list of labels, at least one of which **must** be present on the pull request to be updated. If no labels are present, PR will be skipped.  |                |
| `exclude_labels` | A comma-separated list of labels, where if at least one is present on the pull request to be updated, that PR will be skipped.                                |                |

Have ideas for additional features? [Open an issue](https://github.com/castastrophe/actions-pr-auto-update/issues)!

### Outputs

Outputs are defined in [`action.yml`](action.yml) to let you access information about the action after it has run:

| Name      | Description                                        |
| --------- | -------------------------------------------------- |
| `updated` | The number of pull requests that were updated.     |
| `failed`  | The number of pull requests that failed to update. |

## Limitations

Due to [rate limiting](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting) user
token can only perform 5,000 requests per hour. This limit will vary based on the type of token used and the account
level of the token owner.

## Future work

- [ ] Add support for rebasing pull requests instead of merging

## Contributions

Contributions are welcome! See the [Contributor's Guide](CONTRIBUTING.md).

## License

This project is licensed under the [MIT License](LICENSE).

## Citations

^[1]^ **Forked project:** [maxkomarychev/pr-updater-action](https://github.com/maxkomarychev/pr-updater-action)
