import BackgroundRenderer from "../../background/BackgroundRenderer";
import Screen from "../Screen";
import homeScreenAssets from "./assets";

interface ScreenProps {
  backgroundRender: BackgroundRenderer;
  onBackgroundReady: () => void;
}

function HomeScreen(props: ScreenProps) {
  return (
    <Screen
      assetLoader={homeScreenAssets}
      backgroundRender={props.backgroundRender}
      onBackgroundReady={props.onBackgroundReady}
    >
      <h1>Helloo</h1>
    </Screen>
  )
}

export default HomeScreen;