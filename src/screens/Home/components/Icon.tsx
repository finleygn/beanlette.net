import { A } from '@solidjs/router';
import './Icon.css';

interface IconProps {
  title: string;
  thumbnail: string;
  id: string;
  position: { y: number, x: number };
}

function Icon({ title, thumbnail, id, position }: IconProps) {
  return (
    <A
      noScroll
      class="artwork-icon"
      href={`/${id}`}
      style={{ top: `${position.y}%`, left: `${position.x}%` }}
    >
      <img src={thumbnail} />
      <span>{title}</span>
    </A>
  )
}

export default Icon;