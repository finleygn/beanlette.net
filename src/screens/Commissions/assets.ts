import createAssetLoader, { AssetLoaders } from "../../utility/assetLoader";

const commissionScreenAssets = createAssetLoader({
  color: AssetLoaders.image('/backgrounds/other_screen_color.jpg'),
  depth: AssetLoaders.image('/backgrounds/other_screen_depth.png')
})

export default commissionScreenAssets;