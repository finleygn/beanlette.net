import './Icon.css';

interface IconProps {
  title: string;
  images: string[];
  thumbnail: string;
  id: string;
}

function Icon({ title, thumbnail, id }: IconProps) {
  return (
    <a class="artwork-icon" href={`/meowmoew/${id}`}>
      <img src={thumbnail} />
      <span>{title}</span>
    </a>
  )
}

export default Icon;