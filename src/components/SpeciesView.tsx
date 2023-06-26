import { type SpeciesInfo } from '../lib/firebase';

type Props = {
  species: SpeciesInfo[];
};

export default function SpeciesView({ species }: Props) {
  const imageList = species.map(({ species, updatedAt }) => (
    <div className="info" key={species}>
      <div>Namn: {species}</div>
      <div>Skapad: {updatedAt.toDate().toLocaleDateString()}</div>
    </div>
  ));

  return <div className="gallery">{imageList}</div>;
}
