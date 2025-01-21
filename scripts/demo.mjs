#!/usr/bin/env zx
import "zx/globals"
import { WebR } from "webr"

echo("Cleaning public directory...")
await fs.remove(`${path.resolve(__dirname, "../public/*")}`)

const webR = new WebR()

await spinner("Initializing webR...", async () => {
  await webR.init()
  await webR.installPackages(["gganimate", "ggplot2", "dplyr", "tidyr"])
  // Run the snippet
  const snippet = await fs.readFile(`${path.resolve(__dirname, "snippet.R")}`, "utf-8")
  await webR.evalRVoid(snippet)
  // Mount the directory '../public' on the virtual filesystem at '/out'
  await webR.FS.mkdir("/out")
  await webR.FS.mount("NODEFS", { root: `${path.resolve(__dirname, "../public")}` }, "/out")
})

const shelter = await new webR.Shelter()

try {
  echo("Plotting spirals...")
  await shelter.evalR(`
    anim <- plot_spirals()
    gganimate::animate(
      anim,
      nframes = 90,
      fps = 30,
      width = 640,
      height = 480,
      units = "px",
      device = "png",
      renderer = gganimate::file_renderer("/out", overwrite = TRUE)
    )
  `)
} finally {
  echo("Cleaning up...")
  await shelter.purge()
  await webR.FS.unmount("/out")
}

echo("Done!")
process.exit(0)
