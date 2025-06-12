import { Match, onCleanup, onMount, Switch } from "solid-js";
import BackgroundRenderer from "../../background/BackgroundRenderer";
import Icon from "./components/Icon";
import Screen from "../Screen";
import homeScreenAssets from "./assets";
import { useLocation } from "@solidjs/router";
import Modal from "./components/Modal";
import { artwork } from "../../constants/artwork";

interface ScreenProps {
  backgroundRender: BackgroundRenderer;
  onBackgroundReady: () => void;
}

function HomeScreen(props: ScreenProps) {
  let containerRef: HTMLImageElement | undefined;
  let linkRefs: HTMLAnchorElement[] = [];
  const location = useLocation();

  onMount(() => {
    const unsubscribe = props.backgroundRender.onUpdate(() => {
      if (!containerRef) return;
      const { x, y } = props.backgroundRender.currentMousePosition;
      const xTransform = `${(x.value - 0.5) * -1 * 10}%`;
      const yTransform = `${(y.value - 0.5) * -1 * 0.5 * 10}%`;
      containerRef.style.transform = `translate(${xTransform}, ${yTransform})`;
    });

    onCleanup(unsubscribe);
  });

  return (
    <Screen
      assetLoader={homeScreenAssets}
      backgroundRender={props.backgroundRender}
      onBackgroundReady={props.onBackgroundReady}
    >
      <main ref={containerRef}>
        {artwork.map((artwork, i) => (
          <Icon
            ref={(el) => (linkRefs[i] = el)}
            title={artwork.title}
            thumbnail={artwork.thumbnail}
            id={artwork.id}
            position={artwork.position}
            available={!!artwork.prints && artwork.prints.available}
          />
        ))}
      </main>

      {/** not the way this should be done but oh well */}
      <Switch>
        {artwork.map((artwork) => (
          <Match when={`/${artwork.id}` === location.pathname}>
            <Modal images={artwork.images} print={artwork.prints} />
          </Match>
        ))}
      </Switch>
    </Screen>
  );
}

export default HomeScreen;
