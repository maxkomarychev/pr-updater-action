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
                uses: maxkomarychev/pr-updater-action@v1.0.0
                with:
                    token: ${{ secrets.USER_TOKEN }}
    ```

4. Now every time code is pushed to branches specified in the workflow all other
pull requests targeting these branches will be automatically updated.


## Current limitations

1. Due to [rate limiting](https://developer.github.com/v3/#rate-limiting) user
token can only perform 5000 requests per hour
2. The action currently does not implement paging, so it can only update up to
100 pull requests in one run
