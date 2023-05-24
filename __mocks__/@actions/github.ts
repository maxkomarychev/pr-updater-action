export const context = {
  eventName: 'push',
  repo: {
    owner: 'monalisa',
    repo: 'helloworld',
  },
  payload: {
    ref: 'main',
  },
};

  // https://developer.github.com/v3/pulls/#list-pull-requests
const PRs = [{
    number: 1,
    state: 'open',
    labels: [{
      name: 'foo',
    }],
    created_at: '2021-01-26T19:01:12Z',
    updated_at: '2021-11-26T19:01:12Z',
    closed_at: null,
    merged_at: null,
    base: { ref: 'main' },
    author_association: "OWNER",
    auto_merge: null,
    draft: false
  }, {
    number: 2,
    state: 'open',
    labels: [],
    created_at: '2021-01-26T19:01:12Z',
    updated_at: '2021-12-26T19:01:12Z',
    closed_at: null,
    merged_at: null,
    base: { ref: 'main' },
    author_association: "OWNER",
    auto_merge: null,
    draft: false
  }, {
    number: 3,
    state: 'closed',
    labels: [],
    created_at: '2021-01-26T19:01:12Z',
    updated_at: '2021-12-26T19:01:12Z',
    closed_at: '2021-12-30T19:01:12Z',
    merged_at: null,
    base: { ref: 'main' },
    author_association: "OWNER",
    auto_merge: null,
    draft: false
  }, {
    number: 4,
    state: 'open',
    labels: [],
    created_at: '2021-01-26T19:01:12Z',
    updated_at: '2022-01-26T19:01:12Z',
    closed_at: null,
    merged_at: null,
    base: { ref: 'main' },
    author_association: "OWNER",
    auto_merge: null,
    draft: true
  },
];

export const getOctokit = jest.fn().mockImplementation(() => ({
  rest: {
    pulls: {
      list: jest.fn()
        .mockName('github.pulls.list')
        .mockImplementation((args) => {
          const page = args.page - 1;
          const cleaned = PRs.filter((pr) => {
            if (args.state === 'open' && pr.merged_at === null) return false;
            if (args.base !== undefined && pr.base.ref !== args.base) return false;
            return true;
          }) ?? [];

          const sorted = cleaned.sort((a, b) => {
            if (args.sort === 'updated') {
              return new Date(a.updated_at)?.getTime() < new Date(b.updated_at)?.getTime() ? 1 : -1;
            }

            return 0;
          });

          if (args.direction === 'desc') sorted.reverse();

          return {
            data: sorted.slice(page * args.per_page, (page + 1) * args.per_page)
          };
        }),
      updateBranch: jest.fn().mockResolvedValue({}),
    },
  },
}));
