import BackgroundRenderer from "../../background/BackgroundRenderer";
import Screen from "../Screen";
import commissionScreenAssets from "./assets";

interface ScreenProps {
  backgroundRender: BackgroundRenderer;
  onBackgroundReady: () => void;
}

function CommissionScreen(props: ScreenProps) {
  return (
    <Screen
      assetLoader={commissionScreenAssets}
      backgroundRender={props.backgroundRender}
      onBackgroundReady={props.onBackgroundReady}
    >
      <h1>Test</h1>
    </Screen>
  )
}

export default CommissionScreen;