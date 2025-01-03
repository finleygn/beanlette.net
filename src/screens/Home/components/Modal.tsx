import { createSignal, For, onCleanup, onMount, Show } from 'solid-js';
import './Modal.css';
import { useNavigate } from '@solidjs/router';
import { AssetLoaders } from '../../../utility/assetLoader';

interface ModalProps {
  images: { name?: string; image: string; }[]
}



function Modal(props: ModalProps) {
  const [images, setImages] = createSignal<{ name?: string, image: HTMLImageElement }[]>();
  const [loading, setLoading] = createSignal(true);
  const nav = useNavigate();
  let loaderRef: HTMLImageElement | undefined = undefined;
  let imageContainerRef: HTMLImageElement | undefined = undefined;
  
  function hideLoader() {
    if(loaderRef) loaderRef.classList.add("modal-loader-image--removed")
  }

  function loadImages(): Promise<PromiseSettledResult<{ name?: string; image: HTMLImageElement; }>[]> {
    return Promise.allSettled(
      props.images.map(image => new Promise<{ name?: string; image: HTMLImageElement; }>((res) => {
        AssetLoaders.image(image.image)().then((img) => res({ name: image.name, image: img }));
      }))
    )
  }

  onMount(() => {
    document.body.style.overflow = 'hidden';

    loadImages()
      .then((images) => {
        const successfulImages = images.filter(i => i.status === 'fulfilled').map(i => i.value);
        hideLoader();
        setLoading(false);
        setImages(successfulImages)
      });

    onCleanup(() => {
      document.body.style.overflow = 'auto';
    })
  });

  return (
    <div class="sub-screen" onClick={() => nav("/", { scroll: false })}>

      <img ref={loaderRef} class="modal-loader-image" src="/loader.gif" />
      
      <div role="dialog" ref={imageContainerRef} classList={{
        "sub-screen__content": true,
        [`sub-screen__content--${images()?.length}`]: true,
        ["fade-in"]: !loading()
      }}>
        <For each={images()}>
          {item => (
            <div onClick={e => e.stopPropagation()}><img src={item.image.src} draggable={false}/>
              <Show when={item.name}><p>{item.name}</p></Show>
            </div>
          )}
        </For>
      </div>
    </div>
  )
}

export default Modal;