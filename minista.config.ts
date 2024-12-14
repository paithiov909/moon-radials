import { defineConfig } from "minista"

export default defineConfig({
  base: "",
  out: "docs",
  vite: {
    // preview: {
    //   cors: {
    //     origin: true,
    //     exposedHeaders: ["Content-Encoding"]
    //   }
    // }
  }
})
