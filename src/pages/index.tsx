import { Head } from "minista"
import Radials from "../components/radials?ph"

export default function () {
  return (
    <>
      <Head>
        <title>Hello WebR!</title>
        <meta name="robots" content="noindex,follow" />
        <meta name="github-repo" content="paithiov909/moon-radials" />
        <link rel="icon" href="https://fav.farm/🌖" />
      </Head>
      <div>
        <Radials />
      </div>
    </>
  )
}
