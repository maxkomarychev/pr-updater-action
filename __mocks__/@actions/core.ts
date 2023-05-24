export function getInput(key: string) {
    switch (key) {
        case 'token':
            return '5269636b204173746c6579202d204e6576657220676f6e6e65206769766520796f75207570';
        case 'limit':
            return '300';
        case 'include_drafts':
            return 'true';
        case 'include_labels':
            return 'foo,bar';
        case 'exclude_labels':
            return 'baz';
    }
}

export const debug = jest.fn().mockName('core.debug');
export const info = jest.fn().mockName('core.info');
export const error = jest.fn().mockName('core.error');
export const setOutput = jest.fn().mockName('core.setOutput');
export const setFailed = jest.fn().mockName('core.setFailed');
export const warning = jest.fn().mockName('core.warning');
