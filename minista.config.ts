import { defineConfig } from "minista"

export default defineConfig({
  base: "",
  out: "docs",
  public: "out",
  vite: {
    // preview: {
    //   cors: {
    //     origin: true,
    //     exposedHeaders: ["Content-Encoding"]
    //   }
    // }
  }
})
