#!/usr/bin/env bash

set -e

CIRCLE_API_USER_TOKEN=00000
curl -u ${CIRCLE_API_USER_TOKEN}: \
     -d build_parameters[CIRCLE_JOB]=long_test \
     https://circleci.com/api/v1.1/project/github/maxkomarychev/gatekeeper/tree/master
