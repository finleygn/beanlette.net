import { createSignal, For, JSXElement, Match, onCleanup, onMount, Show, Switch } from 'solid-js';
import './Modal.css';
import { useNavigate } from '@solidjs/router';
import { AssetLoaders } from '../../../utility/assetLoader';

interface ModalProps {
  images: { name?: string; image: string; }[];
  print?: {
    available: boolean;
    images: { name?: string; image: string; }[]
    description: JSXElement;
  }
}

function Modal(props: ModalProps) {
  const [images, setImages] = createSignal<{ name?: string, image: HTMLImageElement }[]>();
  const [printImages, setPrintImages] = createSignal<{ name?: string, image: HTMLImageElement }[]>();
  const [loading, setLoading] = createSignal(true);
  const [showPrints, setShowPrints] = createSignal(false);

  const nav = useNavigate();
  let loaderRef: HTMLImageElement | undefined = undefined;
  let imageContainerRef: HTMLImageElement | undefined = undefined;

  function hideLoader() {
    setLoading(false)
    if (loaderRef) loaderRef.classList.add("modal-loader-image--removed")
  }
  function showLoader() {
    setLoading(true)
    if (loaderRef) loaderRef.classList.remove("modal-loader-image--removed")
  }

  function loadImages(): Promise<PromiseSettledResult<{ name?: string; image: HTMLImageElement; }>[]> {
    return Promise.allSettled(
      props.images.map(image => new Promise<{ name?: string; image: HTMLImageElement; }>((res) => {
        AssetLoaders.image(image.image)().then((img) => res({ name: image.name, image: img }));
      }))
    )
  }

  function loadPrintImages(): Promise<PromiseSettledResult<{ name?: string; image: HTMLImageElement; }>[]> {
    if(!props.print) return Promise.resolve([]);
    return Promise.allSettled(
      props.print?.images.map(image => new Promise<{ name?: string; image: HTMLImageElement; }>((res) => {
        AssetLoaders.image(image.image)().then((img) => res({ name: image.name, image: img }));
      }))
    )
  }

  function seePrints() {
    setShowPrints(true)
    showLoader();
    loadPrintImages()
      .then(images => {
        const successfulImages = images.filter(i => i.status === 'fulfilled').map(i => i.value);
        hideLoader();
        setPrintImages(successfulImages)
      })
  }

  onMount(() => {
    document.body.style.overflow = 'hidden';

    loadImages()
      .then((images) => {
        const successfulImages = images.filter(i => i.status === 'fulfilled').map(i => i.value);
        hideLoader();
        setImages(successfulImages)
      });

    onCleanup(() => {
      document.body.style.overflow = 'auto';
    })
  });

  return (
    <div class="sub-screen" onClick={() => nav("/", { scroll: false })}>

      <img ref={loaderRef} class="modal-loader-image" src="/loader.gif" />

      <Switch>
        <Match when={showPrints() === false}>
          <div role="dialog" ref={imageContainerRef} classList={{ ["fade-in"]: !loading(), 'sub-screen-dialog': true }} style={{ "align-content": 'center' }}>
            <div classList={{
              "sub-screen__content": true,
              [`sub-screen__content--${images()?.length}`]: true,
            }}>
              <For each={images()}>
                {item => (
                  <div onClick={e => e.stopPropagation()}><img src={item.image.src} draggable={false} />
                    <Show when={item.name}><p>{item.name}</p></Show>
                  </div>
                )}
              </For>
            </div>
            {props.print && (
              <div onClick={e => e.stopPropagation()} style={{ display: 'flex', "justify-content": 'center', "margin-top": '12px' }}>
                <button class="for-sale-tag for-sale-tag--button" onClick={e => e.stopPropagation()} on:click={seePrints}>
                  prints &gt;
                </button>
              </div>
            )}
          </div>
        </Match>

        {props.print && (
          <Match when={showPrints() === true}>
            <div role="dialog" classList={{ ["fade-in"]: !loading(), 'sub-screen-dialog': true }} style={{ "align-content": 'center' }}>
              <div style={{ display: 'flex', gap: '40px' }}>
                <div classList={{
                  "sub-screen__content": true,
                  [`sub-screen__content--${printImages()?.length}`]: true,
                }}>
                  <For each={printImages()}>
                    {item => (
                      <div onClick={e => e.stopPropagation()}><img src={item.image.src} draggable={false} />
                        <Show when={item.name}><p>{item.name}</p></Show>
                      </div>
                    )}
                  </For>
                </div>
                <div class="prints-sidebar" onClick={e => e.stopPropagation()}>
                  {props.print.description}
                  <p>
                    worldwide shipping available~
                  </p>
                  <div style={{ "margin-top": "48px" }} />
                  <a href="mailto:" style={{ "text-decoration": 'none', color: 'white' }}>
                    ✉ : noah@beanlette.net
                  </a>
                </div>
              </div>
            </div>
          </Match>
        )}
      </Switch>
    </div>
  )
}

export default Modal;