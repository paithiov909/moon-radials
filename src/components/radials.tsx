import {
  useEffect,
  useState,
  useRef,
  useCallback
} from "react"
import {
  WebR,
  ChannelType
} from "webr"
import {
  Stage,
  Layer,
  Image
} from "react-konva/lib/ReactKonvaCore"
import "konva/lib/shapes/Image"
import { Kaleidoscope } from "konva/lib/filters/Kaleidoscope"
import "../assets/style.css"

let webR: WebR

export default () => {
  const [isInitialized, setIsInitialized] = useState(false)
  const [captured, setCaptured] = useState<HTMLCanvasElement>(null)
  const [param, setParam] = useState(3)
  const container = useRef(null)
  const imageRef = useRef(null)

  const initWebR = useCallback(async () => {
    if (!isInitialized) {
      webR = new WebR({
        channelType: ChannelType.PostMessage
      })
      await webR.init()
      await webR.installPackages(["ggplot2"])
      await webR.evalRVoid(`
        library(ggplot2)
        library(viridisLite)
        vortex <- function(n = 25, start_val = sample.int(360, 1), bg_col = "transparent") {
          # colour schemes
          cols <- cividis(10, direction = -1)
          # generate data
          m <- n * 10
          df1 <- data.frame(id = seq(1, m), value = sample(seq(0, m), m, replace = TRUE), type = factor(rep(c(1:10), each = (m / 10))))
          # plot
          p <- ggplot(df1) +
            geom_line(aes(x = id, y = value, group = type, colour = type)) +
            scale_color_manual("", values = cols) +
            coord_polar(start = start_val, theta = "y") +
            theme(
              panel.background = element_rect(fill = bg_col, colour = bg_col),
              plot.background = element_rect(fill = bg_col, colour = bg_col),
              plot.title = element_blank(),
              plot.subtitle = element_blank(),
              legend.position = "none",
              plot.margin = unit(c(0, 0, 0, 0), "cm"), # top, right, bottom, left
              axis.title.x = element_blank(),
              axis.title.y = element_blank(),
              axis.text.x = element_blank(),
              axis.text.y = element_blank(),
              axis.ticks.x = element_blank(),
              axis.ticks.y = element_blank(),
              panel.grid.major = element_blank(),
              panel.grid.minor = element_blank()
            )
          return(p)
        }
      `)
      setIsInitialized(true)
    }
  }, [isInitialized])

  useEffect(() => {
    initWebR()
    if (captured) {
      applyCache()
    }
  })

  function applyCache() {
    imageRef.current?.cache()
  }

  async function capturePlot() {
    const shelter = await new webR.Shelter()
    try {
      const capture = await shelter.captureR("print(vortex())", {
        captureGraphics: {
          width: container.current?.offsetWidth / 2,
          height: (container.current?.offsetHeight - 100) / 2
        }
      })
      capture.images.forEach(img => {
        const canvas = document.createElement("canvas")
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        // console.log(canvas.toDataURL())
        setCaptured(canvas)
      })
    } finally {
      await shelter.purge()
    }
  }

  return (
    <div ref={container} className="container mx-auto rounded-md bg-pink-200">
      <div className="grid place-content-around">
        <label
          htmlFor="power"
          className="mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >Param for filter effect</label>
        <input
          id="power"
          className="h-2 bg-white rounded-lg appearance-none cursor-pointer"
          type="range"
          min="0"
          max="6"
          step="1"
          onChange={(e) => {
            setParam(Number(e.target.value))
            applyCache()
          }}
        />
        <button
          type="button"
          title="This will be clickable when WebR is initialized!"
          className="rounded-md bg-white my-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          disabled={!isInitialized}
          onClick={capturePlot}
        >Draw aRtsy</button>
      </div>
      <Stage width={container.current?.offsetWidth} height={1108} className="bg-slate-800">
        <Layer>
          {captured && <Image ref={imageRef} image={captured} filters={[Kaleidoscope]} kaleidoscopePower={param} />}
        </Layer>
      </Stage>
    </div>
  )
}
