import BackgroundRenderer from "../../background/BackgroundRenderer";
import Icon from "../../components/Icon";
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
      <Icon
        title="plast_emotion_2"
        thumbnail="/artwork/plast_emotion_2/thumb.gif"
        id="plast_emotion_2"
        images={[]}
      />
      <Icon
        title="plast_emotion_2"
        thumbnail="/artwork/plast_emotion_2/thumb.gif"
        id="plast_emotion_2"
        images={[]}
      />
      <Icon
        title="plast_emotion_2"
        thumbnail="/artwork/plast_emotion_2/thumb.gif"
        id="plast_emotion_2"
        images={[]}
      />
      
    </Screen>
  )
}

export default HomeScreen;