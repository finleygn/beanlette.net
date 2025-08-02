import { JSX, JSXElement } from "solid-js";

export interface Artwork {
  title: JSX.Element;
  thumbnail: string;
  id: string;
  images: { image: string; name?: string }[];
  // percentage of 100vw for x or 200vh for y
  position: {
    [minWidth: number]: { y: number; x: number };
  };
  prints?: {
    available: boolean;
    images: { image: string }[];
    description: JSXElement;
  };
}

const BREAK_DESKTOP = 600;

const email = (
  <a
    href="mailto:noah@beanlette.net"
    style={{ "text-decoration": "none", color: "white" }}
  >
    ✉ : noah@beanlette.net
  </a>
);

export const artwork: Artwork[] = [
  {
    title: "nagato_cherry_style",
    thumbnail: "/artwork/nagato_cherry_style/thumb.gif",
    id: "nagato_cherry_style",
    position: {
      [0]: { y: 4, x: 21 },
      [BREAK_DESKTOP]: { y: 3, x: 20 },
    },
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
    position: {
      [0]: { y: 78, x: 80 },
      [BREAK_DESKTOP]: { y: 74, x: 47 },
    },
    images: [
      { image: "/artwork/water_cycle_13_2/full_1.jpg", name: "water cycle↺↺↺" },
    ],
  },
  {
    title: "oaksplitt",
    thumbnail: "/artwork/oaksplitt/thumb.gif",
    id: "oaksplitt",
    position: {
      [0]: { y: 20, x: 12 },
      [BREAK_DESKTOP]: { y: 16, x: 8 },
    },
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
          <p>Oaksplit — £300 / ¥55,000</p>
          <br />
          <p>A tree in Suffolk.</p>
          <br />
          <p>Limited run of 10 signed pieces.</p>
          <p>300x400mm</p>
          <p>Aluminum diabond print, epoxy resin</p>
          <br />
          <p>worldwide shipping available~</p>
          {email}
          <a
            href="https://suchas.square.site/product/oaksplit-beanlette/2008"
            class="nice-link"
          >
            available at Such As, Gallery
          </a>
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
    position: {
      [0]: { y: 38, x: 85 },
      [BREAK_DESKTOP]: { y: 38, x: 92 },
    },
  },
  {
    title: "hanbee_nya",
    thumbnail: "/artwork/hanbee_nya/thumb.gif",
    id: "hanbee_nya",
    images: [
      { image: "/artwork/hanbee_nya/full_1.jpg", name: "=) ⁿʸᵃ (with hanbee)" },
    ],
    position: {
      [0]: { y: 75, x: 30 },
      [BREAK_DESKTOP]: { y: 7, x: 80 },
    },
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
    position: {
      [0]: { y: 14, x: 85 },
      [BREAK_DESKTOP]: { y: 15, x: 90 },
    },
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
    position: {
      [0]: { y: 92, x: 74 },
      [BREAK_DESKTOP]: { y: 90, x: 74 },
    },
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
    position: {
      [0]: { y: 64, x: 40 },
      [BREAK_DESKTOP]: { y: 16, x: 40 },
    },
  },
  {
    title: "oh_2",
    thumbnail: "/artwork/oh_2/thumb.gif",
    id: "oh_2",
    images: [{ image: "/artwork/oh_2/full_1.jpg", name: "Oh?" }],
    position: {
      [0]: { y: 23, x: 70 },
      [BREAK_DESKTOP]: { y: 18, x: 70 },
    },
    prints: {
      available: true,
      images: [
        { image: "/artwork/oh_2/prints/oh real 1.jpg" },
        { image: "/artwork/oh_2/prints/oh real 2.jpg" },
        { image: "/artwork/oh_2/prints/oh real 3.jpg" },
      ],
      description: (
        <>
          <p>Daisy — £250</p>
          <br />
          <p>Feels like discovery.</p>
          <br />
          <p>300x300mm</p>
          <p>Aluminum diabond print, epoxy resin</p>
          <p>Limited run of 10 signed pieces.</p>
          <br />
          <p>worldwide shipping available~</p>
          {email}
        </>
      ),
    },
  },
  {
    title: "jyoucyo_ascii_3_FINAL_MAYBE",
    thumbnail: "/artwork/jyoucyo_ascii_3_FINAL_MAYBE/thumb.gif",
    id: "jyoucyo_ascii_3_FINAL_MAYBE",
    images: [
      {
        image: "/artwork/jyoucyo_ascii_3_FINAL_MAYBE/full_1.jpg",
        name: "jyoucyo_ascii_3",
      },
    ],
    position: {
      [0]: { y: 31, x: 70 },
      [BREAK_DESKTOP]: { y: 30, x: 80 },
    },
    prints: {
      available: true,
      images: [
        {
          image:
            "/artwork/jyoucyo_ascii_3_FINAL_MAYBE/prints/ascii girl real 1.jpg",
        },
        {
          image:
            "/artwork/jyoucyo_ascii_3_FINAL_MAYBE/prints/ascii girl real 2.jpg",
        },
      ],
      description: (
        <>
          <p>ascii girl — £900 / ¥180,000</p>
          <br />
          <p>
            From 'Skybox' exhibition in Tokyo. Collaboration between jyoucyo and
            beanlette.
          </p>

          <br />
          <p>400x506mm</p>
          <p>Aluminum diabond print, epoxy resin, acrylic bubbles</p>
          <p>Signed 1 of 1.</p>

          <br />
          <a
            href="https://suchas.square.site/product/ascii-girl-jyoucyo-beanlette/2006"
            class="nice-link"
          >
            available at Such As, Gallery
          </a>
          {email}
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
    position: {
      [0]: { y: 9, x: 55 },
      [BREAK_DESKTOP]: { y: 24, x: 22 },
    },
  },
  {
    title: "rei_displace_4",
    thumbnail: "/artwork/rei_displace_4/thumb.gif",
    id: "rei_displace_4",
    images: [
      { image: "/artwork/rei_displace_4/full_1.png", name: "reidisplace" },
      { image: "/artwork/rei_displace_4/full_2.png" },
    ],
    position: {
      [0]: { y: 30, x: 20 },
      [BREAK_DESKTOP]: { y: 32, x: 13 },
    },
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
    position: {
      [0]: { y: 24, x: 35 },
      [BREAK_DESKTOP]: { y: 30, x: 37 },
    },
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
    position: {
      [0]: { y: 36, x: 25 },
      [BREAK_DESKTOP]: { y: 42, x: 25 },
    },
  },
  {
    title: "tvr_kyoto",
    thumbnail: "/artwork/tvr_kyoto/thumb.gif",
    id: "tvr_kyoto",
    images: [{ image: "/artwork/tvr_kyoto/full_1.gif", name: "tvr kyoto" }],
    position: {
      [0]: { y: 57, x: 18 },
      [BREAK_DESKTOP]: { y: 57, x: 22 },
    },
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
    position: {
      [0]: { y: 42, x: 45 },
      [BREAK_DESKTOP]: { y: 42, x: 45 },
    },
  },
  {
    title: "moss_sit_7",
    thumbnail: "/artwork/moss_sit_7/thumb.gif",
    id: "moss_sit_7",
    images: [
      { image: "/artwork/moss_sit_7/full_1.jpg", name: "metalmoss" },
      { image: "/artwork/moss_sit_7/full_2.jpg", name: "moss sit" },
    ],
    position: {
      [0]: { y: 56, x: 60 },
      [BREAK_DESKTOP]: { y: 10, x: 60 },
    },
    prints: {
      available: true,
      images: [
        { image: "/artwork/moss_sit_7/prints/mossy real 1.jpg" },
        { image: "/artwork/moss_sit_7/prints/mossy real 2.jpg" },
        { image: "/artwork/moss_sit_7/prints/mossy real 3.jpg" },
      ],
      description: (
        <>
          <p>Mossy sit — £300</p>
          <br />
          <p>Girl sitting in a strange green world.</p>
          <br />
          <p>300x400mm</p>
          <p>Aluminum diabond print, epoxy resin</p>
          <p>Limited run of 10 signed pieces.</p>
          <br />
          <p>worldwide shipping available~</p>

          {email}
        </>
      ),
    },
  },
  {
    title: "what_a_day_3",
    thumbnail: "/artwork/what_a_day_3/thumb.gif",
    id: "what_a_day_3",
    images: [{ image: "/artwork/what_a_day_3/full_1.png", name: "what a day" }],
    position: {
      [0]: { y: 45, x: 75 },
      [BREAK_DESKTOP]: { y: 45, x: 75 },
    },
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
    position: {
      [0]: { y: 52, x: 85 },
      [BREAK_DESKTOP]: { y: 52, x: 90 },
    },
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
    position: {
      [0]: { y: 45, x: 12 },
      [BREAK_DESKTOP]: { y: 45, x: 7 },
    },
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
    position: {
      [0]: { y: 48, x: 40 },
      [BREAK_DESKTOP]: { y: 48, x: 56 },
    },
  },
  {
    title: "img_4791_3",
    thumbnail: "/artwork/img_4791_3/thumb.gif",
    id: "img_4791_3",
    images: [{ image: "/artwork/img_4791_3/full_1.gif", name: "img_4791_3" }],
    position: {
      [0]: { y: 53, x: 42 },
      [BREAK_DESKTOP]: { y: 53, x: 40 },
    },
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
    position: {
      [0]: { y: 60, x: 65 },
      [BREAK_DESKTOP]: { y: 60, x: 60 },
    },
  },
  {
    title: (
      <>
        welcome_home_beanlet_
        <wbr />
        final_white
      </>
    ),
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
    position: {
      [0]: { y: 65, x: 80 },
      [BREAK_DESKTOP]: { y: 65, x: 85 },
    },
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
    position: {
      [0]: { y: 37, x: 54 },
      [BREAK_DESKTOP]: { y: 37, x: 63 },
    },
    prints: {
      available: true,
      images: [
        { image: "/artwork/flitter1/prints/flitter 1 real 1.jpg" },
        { image: "/artwork/flitter1/prints/flitter 1 real 2.jpg" },
        { image: "/artwork/flitter1/prints/flitter 1 real 3.jpg" },
        { image: "/artwork/flitter1/prints/flitter 2 real 1.jpg" },
        { image: "/artwork/flitter1/prints/flitter 2 real 2.jpg" },
        { image: "/artwork/flitter1/prints/flitter 2 real 3.jpg" },
      ],
      description: (
        <>
          <p>flitter 1 — £300</p>
          <p>flitter 2 — £300</p>
          <br />
          <p>Distorted petals.</p>
          <br />
          <p>400x400mm</p>
          <p>Aluminum diabond print, epoxy resin</p>
          <p>Limited run of 10 signed pieces.</p>
          <br />
          <p>worldwide shipping available~</p>

          {email}
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
    position: {
      [0]: { y: 65, x: 10 },
      [BREAK_DESKTOP]: { y: 65, x: 10 },
    },
  },
  {
    title: "who_knows_3",
    thumbnail: "/artwork/who_knows_3/thumb.gif",
    id: "who_knows_3",
    images: [{ image: "/artwork/who_knows_3/full_1.png", name: "who knows" }],
    position: {
      [0]: { y: 69, x: 34 },
      [BREAK_DESKTOP]: { y: 68, x: 34 },
    },
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
    position: {
      [0]: { y: 80, x: 22 },
      [BREAK_DESKTOP]: { y: 77, x: 22 },
    },
  },
  {
    title: (
      <>
        doesnt_have_to_
        <wbr />
        make_much_sense_
        <wbr />
        at_all_1.1
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
    position: {
      [0]: { y: 4, x: 80 },
      [BREAK_DESKTOP]: { y: 6, x: 45 },
    },
    prints: {
      available: true,
      images: [
        {
          image:
            "/artwork/google_maps__doesnt_have_to_make_much_sense_at_all_1/prints/doesnt have to real 1.jpg",
        },
        {
          image:
            "/artwork/google_maps__doesnt_have_to_make_much_sense_at_all_1/prints/doesnt have to real 2.jpg",
        },
        {
          image:
            "/artwork/google_maps__doesnt_have_to_make_much_sense_at_all_1/prints/doesnt have to real 3.jpg",
        },
      ],
      description: (
        <>
          <p>Doesn't have to mean much at all — £350 / ¥70,000</p>
          <br />
          <p>Computer screenshot.</p>
          <br />
          <p>533x300mm</p>
          <p>Aluminum diabond print, epoxy resin</p>
          <p>Limited run of 10 signed pieces.</p>
          <br />
          <p>worldwide shipping available~</p>

          {email}
          <a
            href="https://suchas.square.site/product/doesn-t-have-to-beanlette/2007"
            class="nice-link"
          >
            available at Such As, Gallery
          </a>
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
    position: {
      [0]: { y: 85, x: 16 },
      [BREAK_DESKTOP]: { y: 83, x: 10 },
    },
  },
  {
    title: "farreach1",
    thumbnail: "/artwork/farreach1/thumb.gif",
    id: "farreach1",
    images: [{ image: "/artwork/farreach1/full_1.jpg", name: "farrreach" }],
    position: {
      [0]: { y: 94, x: 16 },
      [BREAK_DESKTOP]: { y: 94, x: 16 },
    },
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
    position: {
      [0]: { y: 90, x: 40 },
      [BREAK_DESKTOP]: { y: 90, x: 40 },
    },
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
    position: {
      [0]: { y: 83, x: 60 },
      [BREAK_DESKTOP]: { y: 83, x: 60 },
    },
  },
  {
    title: "plast_create",
    thumbnail: "/artwork/plast_create/thumb.gif",
    id: "plast_create",
    images: [
      { image: "/artwork/plast_create/full_1.jpg", name: "plast:create ₂₀₀₃" },
    ],
    position: {
      [0]: { y: 85, x: 90 },
      [BREAK_DESKTOP]: { y: 85, x: 90 },
    },
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
    position: {
      [0]: { y: 71, x: 70 },
      [BREAK_DESKTOP]: { y: 71, x: 70 },
    },
  },
  {
    title: "phritz_daisy",
    thumbnail: "/artwork/daisy_phritz/thumb.gif",
    id: "phritz_daisy",
    images: [
      { image: "/artwork/daisy_phritz/full_1.jpg", name: "daisy phritz" },
    ],
    position: {
      [0]: { y: 11, x: 24 },
      [BREAK_DESKTOP]: { y: 12, x: 27 },
    },
    prints: {
      available: true,
      images: [
        { image: "/artwork/daisy_phritz/prints/daisy real 1.jpg" },
        { image: "/artwork/daisy_phritz/prints/daisy real 2.jpg" },
        { image: "/artwork/daisy_phritz/prints/daisy real 3.jpg" },
      ],
      description: (
        <>
          <p>Daisy — £350 / ¥70,000</p>
          <br />
          <p>38.70560 N, 139.96610 E.</p>
          <br />
          <p>533x300mm</p>
          <p>Aluminum diabond print, epoxy resin</p>
          <p>Limited run of 10 signed pieces.</p>
          <br />
          <p>worldwide shipping available~</p>

          {email}
          <a
            href="https://suchas.square.site/product/daisy-beanlette/2011"
            class="nice-link"
          >
            available at Such As, Gallery
          </a>
        </>
      ),
    },
  },
];
