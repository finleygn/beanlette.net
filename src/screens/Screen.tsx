import { JSXElement, onMount } from "solid-js";
import BackgroundRenderer from "../background/BackgroundRenderer";

interface ScreenProps {
  assetLoader: () => Promise<{
    readonly color: HTMLImageElement;
    readonly depth: HTMLImageElement;
    readonly colourPerChannel: number;
    readonly contrastBoost: number;
  }>;
  backgroundRender: BackgroundRenderer;
  children: JSXElement;
  onBackgroundReady: () => void;
}

function Screen(props: ScreenProps) {
  onMount(async () => {
    const assets = await props.assetLoader();

    await props.backgroundRender.setTextures({
      color: assets.color,
      depth: assets.depth,
      colourPerChannel: assets.colourPerChannel,
      contrastBoost: assets.contrastBoost,
    });

    props.onBackgroundReady();
  });

  return <>{props.children}</>;
}

export default Screen;
