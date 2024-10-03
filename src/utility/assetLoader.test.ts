import { expect, test, describe } from 'vitest'
import createAssetLoader, { createAssetLoaderFactory } from './assetLoader'

type MockReturnResource = { path_loaded: string };

const MockResourceLoader = createAssetLoaderFactory<MockReturnResource>((resourcePath) => {
  return new Promise<MockReturnResource>((resolve, _) => {
    resolve({  path_loaded: resourcePath })
  })
});

const MockFailedResourceLoader = createAssetLoaderFactory<MockReturnResource>((_) => {
  return new Promise<MockReturnResource>((_, reject) => {
    reject()
  })
});

describe('assetLoader', () => {
  test('failed requests come back as undefined assets', async () => {
    const loader = createAssetLoader({
      key1: MockFailedResourceLoader('key1path'),
      key2: MockResourceLoader('key2path')
    })

    const registry = await loader();

    expect(registry.key1).toEqual(undefined)
    expect(registry.key2).toEqual({ path_loaded: 'key2path' })
  });

  test('call respective loaders, await result', async () => {
    const loader = createAssetLoader({
      key1: MockResourceLoader('key1path'),
      key2: MockResourceLoader('key2path')
    })

    const registry = await loader();
  
    expect(registry.key1).toEqual({ path_loaded: 'key1path' })
    expect(registry.key2).toEqual({ path_loaded: 'key2path' })
  });
})