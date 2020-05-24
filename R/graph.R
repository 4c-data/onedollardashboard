make_barplot <- function(data) {
  
  data$dollars_per_police_dollar <- round(data$dollars_per_police_dollar, 2)
  p <- data %>%
    ggplot2::ggplot(ggplot2::aes(x = reorder(name, dollars_per_police_dollar),
                                 y = dollars_per_police_dollar,
                                 fill = police_col)) +
    ggplot2::geom_bar(stat = "identity") +
    ggplot2::labs(title = "For Each $1 Philadelphia Spends on Police",
                  subtitle = "They Spend ...",
                  y = "Dollars",
                  x = "" )+
    ggplot2::coord_flip() +
    ggplot2::scale_y_continuous(breaks = pretty(data$dollars_per_police_dollar),
                                labels = abs(pretty(data$dollars_per_police_dollar))) +
    ggplot2::scale_fill_manual(values = c("black", "#d95f02")) + 
    ggplot2::theme_minimal() +
    ggplot2::theme(legend.position='none') 
  
  plotly::ggplotly(p, tooltip = c("dollars_per_police_dollar"))
}