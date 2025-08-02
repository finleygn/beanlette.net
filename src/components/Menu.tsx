import { onCleanup, onMount } from "solid-js";
import "./Menu.css";
import BackgroundRenderer from "../background/BackgroundRenderer";
import { isMobile } from "../utility/isMobile";

interface MenuProps {
  backgroundRenderer: BackgroundRenderer;
}

function Menu({ backgroundRenderer }: MenuProps) {
  let containerRef: HTMLImageElement | undefined;

  onMount(() => {
    const unsubscribe = backgroundRenderer.onUpdate(() => {
      if (!containerRef) return;
      if (isMobile()) {
        containerRef.style.transform = `translate(-50%, -50%)`;
      } else {
        const { x, y } = backgroundRenderer.currentMousePosition;
        const xTransform = `calc(-50% + ${(x.value - 0.5) * -1 * 80}%)`;
        const yTransform = `calc(-50% + ${(y.value - 0.5) * -1 * 80}%)`;
        containerRef.style.transform = `translate(${xTransform}, ${yTransform})`;
      }
    });
    onCleanup(unsubscribe);
  });

  return (
    <div id="title" ref={containerRef}>
      <header>
        <h1>beanlette</h1>
      </header>
      <footer>
        <a href="https://x.com/majorbean_" target="_blank">
          twitter ♪
        </a>
        <a href="https://www.instagram.com/beanlette.aep" target="_blank">
          instagram ☆
        </a>
        <a href="mailto:noah@beanlette.net" target="_blank">
          email ✉
        </a>
      </footer>
    </div>
  );
}

export default Menu;
