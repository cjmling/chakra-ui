import { CSSProperties } from "react"

type Orientation = "vertical" | "horizontal"

function orient(options: {
  orientation: Orientation
  vertical: CSSProperties
  horizontal: CSSProperties
}) {
  const { orientation, vertical, horizontal } = options
  return orientation === "vertical" ? vertical : horizontal
}

type Size = { height: number; width: number }

const zeroRect: Size = { width: 0, height: 0 }

export function getPartsStyle(options: {
  orientation: Orientation
  thumbPercents: number[]
  thumbRects: Size[]
  isReversed?: boolean
}) {
  const { orientation, thumbPercents, thumbRects, isReversed } = options

  const getThumbStyle = (index: number): CSSProperties => ({
    position: "absolute",
    userSelect: "none",
    WebkitUserSelect: "none",
    MozUserSelect: "none",
    msUserSelect: "none",
    touchAction: "none",
    ...orient({
      orientation,
      vertical: {
        bottom: `calc(${thumbPercents[index]}% - ${
          thumbRects[index].height / 2
        }px)`,
      },
      horizontal: {
        left: `calc(${thumbPercents[index]}% - ${
          thumbRects[index].width / 2
        }px)`,
      },
    }),
  })

  const size =
    orientation === "vertical"
      ? thumbRects.reduce((a, b) => (a.height > b.height ? a : b), zeroRect)
      : thumbRects.reduce((a, b) => (a.width > b.width ? a : b), zeroRect)

  const rootStyle: CSSProperties = {
    position: "relative",
    touchAction: "none",
    WebkitTapHighlightColor: "rgba(0,0,0,0)",
    userSelect: "none",
    outline: 0,
    ...orient({
      orientation,
      vertical: {
        paddingLeft: size.width / 2,
        paddingRight: size.width / 2,
      },
      horizontal: {
        paddingTop: size.height / 2,
        paddingBottom: size.height / 2,
      },
    }),
  }

  const trackStyle: React.CSSProperties = {
    position: "absolute",
    ...orient({
      orientation,
      vertical: {
        left: "50%",
        transform: "translateX(-50%)",
        height: "100%",
      },
      horizontal: {
        top: "50%",
        transform: "translateY(-50%)",
        width: "100%",
      },
    }),
  }

  const range =
    thumbPercents.length === 1 ? [0, thumbPercents[0]] : thumbPercents
  const startRange = range[0]

  let rangeDiff = range[range.length - 1] - range[0]
  rangeDiff = isReversed ? 100 - rangeDiff : rangeDiff

  const innerTrackStyle: React.CSSProperties = {
    ...trackStyle,
    ...orient({
      orientation,
      vertical: isReversed
        ? { height: `${rangeDiff}%`, top: `${startRange}%` }
        : { height: `${rangeDiff}%`, bottom: `${startRange}%` },
      horizontal: isReversed
        ? { width: `${rangeDiff}%`, right: `${startRange}%` }
        : { width: `${rangeDiff}%`, left: `${startRange}%` },
    }),
  }

  return { trackStyle, innerTrackStyle, rootStyle, getThumbStyle }
}

export function getIsReversed(options: {
  isReversed?: boolean
  direction: "ltr" | "rtl"
  orientation?: "horizontal" | "vertical"
}) {
  const { isReversed, direction, orientation } = options

  if (direction === "ltr" || orientation === "vertical") {
    return isReversed
  }
  // only flip for horizontal RTL
  // if isReserved 🔜  otherwise  🔚
  return !isReversed
}
