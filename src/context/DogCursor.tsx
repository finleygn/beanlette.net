import { createContext, createEffect, createSignal, JSXElement, onCleanup, onMount, useContext } from "solid-js";
import { Portal } from "solid-js/web";
import './DogCursor.css';

interface CursorContextValue {
  setHovered(value: boolean): void;
}

export const CursorContext = createContext({} as CursorContextValue);

interface DogCursorProps {
  enabled: boolean;
  default: HTMLImageElement;
  hovered: HTMLImageElement;
}

function DogCursor(props: DogCursorProps) {
  let cursorRef: HTMLImageElement | undefined;

  const [hasMoved, setHasMoved] = createSignal(false);

  const onMouseMove = (mouseEvent: MouseEvent) => {
    if(!cursorRef) return;
    setHasMoved(true);
    cursorRef.style.left = `${mouseEvent.clientX}px`;
    cursorRef.style.top = `${mouseEvent.clientY}px`;
  };

  onMount(() => {
    window.addEventListener('mousemove', onMouseMove)
  });

  onCleanup(() => {
    window.removeEventListener('mousemove', onMouseMove)
  });

  return (
    <Portal>
      <div ref={cursorRef} classList={{
        cursor: true,
        'cursor--enabled': props.enabled && hasMoved()
      }}>
        <img
          src={props.default.src}
          class='cursor__image cursor__image--default'
        />
        <img
          src={props.hovered.src}
          class='cursor__image cursor__image--hovered'
        />
      </div>
    </Portal>
  )
}

export const useCursorContext = () => {
  return useContext(CursorContext);
}

export default DogCursor;