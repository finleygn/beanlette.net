import { JSX, Match, onCleanup, onMount, Switch } from "solid-js";
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
  title: JSX.Element;
  thumbnail: string;
  id: string;
  images: { image: string, name?: string }[];
  // percentage of 100vw for x or 200vh for y
  position: { y: number, x: number }
}

const artwork: Artwork[] = [
  {
    title: "nagato_cherry_style",
    thumbnail: "/artwork/nagato_cherry_style/thumb.gif",
    id: "nagato_cherry_style",
    position: { y: 3, x: 20 },
    images: [
      { image: '/artwork/nagato_cherry_style/full_1.jpg', name: "nagato (green)" },
    ]
  },
  {
    title: "water_cycle_13_2",
    thumbnail: "/artwork/water_cycle_13_2/thumb.gif",
    id: "water_cycle_13_2",
    position: { y: 6, x: 45 },
    images: [
      { image: '/artwork/water_cycle_13_2/full_1.jpg', name: "water cycle↺↺↺" },
    ]
  },
  {
    title: "oaksplitt",
    thumbnail: "/artwork/oaksplitt/thumb.gif",
    id: "oaksplitt",
    position: { y: 16, x: 8 },
    images: [
      { image: '/artwork/oaksplitt/full_1.gif', name: "oaksplitt" },
      { image: '/artwork/oaksplitt/full_2.jpg', name: "oaksplit2" }
    ]
  },
  {
    title: "detachable1",
    thumbnail: "/artwork/detachable1/thumb.gif",
    id: "detachable1",
    images: [
      { image: "/artwork/detachable1/full_1.gif", name: "detachable" },
      { image: "/artwork/detachable1/full_2.png" },
      { image: "/artwork/detachable1/full_3.png" },
      { image: "/artwork/detachable1/full_4.png" },
    ],
    position: { y: 10, x: 60 }
  },
  {
    title: "hanbee_nya",
    thumbnail: "/artwork/hanbee_nya/thumb.gif",
    id: "hanbee_nya",
    images: [
      { image: "/artwork/hanbee_nya/full_1.jpg", name: "=) ⁿʸᵃ (with hanbee)" },
    ],
    position: { y: 7, x: 85 }
  },
  {
    title: <>miku_interpolate_<wbr/>do_u_recognise_<wbr/>her_3</>,
    thumbnail: "/artwork/miku_interpolate_do_u_recognise_her_3/thumb.gif",
    id: "miku_interpolate_do_u_recognise_her_3",
    images: [
      { image: "/artwork/miku_interpolate_do_u_recognise_her_3/full_1.gif", name: "interpolate39" },
      { image: "/artwork/miku_interpolate_do_u_recognise_her_3/full_2.jpg", name: "do u recognise her" },
    ],
    position: { y: 15, x: 90 }
  },
  {
    title: "plast_emotion_2",
    thumbnail: "/artwork/plast_emotion_2/thumb.gif",
    id: "plast_emotion_2",
    images: [
      { image: "/artwork/plast_emotion_2/full_1.jpg", name: "plast:emotion ₂₀₀₀" },
      { image: "/artwork/plast_emotion_2/full_2.jpg" }
    ],
    position: { y: 90, x: 70 }
  },
  {
    title: "forest_pixels_4",
    thumbnail: "/artwork/forest_pixels_4/thumb.gif",
    id: "forest_pixels_4",
    images: [
      { image: "/artwork/forest_pixels_4/full_1.jpg", name: "fae forest down pixelly bluebell" },
      { image: "/artwork/forest_pixels_4/full_2.jpg", name: "fae forest pfp" },
      { image: "/artwork/forest_pixels_4/full_3.jpg", name: "bluebell forest pixelly" },
      { image: "/artwork/forest_pixels_4/full_4.jpg", name: "bluebell forest fae entrance" },
    ],
    position: { y: 16, x: 40 }
  },
  {
    title: "oh_2",
    thumbnail: "/artwork/oh_2/thumb.gif",
    id: "oh_2",
    images: [
      { image: "/artwork/oh_2/full_1.jpg", name: "Oh?" },
    ],
    position: { y: 20, x: 70 }
  },
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