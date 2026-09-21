// One-off asset generation: produce photography for the Farm Fresh storefront.
// Run with `node scripts/generate-images.mjs`. Output lands in public/img.
import { GoogleGenAI } from '@google/genai'
import { writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

let sharp
try {
  sharp = (await import('sharp')).default
} catch {
  sharp = null
}

const STYLE =
  'Natural daylight editorial food photography for a farm shop. Shot on a weathered reclaimed wood surface with a woven basket or enamel tray, shallow depth of field, soft directional window light, dewy freshness, muted green and warm earth tones, no text, no labels, no packaging, no hands, no people.'

const IMAGES = [
  ['hero-farm', 'Wide landscape view of a small English market garden at golden hour: neat rows of leafy vegetables, a wooden crate of freshly picked produce in the foreground, a red barn and polytunnel blurred in the distance. Warm low sunlight, gentle haze, cinematic and inviting. No text, no people.'],
  ['heirloom-tomatoes', `A generous pile of ripe heirloom tomatoes in many colours, some on the vine, one halved to show the flesh. ${STYLE}`],
  ['rainbow-carrots', `A bunch of rainbow carrots with soil still on them and full green tops, tied with garden twine. ${STYLE}`],
  ['sweetcorn', `Four ears of fresh sweetcorn, husks partly peeled back revealing bright yellow kernels. ${STYLE}`],
  ['new-potatoes', `New potatoes with thin papery skins and a little dry soil, heaped in an enamel bowl, sprig of mint beside them. ${STYLE}`],
  ['strawberries', `A punnet of glossy ripe strawberries with green calyxes, a few spilling onto the wood. ${STYLE}`],
  ['orchard-apples', `Rustic red and green orchard apples with a few leaves attached, stacked in a shallow wooden crate. ${STYLE}`],
  ['rhubarb', `A bundle of vivid pink forced rhubarb stalks with trimmed ends, tied with twine. ${STYLE}`],
  ['salad-leaves', `A loose mix of young salad leaves, oak leaf, rocket and mizuna, still beaded with water. ${STYLE}`],
  ['curly-kale', `A big bunch of deep green curly kale with crinkled leaves and thick stems. ${STYLE}`],
  ['free-range-eggs', `A dozen free-range eggs in mixed brown, cream and pale blue shells in a simple cardboard-free wire rack, one feather nearby. ${STYLE}`],
  ['farmhouse-butter', `A block of golden farmhouse butter on greaseproof paper with a wooden butter paddle and a scattering of sea salt flakes. ${STYLE}`],
  ['sourdough-loaf', `A round sourdough loaf with a dark blistered crust and dusting of flour, one thick slice cut to show the open crumb. ${STYLE}`],
  ['wildflower-honey', `A clear glass jar of golden wildflower honey with no label, a wooden honey dipper drizzling honey, piece of honeycomb beside it. ${STYLE}`],
]

const outDir = path.join(process.cwd(), 'public', 'img')
await mkdir(outDir, { recursive: true })

const ai = new GoogleGenAI({
  apiKey: process.env.NETLIFY_AI_GATEWAY_KEY,
  httpOptions: { baseUrl: process.env.NETLIFY_AI_GATEWAY_BASE_URL?.replace(/\/$/, '') },
})

async function generate([slug, prompt]) {
  const target = path.join(outDir, `${slug}.jpg`)
  if (existsSync(target)) {
    console.log(`skip ${slug} (exists)`)
    return
  }
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image',
        contents: prompt,
      })
      const parts = response.candidates?.[0]?.content?.parts ?? []
      const data = parts.find((p) => p.inlineData)?.inlineData?.data
      if (!data) throw new Error('no image part returned')
      const buf = Buffer.from(data, 'base64')
      if (sharp) {
        await sharp(buf).jpeg({ quality: 82, mozjpeg: true }).toFile(target)
      } else {
        await writeFile(target.replace(/\.jpg$/, '.png'), buf)
      }
      console.log(`ok   ${slug}`)
      return
    } catch (err) {
      console.log(`fail ${slug} attempt ${attempt}: ${err.message}`)
      if (attempt === 3) return
      await new Promise((r) => setTimeout(r, 3000 * attempt))
    }
  }
}

// Small concurrency so a slow generation does not stall the whole batch.
const queue = [...IMAGES]
await Promise.all(
  Array.from({ length: 3 }, async () => {
    while (queue.length) await generate(queue.shift())
  }),
)
console.log('done')
