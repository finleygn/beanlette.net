import { JSXElement, onMount } from "solid-js";
import BackgroundRenderer from "../background/BackgroundRenderer";

interface ScreenProps {
  assetLoader: () => Promise<{
    readonly color: HTMLImageElement;
    readonly depth: HTMLImageElement;
  }>,
  backgroundRender: BackgroundRenderer;
  children: JSXElement;
}

function Screen(props: ScreenProps) {
  onMount(async () => {
    if(props.backgroundRender.hasBackgroundTexture()) {
      props.backgroundRender.prepNextBackground();
      const assets = await props.assetLoader();

      props.backgroundRender.startBackgroundTransition({
        colour: assets.color,
        depth: assets.depth
      });
    } else {
      const assets = await props.assetLoader();
      props.backgroundRender.setCurrentBackgroundTexture({
        colour: assets.color,
        depth: assets.depth
      });
    }
  });

  return <>{props.children}</>;
}

export default Screen;