import { shopifySdk } from './shopify-sdk.js';

describe('shopifySdk', () => {
  it('should work', () => {
    expect(shopifySdk()).toEqual('shopify-sdk');
  });
});
