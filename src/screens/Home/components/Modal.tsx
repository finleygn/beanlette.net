import {
  createSignal,
  For,
  JSXElement,
  onCleanup,
  onMount,
  Show,
} from "solid-js";
import "./Modal.css";
import { useLocation, useNavigate } from "@solidjs/router";
import { AssetLoaders } from "../../../utility/assetLoader";
import { path_append } from "../../../utility/path";

type JsImage = { name?: string; image: HTMLImageElement; aspect: number };

interface ModalProps {
  images: { name?: string; image: string }[];
  print?: {
    available: boolean;
    images: { name?: string; image: string }[];
    description: JSXElement;
  };
}

function Modal(props: ModalProps) {
  const [images, setImages] = createSignal<JsImage[]>();
  const [loading, setLoading] = createSignal(true);
  const location = useLocation();

  const nav = useNavigate();
  let loaderRef: HTMLImageElement | undefined = undefined;
  let imageContainerRef: HTMLImageElement | undefined = undefined;

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
          ref={imageContainerRef}
          onClick={(e) => e.stopPropagation()}
          classList={{ ["fade-in"]: !loading(), "modal-content": true }}
        >
          <div
            classList={{
              "modal__img-grid": true,
              [`modal__img-grid--${images()?.length}`]: true,
            }}
          >
            <For each={images()}>
              {(item) => (
                <div class="modal__img-grid-cell">
                  <img
                    src={item.image.src}
                    draggable={false}
                    style={{ "aspect-ratio": item.aspect }}
                  />
                  <Show when={item.name}>
                    <p>{item.name}</p>
                  </Show>
                </div>
              )}
            </For>
          </div>
          {props.print && (
            <div
              style={{
                display: "flex",
                "justify-content": "center",
                "flex-shrink": 0,
                "margin-top": "12px",
              }}
            >
              <a href={path_append(location.pathname, "pieces")}>
                <img
                  class="for-sale-tag"
                  onClick={(e) => e.stopPropagation()}
                  src="/meow/prints.svg"
                />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Modal;
