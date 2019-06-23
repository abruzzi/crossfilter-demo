const ratings = [2.4814814814814814, 3, 2.8181818181818183, 2, 2, 3, 5, 2.4814814814814814];

const categories = [
  "Technical",
  "Testing",
  "Consulting",
  "Domain",
  "BA & XD",
  "Management & Planning",
  "Language"
];

const data = categories.reduce((p, c, i) => {
  p.push({
    category: c,
    rating: ratings[i]
  })
  return p;
}, []);