import createAssetLoader, { AssetLoaders } from "../../utility/assetLoader";

const options = [
  {
    color: "/backgrounds/home_screen_color.jpg",
    depth: "/backgrounds/home_screen_depth.png",
    starting: Date.now() > new Date(2025, 8, 6).getTime(),
    colourPerChannel: 2.75,
    contrastBoost: 1.6,
  },
  {
    color: "/backgrounds/bamboo_forest_edit.jpg",
    depth: "/backgrounds/bamboo_forest_depth.jpg",
    starting: true,
    colourPerChannel: 4,
    contrastBoost: 1.0,
  },
  {
    color: "/backgrounds/church_color.jpg",
    depth: "/backgrounds/church_depth.jpg",
    starting: true,
    colourPerChannel: 3.5,
    contrastBoost: 0.9,
  },
  {
    color: "/backgrounds/treedee_color.jpg",
    depth: "/backgrounds/treedee_depth.jpg",
    starting: true,
    colourPerChannel: 3.0,
    contrastBoost: 1.3,
  },
  {
    color: "/backgrounds/nagano_color.jpg",
    depth: "/backgrounds/nagano_depth.jpg",
    starting: true,
    colourPerChannel: 3,
    contrastBoost: 1,
  },
  {
    color: "/backgrounds/viaduct_color.jpg",
    depth: "/backgrounds/viaduct_depth.jpg",
    starting: true,
    colourPerChannel: 3.0,
    contrastBoost: 1.1,
  },
];

function get_previous_index() {
  const prev = localStorage.getItem("prev_index");
  return prev ? Number(prev) : undefined;
}

function save_selected_index(index: number) {
  localStorage.setItem("prev_index", String(index));
}

function get_random_starting() {
  const opt = options.filter((opt) => opt.starting);
  const random = opt[Math.floor(opt.length * Math.random())];
  return options.indexOf(random);
}

function get_index() {
  let idx = get_previous_index();

  if (typeof idx === "undefined") {
    idx = get_random_starting();
  } else {
    idx += 1;
  }

  let safe_idx = idx % options.length;

  if (Number.isNaN(safe_idx)) {
    safe_idx = 0;
  }

  save_selected_index(safe_idx);
  return safe_idx;
}

const asset = options[get_index()];

const color = AssetLoaders.image(asset.color);
const depth = AssetLoaders.image(asset.depth);

const homeScreenAssets = async () => ({
  colourPerChannel: asset.colourPerChannel,
  contrastBoost: asset.contrastBoost,
  ...(await createAssetLoader({
    color,
    depth,
  })()),
});

export default homeScreenAssets;
