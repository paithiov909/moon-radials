# This snippet is derived from:
# [aRt/R/spirals.R at main · nrennie/aRt](https://github.com/nrennie/aRt/blob/main/R/spirals.R)

to <- 20
perc <- 0.3
bg_value <- 500
limit <- 50
max_size <- 20
col_palette <- c("#413C58", "#D1495B", "#EDAE49", "#00798C", "#003D5B")
highlight_col <- "white"
bg_col <- "transparent"
padding <- 0

# set.seed(1234)

theta <- seq(0, to * pi, 0.1)
theta[sample(seq_len(length(theta)), size = round(perc * length(theta)), prob = 1 / ((seq_len(length(theta)))^1.5))] <- NA
r <- 0.5 + 0.5 * theta
df <- data.frame(x = r * cos(theta), y = r * sin(-theta))
df$col_val <- stats::runif(length(theta), -1, 1)
df$size_val <- (40 - 0) * stats::rbeta(n = length(theta), shape1 = 3, shape2 = 9) + 0

plot_data <- df |>
  tidyr::drop_na() |>
  dplyr::filter(abs(.data$x) <= limit, abs(.data$y) <= limit) |>
  dplyr::mutate(id = dplyr::row_number())

bg_data <-
  data.frame(
    x = stats::runif(bg_value, -limit, limit),
    y = stats::runif(bg_value, -limit, limit)
  )

plot_spirals <- function() {
  p <- ggplot2::ggplot() +
    ggplot2::geom_point(
      data = plot_data,
      mapping = ggplot2::aes(
        x = .data$x,
        y = .data$y,
        col = .data$col_val,
        size = .data$size_val,
        group = .data$id
      )
    ) +
    ggplot2::geom_point(
      data = bg_data,
      ggplot2::aes(x = .data$x, y = .data$y),
      colour = highlight_col,
      size = 0.1
    ) +
    ggplot2::scale_colour_gradientn(colors = col_palette) +
    ggplot2::scale_x_continuous(limits = c(-limit, limit)) +
    ggplot2::scale_y_continuous(limits = c(-limit, limit)) +
    ggplot2::coord_fixed(expand = FALSE) +
    ggplot2::scale_size(range = c(0, max_size)) +
    ggplot2::theme_void() +
    ggplot2::theme(
      plot.background = ggplot2::element_rect(
        fill = bg_col, colour = bg_col
      ),
      legend.position = "none",
      plot.margin = ggplot2::unit(
        c(padding, padding, padding, padding), "in"
      ),
      strip.background = ggplot2::element_blank(),
      strip.text = ggplot2::element_blank(),
      panel.spacing = ggplot2::unit(0, "in")
    )

  anim <- p +
    gganimate::transition_reveal(.data$id) +
    gganimate::enter_fade() +
    gganimate::enter_grow() +
    gganimate::ease_aes("cubic-in-out")

  return(anim)
}

anim <- plot_spirals()
gganimate::animate(
  anim,
  nframes = 90,
  fps = 30,
  width = 640,
  height = 480,
  units = "px",
  device = "png",
  renderer = gganimate::file_renderer("./public", overwrite = TRUE)
)
