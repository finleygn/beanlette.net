import { createContext, createEffect, createSignal, JSXElement, onCleanup, onMount } from "solid-js";
import { Portal } from "solid-js/web";
import './CursorProvider.css';

interface CursorContextValue {
  setHovered(value: boolean): void;
}

const CursorContext = createContext({} as CursorContextValue);

interface CursorProviderProps {
  enabled: boolean;
  default: HTMLImageElement;
  hovered: HTMLImageElement;
  children: JSXElement;
}

function CursorProvider(props: CursorProviderProps) {
  let cursorRef: HTMLImageElement | undefined;

  const [hovered, setHovered] = createSignal(false);
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

  createEffect(() => {
    const isHovered = hovered();
    if(!cursorRef) return;
    
    if(isHovered) {
      cursorRef.src = props.hovered.src;
    } else {
      cursorRef.src = props.default.src;
    }
  });

  return (
    <CursorContext.Provider value={{ setHovered }}>
      <Portal>
        <img
          ref={cursorRef}
          src={props.default.src}
          classList={{
            cursor: true,
            'cursor--enabled': props.enabled && hasMoved()
          }}
        />
      </Portal>
      {props.children}
    </CursorContext.Provider>
  )
}

export default CursorProvider;