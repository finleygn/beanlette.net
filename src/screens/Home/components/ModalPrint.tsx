import { createSignal, For, JSXElement, onCleanup, onMount } from "solid-js";
import "./Modal.css";
import { useNavigate } from "@solidjs/router";
import { AssetLoaders } from "../../../utility/assetLoader";

type JsImage = { name?: string; image: HTMLImageElement; aspect: number };

interface ModalProps {
  images: { name?: string; image: string }[];
  description: JSXElement;
}

function ModalPrint(props: ModalProps) {
  const [images, setImages] = createSignal<JsImage[]>();
  const [loading, setLoading] = createSignal(true);

  const nav = useNavigate();
  let loaderRef: HTMLImageElement | undefined = undefined;

  function hideLoader() {
    setLoading(false);
    if (loaderRef) loaderRef.classList.add("modal-loader-image--removed");
  }

  function loadImages(): Promise<PromiseSettledResult<JsImage>[]> {
    return Promise.allSettled(
      props.images.map(
        (image) =>
          new Promise<JsImage>((res) => {
            AssetLoaders.image(image.image)().then((img) =>
              res({
                name: image.name,
                image: img,
                aspect: img.width / img.height,
              })
            );
          })
      )
    );
  }

  function onKeyPress(event: KeyboardEvent) {
    if (event.key === "Escape") {
      nav("/", { scroll: false });
    }
  }

  onMount(() => {
    window.addEventListener("keydown", onKeyPress);

    document.body.style.overflow = "hidden";

    loadImages().then((images) => {
      const successfulImages = images
        .filter((i) => i.status === "fulfilled")
        .map((i) => i.value);
      hideLoader();
      setImages(successfulImages);
    });

    onCleanup(() => {
      document.body.style.overflow = "auto";
    });
  });

  onCleanup(() => {
    window.removeEventListener("keydown", onKeyPress);
  });

  return (
    <div class="modal" onClick={() => nav("/", { scroll: false })}>
      <img ref={loaderRef} class="modal-loader-image" src="/loader.gif" />

      <div class="modal-scroller">
        <div
          role="dialog"
          classList={{ ["fade-in"]: !loading(), "modal-content": true }}
        >
          <div class="modal-content-flex" onClick={(e) => e.stopPropagation()}>
            <div
              classList={{
                "modal__prints-img-grid": true,
                [`modal__prints-img-grid--${images()?.length}`]: true,
              }}
            >
              <For each={images()}>
                {(item) => (
                  <img
                    src={item.image.src}
                    draggable={false}
                    style={{ "aspect-ratio": item.aspect }}
                  />
                )}
              </For>
            </div>
            <div class="prints-sidebar" onClick={(e) => e.stopPropagation()}>
              {props.description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalPrint;
