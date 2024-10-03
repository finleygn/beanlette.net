import BackgroundRenderer from "../../background/BackgroundRenderer";
import Screen from "../Screen";
import commissionScreenAssets from "./assets";

interface ScreenProps {
  backgroundRender: BackgroundRenderer;
}

function CommissionScreen(props: ScreenProps) {
  return (
    <Screen
      assetLoader={commissionScreenAssets}
      backgroundRender={props.backgroundRender}
    >
      <h1>Test</h1>
    </Screen>
  )
}

export default CommissionScreen;