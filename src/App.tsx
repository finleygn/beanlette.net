import { createEffect, createSignal, Match, onMount, Show, Switch } from 'solid-js';
import createAssetLoader, { AssetLoaders } from './utility/assetLoader';
import BackgroundRenderer from './background/BackgroundRenderer';
import CursorProvider from './context/CursorProvider';
import Screen from './screens/Screen';
import homeScreenAssets from './screens/Home/assets';
import HomeScreen from './screens/Home';
import CommissionScreen from './screens/Commissions';

const fetchGlobalAsssets = createAssetLoader({
  cursor_bobocube_default: AssetLoaders.image('/cursor/bobocube_default.gif'),
  cursor_bobocube_hover: AssetLoaders.image('/cursor/bobocube_hover.gif')
});

function App(props: { backgroundRenderer: BackgroundRenderer }) {
  const [a, setA] = createSignal(false)
  const [assets, setAssets] = createSignal<Awaited<ReturnType<typeof fetchGlobalAsssets>>>();

  const [loading, setLoading] = createSignal(true);

  onMount(async () => {
    await homeScreenAssets();
    setAssets(await fetchGlobalAsssets());
    setLoading(false);

    window.addEventListener('click', () => setA(!a()))
  });

  createEffect(() => {
    const finished = !loading();

    if(finished) {
      const blockingLoader = document.getElementsByClassName('blocking-loader')[0];
      const blockingLoaderImage = document.getElementsByClassName('blocking-loader-image')[0];

      blockingLoader?.classList.add('blocking-loader--removed')
      blockingLoaderImage?.classList.add('blocking-loader-image--removed')
    }
  })

  return (
    <Show when={!!assets()}>
      <CursorProvider
        enabled={!loading()}
        default={assets()!.cursor_bobocube_default}
        hovered={assets()!.cursor_bobocube_hover}
      >
        <Switch fallback={<div>Not Found</div>}>
          <Match when={a() === false}>
            <HomeScreen backgroundRender={props.backgroundRenderer} />
          </Match>
          <Match when={a() === true}>
            <CommissionScreen backgroundRender={props.backgroundRenderer} />
          </Match>
        </Switch>
      </CursorProvider>
    </Show>
    
  );
}

export default App
