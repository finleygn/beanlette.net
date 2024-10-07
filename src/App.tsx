import { createEffect, createSignal, Match, onMount, Show, Switch } from 'solid-js';
import createAssetLoader, { AssetLoaders } from './utility/assetLoader';
import BackgroundRenderer from './background/BackgroundRenderer';
import DogCursor from './context/DogCursor';
import homeScreenAssets from './screens/Home/assets';
import HomeScreen from './screens/Home';
import CommissionScreen from './screens/Commissions';
import Menu from './components/Menu';

const fetchGlobalAsssets = createAssetLoader({
  cursor_bobocube_default: AssetLoaders.image('/cursor/bobocube_default.gif'),
  cursor_bobocube_hover: AssetLoaders.image('/cursor/bobocube_hover.gif')
});

function App(props: { backgroundRenderer: BackgroundRenderer }) {
  const [a, setA] = createSignal(false)
  const [assets, setAssets] = createSignal<Awaited<ReturnType<typeof fetchGlobalAsssets>>>();

  const [assetsLoading, setAssetsLoading] = createSignal(true);
  const [initialBackgroundReady, setInitialBackgroundReady] = createSignal(false);

  onMount(async () => {
    await homeScreenAssets();
    setAssets(await fetchGlobalAsssets());

    setAssetsLoading(false);
  });

  createEffect(() => {
    const finished = !assetsLoading() && initialBackgroundReady();

    if(finished) {
      /**
       * Remove loading screen
       */
      const blockingLoader = document.getElementsByClassName('blocking-loader')[0];
      const blockingLoaderImage = document.getElementsByClassName('blocking-loader-image')[0];

      blockingLoader?.classList.add('blocking-loader--removed');
      blockingLoaderImage?.classList.add('blocking-loader-image--removed');

      window.addEventListener('click', () => setA(!a()))
    }
  })

  return (
    <Show when={!!assets()}>
      <DogCursor
        enabled={!assetsLoading()}
        default={assets()!.cursor_bobocube_default}
        hovered={assets()!.cursor_bobocube_hover}
      />
      <Menu />
      <Switch fallback={<div>Not Found</div>}>
        <Match when={a() === false}>
          <HomeScreen
            backgroundRender={props.backgroundRenderer}
            onBackgroundReady={() => setInitialBackgroundReady(true)}
          />
        </Match>
        <Match when={a() === true}>
          <CommissionScreen
            backgroundRender={props.backgroundRenderer}
            onBackgroundReady={() => setInitialBackgroundReady(true)}
          />
        </Match>
      </Switch>
    </Show>
    
  );
}

export default App
