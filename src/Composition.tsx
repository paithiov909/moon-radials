import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  Easing,
  interpolate
} from "remotion";

export const MyComposition = () => {
  const frame = useCurrentFrame();

  const curImage = interpolate(
    frame,
    [0, 120],
    [1, 90],
    {
      easing: Easing.quad,
      extrapolateRight: "clamp"
    }
  )
  const imageNum = Math.floor(curImage).toString()
  const imageName = `gganim_plot${imageNum.padStart(4, "0")}.png`

  return (
    <AbsoluteFill>
      <AbsoluteFill>
        <h3 style={{
          color: "steelblue",
          textAlign: "center",
        }}>This animation was created<br />
           with remotion and gganimate (using WebR)</h3>
      </AbsoluteFill>
      <Img
        src={staticFile(imageName)}
        pauseWhenLoading={true}
      />
    </AbsoluteFill>
  )
};
