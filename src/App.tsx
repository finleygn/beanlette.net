import { createEffect, createSignal, onMount, Show } from "solid-js";
import createAssetLoader, { AssetLoaders } from "./utility/assetLoader";
import BackgroundRenderer from "./background/BackgroundRenderer";
import DogCursor from "./components/DogCursor";
import homeScreenAssets from "./screens/Home/assets";
import HomeScreen from "./screens/Home";
import Menu from "./components/Menu";
import { Route, Router } from "@solidjs/router";

const fetchGlobalAsssets = createAssetLoader({
  cursor_bobocube_default: AssetLoaders.image("/cursor/bobocube_default.gif"),
  cursor_bobocube_hover: AssetLoaders.image("/cursor/bobocube_hover.gif"),
});

function App(props: { backgroundRenderer: BackgroundRenderer }) {
  const [assets, setAssets] =
    createSignal<Awaited<ReturnType<typeof fetchGlobalAsssets>>>();

  const [assetsLoading, setAssetsLoading] = createSignal(true);
  const [initialBackgroundReady, setInitialBackgroundReady] =
    createSignal(false);

  onMount(async () => {
    await homeScreenAssets();
    setAssets(await fetchGlobalAsssets());

    setAssetsLoading(false);
  });

  createEffect(() => {
    const finished = !assetsLoading() && initialBackgroundReady();

    if (finished) {
      /**
       * Remove loading screen
       */
      const blockingLoader =
        document.getElementsByClassName("blocking-loader")[0];
      const blockingLoaderImage = document.getElementsByClassName(
        "blocking-loader-image"
      )[0] as HTMLElement;

      blockingLoaderImage.addEventListener("animationend", () => {
        blockingLoader?.classList.add("blocking-loader--removed");
      });

      blockingLoaderImage?.classList.add("blocking-loader-image--removed");
    }
  });

  return (
    <Show when={!!assets()}>
      <DogCursor
        enabled={!assetsLoading()}
        default={assets()!.cursor_bobocube_default}
        hovered={assets()!.cursor_bobocube_hover}
      />

      <Menu backgroundRenderer={props.backgroundRenderer} />

      <Router>
        <Route
          path="*"
          component={() => (
            <HomeScreen
              backgroundRender={props.backgroundRenderer}
              onBackgroundReady={() => setInitialBackgroundReady(true)}
            />
          )}
        />
      </Router>

      <div id="built-by">
        [built by <a href="https://finley.fish" target="_blank">finley.fish</a>]
      </div>
    </Show>
  );
}

export default App;
