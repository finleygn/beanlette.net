import { A } from "@solidjs/router";
import "./Icon.css";
import { JSX, Ref } from "solid-js";

interface IconProps {
  title: JSX.Element;
  thumbnail: string;
  id: string;
  position: { y: number; x: number };
  available?: boolean;
  ref: Ref<HTMLAnchorElement>;
}

function Icon({ title, thumbnail, id, position, available, ref }: IconProps) {
  return (
    <A
      noScroll
      class="artwork-icon"
      href={`/${id}`}
      ref={ref}
      style={{ top: `${position.y}%`, left: `${position.x}%` }}
    >
      <img src={thumbnail} draggable={false} alt={`${title} thumbnail`} class="artwork-icon__thumbnail" />
      <span class="artwork-icon__text">{title}</span>
      {available && <img src="/meow/prints-available.svg" class="artwork-icon__badge" />}
    </A>
  );
}

export default Icon;
