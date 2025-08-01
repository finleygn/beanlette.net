/**
 * The following is awful:
 */

type Remap<T> = {
  [K in keyof T]: T[K];
};

type AssetLoaderFn<T> = () => Promise<T>;
type AssetLoaderFactoryFn<T> = (resourcePath: string) => AssetLoaderFn<T>;
type AssetLoadableToLoaded<T extends { [k: string]: AssetLoaderFn<unknown> }> =
  Remap<{
    [K in keyof T]: T[K] extends AssetLoaderFn<infer R> ? R : never;
  }>;

export function createAssetLoaderFactory<T>(
  handler: (resourcePath: string) => Promise<T>
): AssetLoaderFactoryFn<T> {
  return (resourcePath: string) => () => handler(resourcePath);
}

export const AssetLoaders = {
  image: createAssetLoaderFactory<HTMLImageElement>((resourcePath) => {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.decoding = "sync";
      image.src = resourcePath + "?test=" + Math.random();
      image.onload = () => resolve(image);

      image.onerror = () => reject();
    });
  }),
};

function createAssetLoader<
  const T extends { [k: string]: AssetLoaderFn<unknown> }
>(assets: T) {
  return async (): Promise<AssetLoadableToLoaded<T>> => {
    const loaded: any = {};

    await Promise.allSettled(
      Object.entries(assets).map(async ([name, loader]) => {
        try {
          const result = await loader();
          loaded[name] = result;
        } catch (e) {
          // Should probably do something here lmaooo
        }
      })
    );

    return loaded as AssetLoadableToLoaded<T>;
  };
}

export default createAssetLoader;
