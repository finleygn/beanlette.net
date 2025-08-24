import { A } from "@solidjs/router";
import "./Icon.css";
import { JSX } from "solid-js";

interface IconProps {
  title: JSX.Element;
  thumbnail: string;
  id: string;
  position: { y: number; x: number };
  available?: boolean;
}

function Icon({ title, thumbnail, id, position, available }: IconProps) {
  return (
    <div
      class="artwork-icon"
      style={{ top: `${position.y}%`, left: `${position.x}%` }}
    >
      <A noScroll draggable={false} href={`/${id}`} class="artwork-icon__link">
        <img
          src={thumbnail}
          draggable={false}
          alt={`${title} thumbnail`}
          class="artwork-icon__thumbnail"
        />
        <span class="artwork-icon__text">{title}</span>
      </A>
      {available && (
        <A
          noScroll
          draggable={false}
          href={`/${id}/pieces`}
          class="artwork-icon__badge_link"
        >
          <img src="/meow/prints-available.svg" class="artwork-icon__badge" />
        </A>
      )}
    </div>
  );
}

export default Icon;
