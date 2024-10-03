import createAssetLoader, { AssetLoaders } from "../../utility/assetLoader";

const homeScreenAssets = createAssetLoader({
  color: AssetLoaders.image('/backgrounds/home_screen_color.jpg'),
  depth: AssetLoaders.image('/backgrounds/home_screen_depth.png')
})

export default homeScreenAssets;