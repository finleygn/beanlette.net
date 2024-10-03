import createAssetLoader, { AssetLoaders } from "../../utility/assetLoader";

const commissionScreenAssets = createAssetLoader({
  color: AssetLoaders.image('/backgrounds/yuru-camp.png'),
  depth: AssetLoaders.image('/backgrounds/home_screen_depth.png')
})

export default commissionScreenAssets;