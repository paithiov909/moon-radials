// src/global.tsx
import type { GlobalProps } from "minista"
import { Head } from "minista"

export default function ({ url, title, children }: GlobalProps) {
  return (
    <>
      <Head>
        <title>Hello WebR!</title>
        <meta name="robots" content="noindex,follow" />
        <meta name="github-repo" content="paithiov909/moon-radials" />
        <link rel="icon" href="https://fav.farm/🌖" />
      </Head>
      <div>{children}</div>
    </>
  )
}
