import BackgroundRenderer from "../../background/BackgroundRenderer";
import Screen from "../Screen";
import homeScreenAssets from "./assets";

interface ScreenProps {
  backgroundRender: BackgroundRenderer;
}

function HomeScreen(props: ScreenProps) {
  return (
    <Screen
      assetLoader={homeScreenAssets}
      backgroundRender={props.backgroundRender}
    >
      <h1>Test</h1>
    </Screen>
  )
}

export default HomeScreen;