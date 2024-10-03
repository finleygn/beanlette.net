import createAssetLoader, { AssetLoaders } from "../../utility/assetLoader";

const commissionScreenAssets = createAssetLoader({
  color: AssetLoaders.image('/backgrounds/yuru-camp.png'),
  depth: AssetLoaders.image('/backgrounds/yuru-camp.png')
})

export default commissionScreenAssets;