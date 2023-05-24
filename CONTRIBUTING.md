# Contributing

[fork]: https://github.com/castastrophe/actions-pr-auto-update/fork
[pr]: https://github.com/castastrophe/actions-pr-auto-update/compare
[code-of-conduct]: CODE_OF_CONDUCT.md

Welcome! I'm thrilled that you'd like to contribute to this project. Your help is essential to ensure it continues to meet the needs of the community.

Contributions to this project are published under the [project's open source license](LICENSE).

Please note that this project is released with a [Contributor Code of Conduct][code-of-conduct]. By participating in this project you agree to abide by its terms.

## Found a bug?

- **Ensure the bug was not already reported** by searching on GitHub under [Issues](https://github.com/castastrophe/actions-pr-auto-update/issues).
- If you're unable to find an open issue addressing the problem, [open a new one](https://github.com/castastrophe/actions-pr-auto-update/issues/new). Be sure to include a **title and clear description**, as much relevant information as possible, and a **code sample** or a **reproducible test case** demonstrating the expected behavior that is not occurring.
- If possible, use the relevant bug report templates to create the issue.

## What should I know before submitting a pull request or issue

This project is written in [TypeScript](https://www.typescriptlang.org/), a typed variant of JavaScript, and it uses [Prettier](https://prettier.io/) and [ESLint](https://eslint.org) to get a consistent code style. If you're not familiar with TypeScript, you can still contribute by submitting issues.

Because of how GitHub Actions are run, the source code of this project is transpiled from TypeScript into JavaScript. The source code (found in `src/`) is subsequently transpiled using [NCC](https://github.com/vercel/ncc/blob/master/readme.md) and published to `bin/index.js`. This is the file that is used as the entrypoint for the action.

## Submitting a pull request

1. [Fork][fork] and clone the repository.
1. Configure and install the dependencies: `yarn install`.
1. Create a new branch: `git checkout -b feat-my-branch-name`.
1. Make your change, add tests, and make sure the tests still pass: `yarn test`.
1. Your code will be linted and auto-formatted using Prettier when you commit. Please do not use `--no-verify` to skip this step as it will cause the CI build to fail.
1. Update `bin/index.js` using `yarn build`. This creates a single javascript file that is used as an entrypoint for the action.
1. Push to your fork and [submit a pull request][pr].
1. Wait for your pull request to be reviewed and merged.

Here are a few things you can do that will increase the likelihood of your pull request being accepted:

- Write tests.
- Keep your change as focused as possible. If there are multiple changes you would like to make that are not dependent upon each other, consider submitting them as separate pull requests.

## Resources

- [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/)
- [Using Pull Requests](https://help.github.com/articles/about-pull-requests/)
- [GitHub Help](https://help.github.com)
- [Writing good commit messages](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html)

Thank you for contributing! :peace_symbol:
