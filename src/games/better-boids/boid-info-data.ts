import { ContentDataProps } from "@/src/types/data-props";

export const boidInfoData: ContentDataProps[] = [
  {
    type: "h1",
    text: "About Boids",
  },
  {
    type: "paragraph",
    text: 'The <a href="https://en.wikipedia.org/wiki/Boids" target="_blank" rel="noopener noreferrer">Boids algorithm</a>, devised by Craig Reynolds, mimics the flocking behavior seen in birds and other animals. In general, Boids follow three rules:',
  },
  {
    type: "list",
    items: [
      "<b>Alignment:</b> Boids try to align their direction with other nearby Boids.",
      "<b>Cohesion:</b> Boids move towards the average position of nearby Boids.",
      "<b>Separation:</b> Boids avoid crowding near other Boids.",
    ],
  },
  {
    type: "paragraph",
    text: "From these three simple rules, complex emergent behavior and intricate patterns can arise. This little game is an attempt to display the beauty in the Boids algorithm, while expanding on it with novel concepts where applicable.",
  },
];
