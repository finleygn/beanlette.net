import { JSXElement, onMount } from "solid-js";
import BackgroundRenderer from "../background/BackgroundRenderer";

interface ScreenProps {
  assetLoader: () => Promise<{
    readonly color: HTMLImageElement;
    readonly depth: HTMLImageElement;
  }>,
  backgroundRender: BackgroundRenderer;
  children: JSXElement;
  onBackgroundReady: () => void;
}

function Screen(props: ScreenProps) {
  onMount(async () => {
    if(props.backgroundRender.shouldSetInitialBackground()) {
      const assets = await props.assetLoader();

      console.log("Loading initial")
      await props.backgroundRender.setCurrentBackground({
        color: assets.color,
        depth: assets.depth
      });
    } else {
      const assets = await props.assetLoader();
      
      await props.backgroundRender.setNextBackground({
        color: assets.color,
        depth: assets.depth
      });
    }

    props.onBackgroundReady();
  });

  return <>{props.children}</>;
}

export default Screen;