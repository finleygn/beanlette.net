import {
  createSignal,
  For,
  JSXElement,
  Match,
  onCleanup,
  onMount,
  Show,
  Switch,
} from "solid-js";
import "./Modal.css";
import { useNavigate } from "@solidjs/router";
import { AssetLoaders } from "../../../utility/assetLoader";

type JsImage = { name?: string; image: HTMLImageElement, aspect: number };

interface ModalProps {
  images: { name?: string; image: string }[];
  print?: {
    available: boolean;
    images: { name?: string; image: string }[];
    description: JSXElement;
  };
}

function Modal(props: ModalProps) {
  const [images, setImages] =
    createSignal<JsImage[]>();
  const [printImages, setPrintImages] =
    createSignal<JsImage[]>();
  const [loading, setLoading] = createSignal(true);
  const [showPrints, setShowPrints] = createSignal(false);

  const nav = useNavigate();
  let loaderRef: HTMLImageElement | undefined = undefined;
  let imageContainerRef: HTMLImageElement | undefined = undefined;

  function hideLoader() {
    setLoading(false);
    if (loaderRef) loaderRef.classList.add("modal-loader-image--removed");
  }
  function showLoader() {
    setLoading(true);
    if (loaderRef) loaderRef.classList.remove("modal-loader-image--removed");
  }

  function loadImages(): Promise<
    PromiseSettledResult<JsImage>[]
  > {
    return Promise.allSettled(
      props.images.map(
        (image) =>
          new Promise<JsImage>((res) => {
            AssetLoaders.image(image.image)().then((img) =>
              res({ name: image.name, image: img, aspect: img.width / img.height })
            );
          })
      )
    );
  }

  function loadPrintImages(): Promise<
    PromiseSettledResult<JsImage>[]
  > {
    if (!props.print) return Promise.resolve([]);
    return Promise.allSettled(
      props.print?.images.map(
        (image) =>
          new Promise<JsImage>((res) => {
            AssetLoaders.image(image.image)().then((img) =>
              res({ name: image.name, image: img, aspect: img.width / img.height })
            );
          })
      )
    );
  }

  function seePrints() {
    setShowPrints(true);
    showLoader();
    loadPrintImages().then((images) => {
      const successfulImages = images
        .filter((i) => i.status === "fulfilled")
        .map((i) => i.value);
      hideLoader();
      setPrintImages(successfulImages);
    });
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
        <Switch>
          <Match when={showPrints() === false}>
            <div
              role="dialog"
              ref={imageContainerRef}
              classList={{ ["fade-in"]: !loading(), "modal-content": true }}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                classList={{
                  "modal__img-grid": true,
                  [`modal__img-grid--${images()?.length}`]: true,
                }}
              >
                <For each={images()}>
                  {(item) => (
                    <div class="modal__img-grid-cell">
                      <img src={item.image.src} draggable={false} style={{ "aspect-ratio": item.aspect }} />
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
                    "margin-top": '12px'
                  }}
                >
                  <img
                    class="for-sale-tag"
                    onClick={(e) => e.stopPropagation()}
                    on:click={seePrints}
                    src="/meow/prints.svg"
                  />
                </div>
              )}
            </div>
          </Match>

          {props.print && (
            <Match when={showPrints() === true}>
              <div
                role="dialog"
                classList={{ ["fade-in"]: !loading(), "modal-content": true }}
              >
                <div class='modal-content-flex'>
                  <div
                    classList={{
                      "modal__prints-img-grid": true,
                      [`modal__prints-img-grid--${printImages()?.length}`]: true,
                    }}
                  >
                    <For each={printImages()}>
                      {(item) => (

                        <img src={item.image.src} draggable={false} style={{ "aspect-ratio": item.aspect }} />
       
      
                      )}
                    </For>
                  </div>
                  <div
                    class="prints-sidebar"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {props.print.description}
                    <p>worldwide shipping available~</p>
                    <div style={{ "margin-top": "48px" }} />
                    <a
                      href="mailto:"
                      style={{ "text-decoration": "none", color: "white" }}
                    >
                      ✉ : noah@beanlette.net
                    </a>
                  </div>
                </div>
              </div>
            </Match>
          )}
        </Switch>
      </div>
    </div>
  );
}

export default Modal;
