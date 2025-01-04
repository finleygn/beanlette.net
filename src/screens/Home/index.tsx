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
  {
    title: "jyoucyo_ascii_3_FINAL_MAYBE",
    thumbnail: "/artwork/jyoucyo_ascii_3_FINAL_MAYBE/thumb.gif",
    id: "jyoucyo_ascii_3_FINAL_MAYBE",
    images: [
      { image: "/artwork/jyoucyo_ascii_3_FINAL_MAYBE/full_1.jpg", name: "Oh?" },
    ],
    position: { y: 30, x: 80 }
  },
  {
    title: "fetterless",
    thumbnail: "/artwork/fetterless/thumb.gif",
    id: "fetterless",
    images: [
      { image: "/artwork/fetterless/full_1.gif", name: "fetterless" },
      { image: "/artwork/fetterless/full_2.jpg", name: "fetterless 2" },
      { image: "/artwork/fetterless/full_3.jpg", name: "fetterless 3" },
      { image: "/artwork/fetterless/full_4.jpg", name: "fetterless 7" },
    ],
    position: { y: 22, x: 24 }
  },
  {
    title: "rei_displace_4",
    thumbnail: "/artwork/rei_displace_4/thumb.gif",
    id: "rei_displace_4",
    images: [
      { image: "/artwork/rei_displace_4/full_1.png", name: "reidisplace" },
      { image: "/artwork/rei_displace_4/full_2.png" },
    ],
    position: { y: 32, x: 13 }
  },
  {
    title: "img_2967_microcosm",
    thumbnail: "/artwork/img_2967_microcosm/thumb.gif",
    id: "img_2967_microcosm",
    images: [
      { image: "/artwork/img_2967_microcosm/full_1.jpg", name: "img_2967■□microcosm" },
    ],
    position: { y: 30, x: 37 }
  },
  {
    title: "lovelyday1",
    thumbnail: "/artwork/lovelyday1/thumb.gif",
    id: "lovelyday1",
    images: [
      { image: "/artwork/lovelyday1/full_1.png", name: "lovelyday(soon→enough)" },
    ],
    position: { y: 38, x: 25 }
  },
  {
    title: "tvr_kyoto",
    thumbnail: "/artwork/tvr_kyoto/thumb.gif",
    id: "tvr_kyoto",
    images: [
      { image: "/artwork/tvr_kyoto/full_1.gif", name: "tvr kyoto" },
    ],
    position: { y: 37, x: 63 }
  },
  {
    title: "chiyo_chan_3",
    thumbnail: "/artwork/chiyo_chan_3/thumb.gif",
    id: "chiyo_chan_3",
    images: [
      { image: "/artwork/chiyo_chan_3/full_1.jpg", name: "im sorry for distorting u chii-chan from girls last tour." },
      { image: "/artwork/chiyo_chan_3/full_2.jpg", name: "ちーちゃんごめんね" },
    ],
    position: { y: 42, x: 45 }
  },
  {
    title: "moss_sit_7",
    thumbnail: "/artwork/moss_sit_7/thumb.gif",
    id: "moss_sit_7",
    images: [
      { image: "/artwork/moss_sit_7/full_1.jpg", name: "metalmoss" },
      { image: "/artwork/moss_sit_7/full_2.jpg", name: "moss sit" },
    ],
    position: { y: 38, x: 92 }
  },
  {
    title: "what_a_day_3",
    thumbnail: "/artwork/what_a_day_3/thumb.gif",
    id: "what_a_day_3",
    images: [
      { image: "/artwork/what_a_day_3/full_1.png", name: "what a day" },
    ],
    position: { y: 45, x: 75 }
  },
  {
    title: "ikeriji_street_5",
    thumbnail: "/artwork/ikeriji_street_5/thumb.gif",
    id: "ikeriji_street_5",
    images: [
      { image: "/artwork/ikeriji_street_5/full_1.jpg", name: "池尻大橋通り ( Ikejiri-ōhashi street )" },
    ],
    position: { y: 50, x: 90 }
  },
  {
    title: "dios_mio2",
    thumbnail: "/artwork/dios_mio2/thumb.gif",
    id: "dios_mio2",
    images: [
      { image: "/artwork/dios_mio2/full_1.gif", name: "日常displace (mio loses it) mio 3d model by snowtenkey _snow311" },
    ],
    position: { y: 45, x: 7 }
  },
  {
    title: "yotsuba_clover_4_larger",
    thumbnail: "/artwork/yotsuba_clover_4_larger/thumb.gif",
    id: "yotsuba_clover_4_larger",
    images: [
      { image: "/artwork/yotsuba_clover_4_larger/full_1.jpg", name: "yotsuba in the clovers / クローバーでよつば" },
    ],
    position: { y: 48, x: 56 }
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