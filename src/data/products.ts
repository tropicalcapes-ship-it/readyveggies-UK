export type Category =
  | 'Vegetables'
  | 'Fruit'
  | 'Salad & Greens'
  | 'Dairy & Eggs'
  | 'Bakery & Pantry'

export interface Product {
  id: string
  name: string
  category: Category
  /** Price in pence, so totals never suffer floating point drift. */
  pricePence: number
  unit: string
  tag: string
  shortDescription: string
  description: string
  image: string
  origin: string
  inSeason: boolean
}

export const categories: Array<Category> = [
  'Vegetables',
  'Fruit',
  'Salad & Greens',
  'Dairy & Eggs',
  'Bakery & Pantry',
]

const products: Array<Product> = [
  {
    id: 'heirloom-tomatoes',
    name: 'Heirloom Tomatoes',
    category: 'Vegetables',
    pricePence: 420,
    unit: '500g mixed',
    tag: 'Picked today',
    shortDescription: 'Sun-ripened mix of Black Krim, Green Zebra and Costoluto.',
    description:
      'Grown in our unheated polytunnels and picked at full blush, never green. Each 500g bag is a mix of whatever is best that morning — expect Black Krim, Green Zebra, Costoluto and a handful of sweet cherry toms. Keep them out of the fridge for the fullest flavour.',
    image: 'heirloom-tomatoes',
    origin: 'Tunnel 3, Hollow Field',
    inSeason: true,
  },
  {
    id: 'rainbow-carrots',
    name: 'Rainbow Carrots',
    category: 'Vegetables',
    pricePence: 320,
    unit: 'bunch with tops',
    tag: 'Soil-fresh',
    shortDescription: 'Purple, yellow and classic orange, pulled with tops on.',
    description:
      'Pulled the morning of your delivery and left unwashed, which is how carrots keep their sweetness. The feathery tops make a punchy pesto — snap them off before storing the roots in the fridge.',
    image: 'rainbow-carrots',
    origin: 'Lower Acre',
    inSeason: true,
  },
  {
    id: 'sweetcorn',
    name: 'Sweetcorn',
    category: 'Vegetables',
    pricePence: 280,
    unit: '4 cobs',
    tag: 'Same-day pick',
    shortDescription: 'Cut at dawn, because corn starts losing sugar the moment it leaves the stalk.',
    description:
      'We cut sweetcorn the same morning it goes out for delivery. Husks stay on to hold the moisture in. Boil for three minutes, or grill in the husk until the outer leaves char.',
    image: 'sweetcorn',
    origin: 'Top Field',
    inSeason: true,
  },
  {
    id: 'new-potatoes',
    name: 'New Potatoes',
    category: 'Vegetables',
    pricePence: 350,
    unit: '1.5kg',
    tag: 'Farm favourite',
    shortDescription: 'Thin-skinned earlies that need nothing but butter and mint.',
    description:
      'Charlotte and Pentland Javelin, lifted young so the skins rub away under your thumb. No need to peel. Boil for twelve minutes, drain, then toss with farmhouse butter and a sprig of mint.',
    image: 'new-potatoes',
    origin: 'Lower Acre',
    inSeason: true,
  },
  {
    id: 'strawberries',
    name: 'Strawberries',
    category: 'Fruit',
    pricePence: 390,
    unit: '400g punnet',
    tag: 'Peak season',
    shortDescription: 'Fully red to the core — picked ripe, not ripened in transit.',
    description:
      'Malling Centenary grown in raised beds and picked ripe, which is why they will not last a week in the fridge like supermarket berries. Eat within two days and keep them at room temperature for an hour before serving.',
    image: 'strawberries',
    origin: 'Berry Beds, Home Field',
    inSeason: true,
  },
  {
    id: 'orchard-apples',
    name: 'Orchard Apples',
    category: 'Fruit',
    pricePence: 300,
    unit: '1kg',
    tag: 'Heritage trees',
    shortDescription: 'Discovery and Egremont Russet from the old orchard.',
    description:
      'Our orchard predates the farmhouse, and some of these trees are pushing ninety years old. Expect a few marks — unsprayed fruit looks lived-in and tastes far better for it.',
    image: 'orchard-apples',
    origin: 'The Old Orchard',
    inSeason: true,
  },
  {
    id: 'rhubarb',
    name: 'Pink Rhubarb',
    category: 'Fruit',
    pricePence: 290,
    unit: '600g bundle',
    tag: 'Limited',
    shortDescription: 'Tender forced stalks, sharp and vivid pink.',
    description:
      'Forced under terracotta cloches in the walled garden, which keeps the stalks slim, pink and far less stringy than field-grown rhubarb. Roast with a spoonful of our wildflower honey.',
    image: 'rhubarb',
    origin: 'Walled Garden',
    inSeason: false,
  },
  {
    id: 'salad-leaves',
    name: 'Mixed Salad Leaves',
    category: 'Salad & Greens',
    pricePence: 250,
    unit: '150g bag',
    tag: 'Cut to order',
    shortDescription: 'Oak leaf, rocket and mizuna cut the morning it ships.',
    description:
      'A living mix that changes through the season — oak leaf, rocket, mizuna, red mustard and whatever else is at its best. Cut, rinsed in cold spring water and bagged loose so the leaves do not bruise.',
    image: 'salad-leaves',
    origin: 'Tunnel 1',
    inSeason: true,
  },
  {
    id: 'curly-kale',
    name: 'Curly Kale',
    category: 'Salad & Greens',
    pricePence: 260,
    unit: 'large bunch',
    tag: 'Frost sweetened',
    shortDescription: 'Dark crinkled leaves that get sweeter after the first frost.',
    description:
      'Grown slowly through the cold months, which converts the starch to sugar and takes the bitterness out. Strip the leaves from the stems, then either massage raw with oil and lemon or fry hard with garlic.',
    image: 'curly-kale',
    origin: 'Hollow Field',
    inSeason: true,
  },
  {
    id: 'free-range-eggs',
    name: 'Free-Range Eggs',
    category: 'Dairy & Eggs',
    pricePence: 340,
    unit: 'box of 12',
    tag: 'Laid this week',
    shortDescription: 'Mixed brown, cream and pale blue shells from our 200-strong flock.',
    description:
      'Our hens range across the old orchard, so the yolks run deep orange. Shell colour varies by breed and tells you nothing about the egg inside. Stored pointed-end down, unwashed, out of the fridge.',
    image: 'free-range-eggs',
    origin: 'Orchard Flock',
    inSeason: true,
  },
  {
    id: 'farmhouse-butter',
    name: 'Farmhouse Butter',
    category: 'Dairy & Eggs',
    pricePence: 450,
    unit: '250g block',
    tag: 'Churned weekly',
    shortDescription: 'Cultured, lightly salted and deeply yellow from grass-fed cream.',
    description:
      'Churned in small batches from cream we buy from the dairy over the hill, cultured for eighteen hours before churning. That slow ferment is where the nutty, almost cheesy depth comes from.',
    image: 'farmhouse-butter',
    origin: 'Farm Dairy',
    inSeason: true,
  },
  {
    id: 'sourdough-loaf',
    name: 'Sourdough Loaf',
    category: 'Bakery & Pantry',
    pricePence: 480,
    unit: '800g loaf',
    tag: 'Baked at dawn',
    shortDescription: 'Long-fermented country loaf with a dark, blistered crust.',
    description:
      'Two days from flour to loaf, using a starter our baker has kept alive since 2014. Baked in the farmhouse oven at first light so it is still warm when the van loads. Keep it cut-side down on a board, never in the fridge.',
    image: 'sourdough-loaf',
    origin: 'Farmhouse Bakery',
    inSeason: true,
  },
  {
    id: 'wildflower-honey',
    name: 'Wildflower Honey',
    category: 'Bakery & Pantry',
    pricePence: 620,
    unit: '340g jar',
    tag: 'Raw & unfiltered',
    shortDescription: 'Raw honey from the hives at the edge of the meadow.',
    description:
      'Six hives sit along the meadow hedgerow, so the flavour shifts with whatever is flowering — clover and bramble early, ivy later in the year. Raw and unfiltered, so it will crystallise in the jar. Stand it in warm water to loosen.',
    image: 'wildflower-honey',
    origin: 'Meadow Hives',
    inSeason: true,
  },
]

export const productsById = new Map(products.map((p) => [p.id, p]))

export default products
