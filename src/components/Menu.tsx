import { onCleanup, onMount } from 'solid-js';
import MousePositionTracker from '../background/MousePositionTracker';
import './menu.css';
import BackgroundRenderer from '../background/BackgroundRenderer';

interface MenuProps {

  backgroundRenderer: BackgroundRenderer;
}

function Menu({ backgroundRenderer }: MenuProps) {
  let containerRef: HTMLImageElement | undefined;

  onMount(() => {
    const unsubscribe = backgroundRenderer.onUpdate(() => {
      if(!containerRef) return;
      const { x, y } = backgroundRenderer.currentMousePosition;
      const xTransform = `calc(-50% + ${((x.get() - 0.5) * -1) * 100}%)`;
      const yTransform = `calc(-50% + ${((y.get() - 0.5)) * 100}%)`;
      containerRef.style.transform = `translate(${xTransform}, ${yTransform})`;
    })
    
    onCleanup(unsubscribe);
  });


  return (
    <div id="title" ref={containerRef}>
      <header>
        <h1>beanlette</h1>
      </header>
      <footer>
        <a href="https://x.com/majorbean_" target="_blank">twitter ♪</a>
        <a href="https://www.instagram.com/beanlette.aep" target="_blank">instagram ☆</a>
        <a href="mailto:noah@beanlette.net" target="_blank">email ✉</a>
      </footer>
    </div>
  )
}

export default Menu;