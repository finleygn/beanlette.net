import { createSignal, Match, onCleanup, onMount, Switch } from "solid-js";
import BackgroundRenderer from "../../background/BackgroundRenderer";
import Icon from "./components/Icon";
import Screen from "../Screen";
import homeScreenAssets from "./assets";
import { useLocation } from "@solidjs/router";
import Modal from "./components/Modal";

interface ScreenProps {
  backgroundRender: BackgroundRenderer;
  onBackgroundReady: () => void;
}

interface Artwork {
  title: string;
  thumbnail: string;
  id: string;
  images: { image: string, name?: string }[];
  // percentage of 100vw for x or 200vh for y
  position: { y: number, x: number }
}

const artwork: Artwork[] = [
  {
    title: "plast_emotion_2",
    thumbnail: "/artwork/plast_emotion_2/thumb.gif",
    id: "plast_emotion_2",
    images: [
      { image: "/artwork/plast_emotion_2/full_1.jpg", name: "plast:emotion ₂₀₀₀" },
      { image: "/artwork/plast_emotion_2/full_2.jpg" }
    ],
    position: { y: 90, x: 70 }
  }
]

function HomeScreen(props: ScreenProps) {
  let containerRef: HTMLImageElement | undefined;
  const location = useLocation()
  
  onMount(() => {
    const unsubscribe = props.backgroundRender.onUpdate(() => {
      if(!containerRef) return;
      const { x, y } = props.backgroundRender.currentMousePosition;
      const xTransform = `${((x.get() - 0.5) * -1) * 10}%`;
      const yTransform = `${((y.get() - 0.5) * 0.5) * 10}%`;
      containerRef.style.transform = `translate(${xTransform}, ${yTransform})`;
    })
    
    onCleanup(unsubscribe);
  });
  
  return (
    <Screen
      assetLoader={homeScreenAssets}
      backgroundRender={props.backgroundRender}
      onBackgroundReady={props.onBackgroundReady}
    >
      <main ref={containerRef}>
        {artwork.map(artwork => (
          <Icon
            title={artwork.title}
            thumbnail={artwork.thumbnail}
            id={artwork.id}
            position={artwork.position}
          />
        ))}
      </main>

      {/** not the way this should be done but oh well */}
      <Switch>
        {artwork.map(artwork => (
          <Match when={`/${artwork.id}` === location.pathname}>
            <Modal images={artwork.images} />
          </Match>
        ))}
      </Switch>
      
    </Screen>
  )
}

export default HomeScreen;