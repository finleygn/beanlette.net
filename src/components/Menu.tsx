import { useContext } from 'solid-js';
import './menu.css';
import { useCursorContext } from '../context/DogCursor';

function Menu() {
  const cursorContext = useCursorContext();

  return (
    <div id="title">
      <header>
        <h1>beanlette</h1>
      </header>
      <footer>
        <a
          href="https://x.com/majorbean_"
          target="_blank"
          onmouseover={() => cursorContext.setHovered(true)}
          onmouseout={() => cursorContext.setHovered(false)}
        >
          twitter ♪
        </a>
        <a href="https://www.instagram.com/beanlette.aep" target="_blank">instagram ☆</a>
        <a href="mailto:noah@beanlette.net" target="_blank">email ✉</a>
      </footer>
    </div>
  )
}

export default Menu;