import { blockedReason } from "../lib/categories"
const should = ["Birthday cake, 2 tier", "Steam gift card $50", "iPhone 14 replica", "AF1 first copy", "Bag of rice and a puppy", "Johnnie Walker whisky", "Plot of land at Kasoa", "Concert tickets for Afrochella"]
const shouldNot = ["Land Cruiser tyres, set of 4", "Glue gun and craft kit", "Car phone charger (vehicle USB)", "Pet bed, large", "Oatmeal knit sweater", "Beer glasses, set of 6", "Carpet, 2x3m", "Leather wallet", "iPhone 15 Pro, 256GB", "Gari, 50kg bag"]
let failures = 0
for (const t of should) {
  const ok = blockedReason(t) !== null
  if (!ok) failures++
  console.log(ok ? "BLOCKED ok    " : "MISSED !!!    ", t)
}
for (const t of shouldNot) {
  const ok = blockedReason(t) === null
  if (!ok) failures++
  console.log(ok ? "allowed ok    " : "FALSE BLOCK!  ", t)
}
console.log(failures === 0 ? `
All ${should.length + shouldNot.length} cases pass.` : `
${failures} case(s) FAILED.`)
if (failures > 0) process.exit(1)
