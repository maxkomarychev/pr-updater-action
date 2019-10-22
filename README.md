# PR Updater

## Quick start

1. Create user token in [user settings](https://github.com/settings/tokens)
2. Set this token as a secret `USER_TOKEN` in settings of a target repository: `https://github.com/<owner>/<repo>/settings/secrets`
3. create file `.github/workflows/pr-updater.yml` with the following content:

    ```yml
    name: PR update

    on:
        push:
            branches: 
                - master

    jobs:
        autoupdate:
            runs-on: ubuntu-latest
            steps:
            - uses: actions/checkout@v1
            - name: update all prs
                uses: maxkomarychev/pr-updater-action@v0.0.1
                with:
                    token: ${{ secrets.USER_TOKEN }}
    ```

4. Now every time code is pushed to branches specified in the workflow all ohter
pull requests targeting these branches will be automatically updated.
