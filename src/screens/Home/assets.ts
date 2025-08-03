import createAssetLoader, { AssetLoaders } from "../../utility/assetLoader";

const options = [
  {
    color: "/backgrounds/home_screen_color.jpg",
    depth: "/backgrounds/home_screen_depth.png",
    starting: Date.now() > new Date(2025, 8, 6).getTime(),
  },
  {
    color: "/backgrounds/bamboo_forest_edit.jpg",
    depth: "/backgrounds/bamboo_forest_depth.jpg",
    starting: true,
  },
  {
    color: "/backgrounds/church_color.jpg",
    depth: "/backgrounds/church_depth.jpg",
    starting: true,
  },
  // {
  //   color: "/backgrounds/lilypad_color.jpg",
  //   depth: "/backgrounds/lilypad_depth.jpg",
  //   starting: true,
  // },
  {
    color: "/backgrounds/treedee_color.jpg",
    depth: "/backgrounds/treedee_depth.jpg",
    starting: true,
  },
  {
    color: "/backgrounds/nagano_color.jpg",
    depth: "/backgrounds/nagano_depth.jpg",
    starting: true,
  },
  {
    color: "/backgrounds/viaduct_color.jpg",
    depth: "/backgrounds/viaduct_depth.jpg",
    starting: true,
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

  const safe_idx = idx % options.length;

  save_selected_index(safe_idx);
  return safe_idx;
}

const asset = options[get_index()];

const homeScreenAssets = createAssetLoader({
  color: AssetLoaders.image(asset.color),
  depth: AssetLoaders.image(asset.depth),
});

export default homeScreenAssets;
