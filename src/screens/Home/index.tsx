import { JSX, JSXElement, Match, onCleanup, onMount, Switch } from "solid-js";
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
  images: { image: string; name?: string }[];
  // percentage of 100vw for x or 200vh for y
  position: { y: number; x: number };
  prints?: {
    available: boolean;
    images: { image: string }[];
    description: JSXElement;
  };
}

const artwork: Artwork[] = [
  {
    title: "nagato_cherry_style",
    thumbnail: "/artwork/nagato_cherry_style/thumb.gif",
    id: "nagato_cherry_style",
    position: { y: 3, x: 20 },
    images: [
      {
        image: "/artwork/nagato_cherry_style/full_1.jpg",
        name: "nagato (green)",
      },
    ],
  },
  {
    title: "water_cycle_13_2",
    thumbnail: "/artwork/water_cycle_13_2/thumb.gif",
    id: "water_cycle_13_2",
    position: { y: 78, x: 47 },
    images: [
      { image: "/artwork/water_cycle_13_2/full_1.jpg", name: "water cycle↺↺↺" },
    ],
  },
  {
    title: "oaksplitt",
    thumbnail: "/artwork/oaksplitt/thumb.gif",
    id: "oaksplitt",
    position: { y: 16, x: 8 },
    images: [
      { image: "/artwork/oaksplitt/full_1.gif", name: "oaksplitt" },
      { image: "/artwork/oaksplitt/full_2.jpg", name: "oaksplit2" },
    ],
    prints: {
      available: true,
      images: [
        { image: "/artwork/oaksplitt/prints/oaksplit real 1.jpg" },
        { image: "/artwork/oaksplitt/prints/oaksplit real 2.jpg" },
        { image: "/artwork/oaksplitt/prints/oaksplit real 3.jpg" },
      ],
      description: (
        <>
          <p>Oaksplit — £300</p>
          <p>A tree in Suffolk.</p>
          <p>Limited run of 10 signed pieces.</p>
          <p>300x400mm</p>
        </>
      ),
    },
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
    position: { y: 10, x: 60 },
  },
  {
    title: "hanbee_nya",
    thumbnail: "/artwork/hanbee_nya/thumb.gif",
    id: "hanbee_nya",
    images: [
      { image: "/artwork/hanbee_nya/full_1.jpg", name: "=) ⁿʸᵃ (with hanbee)" },
    ],
    position: { y: 7, x: 85 },
  },
  {
    title: (
      <>
        miku_interpolate_
        <wbr />
        do_u_recognise_
        <wbr />
        her_3
      </>
    ),
    thumbnail: "/artwork/miku_interpolate_do_u_recognise_her_3/thumb.gif",
    id: "miku_interpolate_do_u_recognise_her_3",
    images: [
      {
        image: "/artwork/miku_interpolate_do_u_recognise_her_3/full_1.gif",
        name: "interpolate39",
      },
      {
        image: "/artwork/miku_interpolate_do_u_recognise_her_3/full_2.jpg",
        name: "do u recognise her",
      },
    ],
    position: { y: 15, x: 90 },
  },
  {
    title: "plast_emotion_2",
    thumbnail: "/artwork/plast_emotion_2/thumb.gif",
    id: "plast_emotion_2",
    images: [
      {
        image: "/artwork/plast_emotion_2/full_1.jpg",
        name: "plast:emotion ₂₀₀₀",
      },
      { image: "/artwork/plast_emotion_2/full_2.jpg" },
    ],
    position: { y: 90, x: 74 },
  },
  {
    title: "forest_pixels_4",
    thumbnail: "/artwork/forest_pixels_4/thumb.gif",
    id: "forest_pixels_4",
    images: [
      {
        image: "/artwork/forest_pixels_4/full_1.jpg",
        name: "fae forest down pixelly bluebell",
      },
      { image: "/artwork/forest_pixels_4/full_2.jpg", name: "fae forest pfp" },
      {
        image: "/artwork/forest_pixels_4/full_3.jpg",
        name: "bluebell forest pixelly",
      },
      {
        image: "/artwork/forest_pixels_4/full_4.jpg",
        name: "bluebell forest fae entrance",
      },
    ],
    position: { y: 16, x: 40 },
  },
  {
    title: "oh_2",
    thumbnail: "/artwork/oh_2/thumb.gif",
    id: "oh_2",
    images: [{ image: "/artwork/oh_2/full_1.jpg", name: "Oh?" }],
    position: { y: 20, x: 70 },
    prints: {
      available: true,
      images: [
        { image: "/artwork/oh_2/prints/oh real 1.jpg" },
        { image: "/artwork/oh_2/prints/oh real 2.jpg" },
        { image: "/artwork/oh_2/prints/oh real 3.jpg" },
      ],
      description: (
        <>
          <p>Oh? £250 300x300mm</p>
          <p>Feels like discovery.</p>
          <p>Limited run of 10 signed pieces.</p>
        </>
      ),
    },
  },
  {
    title: "jyoucyo_ascii_3_FINAL_MAYBE",
    thumbnail: "/artwork/jyoucyo_ascii_3_FINAL_MAYBE/thumb.gif",
    id: "jyoucyo_ascii_3_FINAL_MAYBE",
    images: [
      { image: "/artwork/jyoucyo_ascii_3_FINAL_MAYBE/full_1.jpg", name: "Oh?" },
    ],
    position: { y: 30, x: 80 },
    prints: {
      available: true,
      images: [
        { image: "/artwork/oaksplitt/prints/oaksplit real 1.jpg" },
        { image: "/artwork/oaksplitt/prints/oaksplit real 2.jpg" },
        { image: "/artwork/oaksplitt/prints/oaksplit real 3.jpg" },
      ],
      description: (
        <>
          <p>ascii girl: £900 400x506mm</p>
          <p>
            From 'Skybox' exhibition in Tokyo. Collaboration between jyoucyo and
            beanlette.
          </p>
          <p>Signed 1 of 1.</p>
        </>
      ),
    },
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
    position: { y: 26, x: 24 },
  },
  {
    title: "rei_displace_4",
    thumbnail: "/artwork/rei_displace_4/thumb.gif",
    id: "rei_displace_4",
    images: [
      { image: "/artwork/rei_displace_4/full_1.png", name: "reidisplace" },
      { image: "/artwork/rei_displace_4/full_2.png" },
    ],
    position: { y: 32, x: 13 },
  },
  {
    title: "img_2967_microcosm",
    thumbnail: "/artwork/img_2967_microcosm/thumb.gif",
    id: "img_2967_microcosm",
    images: [
      {
        image: "/artwork/img_2967_microcosm/full_1.jpg",
        name: "img_2967■□microcosm",
      },
    ],
    position: { y: 30, x: 37 },
  },
  {
    title: "lovelyday1",
    thumbnail: "/artwork/lovelyday1/thumb.gif",
    id: "lovelyday1",
    images: [
      {
        image: "/artwork/lovelyday1/full_1.png",
        name: "lovelyday(soon→enough)",
      },
    ],
    position: { y: 42, x: 25 },
  },
  {
    title: "tvr_kyoto",
    thumbnail: "/artwork/tvr_kyoto/thumb.gif",
    id: "tvr_kyoto",
    images: [{ image: "/artwork/tvr_kyoto/full_1.gif", name: "tvr kyoto" }],
    position: { y: 37, x: 63 },
  },
  {
    title: "chiyo_chan_3",
    thumbnail: "/artwork/chiyo_chan_3/thumb.gif",
    id: "chiyo_chan_3",
    images: [
      {
        image: "/artwork/chiyo_chan_3/full_1.jpg",
        name: "im sorry for distorting u chii-chan from girls last tour.",
      },
      { image: "/artwork/chiyo_chan_3/full_2.jpg", name: "ちーちゃんごめんね" },
    ],
    position: { y: 42, x: 45 },
  },
  {
    title: "moss_sit_7",
    thumbnail: "/artwork/moss_sit_7/thumb.gif",
    id: "moss_sit_7",
    images: [
      { image: "/artwork/moss_sit_7/full_1.jpg", name: "metalmoss" },
      { image: "/artwork/moss_sit_7/full_2.jpg", name: "moss sit" },
    ],
    position: { y: 38, x: 92 },
    prints: {
      available: true,
      images: [
        { image: "/artwork/moss_sit_7/prints/mossy real 1.jpg" },
        { image: "/artwork/moss_sit_7/prints/mossy real 2.jpg" },
        { image: "/artwork/moss_sit_7/prints/mossy real 3.jpg" },
      ],
      description: (
        <>
          <p>Mossy sit: £300 300x400mm</p>
          <p>Girl sitting in a strange green world.</p>
          <p>Limited run of 10 signed pieces.</p>
        </>
      ),
    },
  },
  {
    title: "what_a_day_3",
    thumbnail: "/artwork/what_a_day_3/thumb.gif",
    id: "what_a_day_3",
    images: [{ image: "/artwork/what_a_day_3/full_1.png", name: "what a day" }],
    position: { y: 45, x: 75 },
  },
  {
    title: "ikeriji_street_5",
    thumbnail: "/artwork/ikeriji_street_5/thumb.gif",
    id: "ikeriji_street_5",
    images: [
      {
        image: "/artwork/ikeriji_street_5/full_1.jpg",
        name: "池尻大橋通り ( Ikejiri-ōhashi street )",
      },
    ],
    position: { y: 50, x: 90 },
  },
  {
    title: "dios_mio2",
    thumbnail: "/artwork/dios_mio2/thumb.gif",
    id: "dios_mio2",
    images: [
      {
        image: "/artwork/dios_mio2/full_1.gif",
        name: "日常displace (mio loses it) mio 3d model by snowtenkey _snow311",
      },
    ],
    position: { y: 45, x: 7 },
  },
  {
    title: "yotsuba_clover_4_larger",
    thumbnail: "/artwork/yotsuba_clover_4_larger/thumb.gif",
    id: "yotsuba_clover_4_larger",
    images: [
      {
        image: "/artwork/yotsuba_clover_4_larger/full_1.jpg",
        name: "yotsuba in the clovers / クローバーでよつば",
      },
    ],
    position: { y: 48, x: 56 },
  },
  {
    title: "img_4791_3",
    thumbnail: "/artwork/img_4791_3/thumb.gif",
    id: "img_4791_3",
    images: [{ image: "/artwork/img_4791_3/full_1.gif", name: "img_4791_3" }],
    position: { y: 53, x: 40 },
  },
  {
    title: "egg_anime_2_no_dither_inklab2",
    thumbnail: "/artwork/egg_anime_2_no_dither_inklab2/thumb.gif",
    id: "egg_anime_2_no_dither_inklab2",
    images: [
      {
        image: "/artwork/egg_anime_2_no_dither_inklab2/full_1.jpg",
        name: "egg anime i cant remebmer the name of",
      },
      {
        image: "/artwork/egg_anime_2_no_dither_inklab2/full_2.png",
        name: "i just rememebered its called wonder egg priority",
      },
    ],
    position: { y: 60, x: 64 },
  },
  {
    title: "welcome_home_beanlet_final_white",
    thumbnail: "/artwork/welcome_home_beanlet_final_white/thumb.gif",
    id: "welcome_home_beanlet_final_white",
    images: [
      {
        image: "/artwork/welcome_home_beanlet_final_white/full_1.jfif",
        name: "Welcome Home! (daily 988)",
      },
      { image: "/artwork/welcome_home_beanlet_final_white/full_2.jfif" },
      { image: "/artwork/welcome_home_beanlet_final_white/full_3.jpg" },
      { image: "/artwork/welcome_home_beanlet_final_white/full_4.jpg" },
    ],
    position: { y: 65, x: 85 },
  },
  {
    title: "flitter1",
    thumbnail: "/artwork/flitter1/thumb.gif",
    id: "flitter1",
    images: [
      { image: "/artwork/flitter1/full_1.png", name: "flitter1" },
      { image: "/artwork/flitter1/full_2.jpg", name: "flitter2" },
      { image: "/artwork/flitter1/full_3.jpg", name: "flitter3" },
      { image: "/artwork/flitter1/full_4.jpg", name: "flitter4" },
    ],
    position: { y: 57, x: 22 },
    prints: {
      available: true,
      images: [
        { image: "/artwork/oaksplitt/prints/oaksplit real 1.jpg" },
        { image: "/artwork/oaksplitt/prints/oaksplit real 2.jpg" },
        { image: "/artwork/oaksplitt/prints/oaksplit real 3.jpg" },
      ],
      description: (
        <>
          <p>flitter 1 + 2: £350 400x400mm</p>
          <p>Distorted petals.</p>
          <p>Limited run of 10 signed pieces.</p>
        </>
      ),
    },
  },
  {
    title: "blipblop21",
    thumbnail: "/artwork/blipblop21/thumb.gif",
    id: "blipblop21",
    images: [
      { image: "/artwork/blipblop21/full_1.jpg", name: "blipblop2" },
      { image: "/artwork/blipblop21/full_2.jpg" },
    ],
    position: { y: 63, x: 12 },
  },
  {
    title: "who_knows_3",
    thumbnail: "/artwork/who_knows_3/thumb.gif",
    id: "who_knows_3",
    images: [{ image: "/artwork/who_knows_3/full_1.png", name: "who knows" }],
    position: { y: 68, x: 34 },
  },
  {
    title: "bluebell_process_4",
    thumbnail: "/artwork/bluebell_process_4/thumb.gif",
    id: "bluebell_process_4",
    images: [
      {
        image: "/artwork/bluebell_process_4/full_1.png",
        name: "i miss the bluebells",
      },
      { image: "/artwork/bluebell_process_4/full_2.jpg" },
    ],
    position: { y: 75, x: 22 },
  },
  {
    title: (
      <>
        doesnt_
        <wbr />
        have_
        <wbr />
        to_
        <wbr />
        make_
        <wbr />
        much_
        <wbr />
        sense_
        <wbr />
        at_
        <wbr />
        all_1.1
      </>
    ),
    thumbnail:
      "/artwork/google_maps__doesnt_have_to_make_much_sense_at_all_1/thumb.gif",
    id: "google_maps__doesnt_have_to_make_much_sense_at_all_1",
    images: [
      {
        image:
          "/artwork/google_maps__doesnt_have_to_make_much_sense_at_all_1/full_1.jpg",
        name: "Doesn't have to mean much at all",
      },
    ],
    position: { y: 6, x: 45 },
    prints: {
      available: true,
      images: [
        { image: "/artwork/oaksplitt/prints/oaksplit real 1.jpg" },
        { image: "/artwork/oaksplitt/prints/oaksplit real 2.jpg" },
        { image: "/artwork/oaksplitt/prints/oaksplit real 3.jpg" },
      ],
      description: (
        <>
          <p>Doesn't have to mean much at all: £350 533x300mm</p>
          <p>Computer screenshot.</p>
          <p>Limited run of 10 signed pieces.</p>
        </>
      ),
    },
  },
  {
    title: "cube_rainbow_logo",
    thumbnail: "/artwork/cube_rainbow_logo/thumb.gif",
    id: "cube_rainbow_logo",
    images: [
      {
        image: "/artwork/cube_rainbow_logo/full_1.png",
        name: "something is wrong with my cube shaped car [rainbow cube]",
      },
    ],
    position: { y: 83, x: 10 },
  },
  {
    title: "farreach1",
    thumbnail: "/artwork/farreach1/thumb.gif",
    id: "farreach1",
    images: [{ image: "/artwork/farreach1/full_1.jpg", name: "farrreach" }],
    position: { y: 94, x: 16 },
  },
  {
    title: "menma5.1",
    thumbnail: "/artwork/menma5/thumb.gif",
    id: "menma5",
    images: [
      {
        image: "/artwork/menma5/full_1.jpg",
        name: "shes hiding in the flowers",
      },
    ],
    position: { y: 90, x: 40 },
  },
  {
    title: (
      <>
        playstation_
        <wbr />
        cat_
        <wbr />
        poster_1.1_process
      </>
    ),
    thumbnail: "/artwork/fucked_up_playstation_cat_poster_1/thumb.gif",
    id: "fucked_up_playstation_cat_poster_1",
    images: [
      {
        image: "/artwork/fucked_up_playstation_cat_poster_1/full_1.jpg",
        name: "His fucked up",
      },
    ],
    position: { y: 83, x: 60 },
  },
  {
    title: "plast_create",
    thumbnail: "/artwork/plast_create/thumb.gif",
    id: "plast_create",
    images: [
      { image: "/artwork/plast_create/full_1.jpg", name: "plast:create ₂₀₀₃" },
    ],
    position: { y: 85, x: 90 },
  },
  {
    title: "vapour_levels4_dither",
    thumbnail: "/artwork/vapour_levels4_dither/thumb.gif",
    id: "vapour_levels4_dither",
    images: [
      {
        image: "/artwork/vapour_levels4_dither/full_1.png",
        name: "vapour levels",
      },
    ],
    position: { y: 73, x: 75 },
  },
  {
    title: "phritz_daisy",
    thumbnail: "/artwork/daisy_phritz/thumb.gif",
    id: "phritz_daisy",
    images: [
      { image: "/artwork/daisy_phritz/full_1.jpg", name: "daisy phritz" },
    ],
    position: { y: 12, x: 27 },
    prints: {
      available: true,
      images: [
        { image: "/artwork/oaksplitt/prints/oaksplit real 1.jpg" },
        { image: "/artwork/oaksplitt/prints/oaksplit real 2.jpg" },
        { image: "/artwork/oaksplitt/prints/oaksplit real 3.jpg" },
      ],
      description: (
        <>
          <p>Daisy: £350 533x300mm</p>
          <p>38.70560 N, 139.96610 E.</p>
          <p>Limited run of 10 signed pieces.</p>
        </>
      ),
    },
  },
];

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
