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
    const assets = await props.assetLoader();
    
    props.backgroundRender.setInitialBackgroundTexture({
      colour: assets.color,
      depth: assets.depth
    });
  });

  return <>{props.children}</>;
}

export default Screen;