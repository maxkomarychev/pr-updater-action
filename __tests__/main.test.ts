/* @todo clean up and configure test suite */

import run from '../src/main';

import * as github from '../__mocks__/@actions/github';
import * as core from '../__mocks__/@actions/core';

const fs = jest.requireActual('fs');

jest.mock('@actions/core');
jest.mock('@actions/github');

const setFailedMock = jest.spyOn(core, "setFailed")
const getOctokitMock = jest.spyOn(github, "getOctokit")

const gh = github.getOctokit('_');

const listPullsMock = jest.spyOn(gh.rest.pulls, 'list');
const updateBranchMock = jest.spyOn(gh.rest.pulls, 'updateBranch');

afterAll(() => jest.restoreAllMocks());

describe('run', () => {
  it('updates open pull requests with default settings', async () => {

    await run(core as any, github as any);

    // We expect the action to authenticate with GitHub
    expect(getOctokitMock).toHaveBeenCalledTimes(1);

    // Default limit is 100 so we expect only 1 call to listPulls
    expect(listPullsMock).toHaveBeenCalledTimes(1);

    expect(updateBranchMock).toHaveBeenCalledWith({
      pull_number: 123,
    });
  });

  // it('updates open', async () => {
  //   mockGitHubResponseChangedFiles('foo.txt');

  //   await run(core, github);

  //   // expect(removeLabelMock).toHaveBeenCalledTimes(0);
  //   // expect(addLabelsMock).toHaveBeenCalledTimes(0);
  // });

  // it('(with sync-labels: true) it deletes preexisting PR labels that no longer match the glob pattern', async () => {
  //   const mockInput = {
  //     'repo-token': 'foo',
  //     'configuration-path': 'bar',
  //     'sync-labels': true,
  //   };

  //   jest
  //     .spyOn(core, 'getInput')
  //     .mockImplementation((name: string, ...opts) => mockInput[name]);

  //   usingLabelerConfigYaml('only_pdfs.yml');
  //   mockGitHubResponseChangedFiles('foo.txt');
  //   getPullMock.mockResolvedValue(<any>{
  //     data: {
  //       labels: [{ name: 'touched-a-pdf-file' }],
  //     },
  //   });

  //   await run(core, github);

  //   expect(addLabelsMock).toHaveBeenCalledTimes(0);
  //   expect(removeLabelMock).toHaveBeenCalledTimes(1);
  //   expect(removeLabelMock).toHaveBeenCalledWith({
  //     owner: 'monalisa',
  //     repo: 'helloworld',
  //     issue_number: 123,
  //     name: 'touched-a-pdf-file',
  //   });
  // });

  // it('(with sync-labels: false) it issues no delete calls even when there are preexisting PR labels that no longer match the glob pattern', async () => {
  //   const mockInput = {
  //     'repo-token': 'foo',
  //     'configuration-path': 'bar',
  //     'sync-labels': false,
  //   };

  //   jest
  //     .spyOn(core, 'getInput')
  //     .mockImplementation((name: string, ...opts) => mockInput[name]);

  //   usingLabelerConfigYaml('only_pdfs.yml');
  //   mockGitHubResponseChangedFiles('foo.txt');
  //   getPullMock.mockResolvedValue(<any>{
  //     data: {
  //       labels: [{ name: 'touched-a-pdf-file' }],
  //     },
  //   });

  //   await run(core, github);

  //   expect(addLabelsMock).toHaveBeenCalledTimes(0);
  //   expect(removeLabelMock).toHaveBeenCalledTimes(0);
  // });
});
