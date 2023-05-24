import type { RestEndpointMethods } from '@octokit/plugin-rest-endpoint-methods/dist-types/generated/method-types';
import type * as GitHub from '@actions/github';
import type * as Core from '@actions/core';

type PRListPromise = ReturnType<RestEndpointMethods['pulls']['list']>;
type ReturnPullData = Awaited<PRListPromise>['data'];
type PRUpdateRun = Awaited<
  ReturnType<RestEndpointMethods['pulls']['updateBranch']>
>;

export default async function run(core: typeof Core, github: typeof GitHub): Promise<void> {
    function fetchInput(
      key: string,
      required: boolean = false,
      fallback: string | undefined = undefined,
    ): string | undefined {
      let value: string | undefined;
      try {
        value = core.getInput(key, { required }) ?? fallback;
      } catch (error: any) {
        core.error(error);
        core.setFailed(error.message);
      }

      return value;
    }

    async function fetchPullRequests(
      endpoint: RestEndpointMethods,
    ): PRListPromise {
      return await endpoint.pulls.list({
        // Pass along the context for the repo
        ...github.context.repo,
        base: github.context.payload.ref ?? 'main',
        /* fetch the most recently updated PRs to keep them maintained first */
        /* we're assuming these PRs are higher priority and/or closer to being merged */
        sort: 'updated',
        direction: 'desc',
        state: 'open',
        per_page: 100,
      });
    }

    function filterPullRequests(prs: ReturnPullData): ReturnPullData {
      if (prs.length === 0) return [];

      // Always exclude dependabot and other bot PRs
      prs = prs.filter((pr) => pr.user?.name !== 'dependabot[bot]' && pr.user?.type !== 'Bot');

      const includeDrafts: boolean | undefined =
        fetchInput('include_drafts') === 'true' ? true : false;

      let strhold = fetchInput('include_labels');
      const allowLabels: string[] | undefined =
        typeof strhold !== 'undefined' && strhold.length !== 0
          ? strhold.split(',').map((i) => i.trim())
          : undefined;

      strhold = fetchInput('exclude_labels');
      const denyLabels: string[] | undefined =
        typeof strhold !== 'undefined' && strhold.length !== 0
          ? strhold.split(',').map((i) => i.trim())
          : undefined;

      if (
        typeof allowLabels === 'undefined' &&
        typeof denyLabels === 'undefined' &&
        includeDrafts
      )
        return prs;

      return prs.filter((pr) => {
        let allow = true;
        if (!includeDrafts && pr.draft === true) return false;

        if (typeof allowLabels !== 'undefined' && allowLabels.length !== 0) {
          allow = pr.labels.some((label) => allowLabels.includes(label.name));
        }

        if (typeof denyLabels !== 'undefined' && denyLabels.length !== 0) {
          allow = pr.labels.every((label) => !denyLabels.includes(label.name));
        }

        return allow;
      });
    }

  /* Fetch the token value */
  const token: string | undefined = fetchInput(
    'token',
    true,
    fetchInput('GITHUB_TOKEN', true, process.env.GITHUB_TOKEN),
  );

  if (typeof token === 'undefined' || token.length === 0) {
    core.error('No token provided. Please provide a token to use this action.');
    core.setFailed(
      'No token provided. Please provide a token to use this action.',
    );
    return;
  }

  let client: ReturnType<typeof github.getOctokit>;
  try {
    client = github.getOctokit(token);
  } catch (error: any) {
    core.error(error);
    core.setFailed(error.message);
    return;
  }

  const strhold = fetchInput('limit');
  const limit: number | undefined =
    typeof strhold !== 'undefined' && strhold.length !== 0
      ? parseInt(strhold, 10)
      : undefined;

  /* Find out which pull requests exist to meet these requirements */
  const prs: ReturnPullData = [];
  if (typeof limit !== 'undefined') {
    const pages = Math.ceil(limit / 100);
    do {
      const nextPage: Awaited<PRListPromise> = await fetchPullRequests(client.rest as any);
      const cleaned = filterPullRequests(nextPage.data);
      prs.push(...cleaned);
    } while (prs.length < limit && prs.length < 100 * pages);
  } else {
    const page = await fetchPullRequests(client.rest as any);
    prs.push(...filterPullRequests(page.data));
  }

  /* No PRs? No problem! */
  if (prs.length === 0) {
    core.info('No pull requests found that meet the requirements.');
    return core.setOutput('updated', 0);
  }

  if (typeof limit !== 'undefined' && prs.length > limit) {
    core.warning(
      `There are ${prs.length} PRs that meet the requirements, but as the limit is set to ${limit}, the remaining will be skipped.`,
    );
  }

  await Promise.all(
    prs.map((pr) => {
      /* @todo Figure out how to configure rebase updates */
      return client.rest.pulls.updateBranch({
        ...github.context.repo,
        pull_number: pr.number,
      });
    }),
  ).then((results: PRUpdateRun[]) => {
    const passed = results.filter(
      (result) => result.status === (200 as PRUpdateRun['status']),
    );
    const failed = results.filter(
      (result) => result.status !== (200 as PRUpdateRun['status']),
    );

    core.info(
      `\n\n|-------------------------|\nAttempted to update ${results.length} pull requests\n - ${passed.length} succeeded.\n - ${failed.length} failed.`,
    );

    if (failed.length > 0) {
      core.warning(
        failed
          .map((pr) => `${pr.data.message}\n[${pr.data.url}](${pr.data.url})\n`)
          .join('\n'),
      );
    }

    core.setOutput('updated', passed.length);
    core.setOutput('failed', failed.length);
  })
  .catch((err) => {
    core.setFailed(err.message);
  });

  return;
}
