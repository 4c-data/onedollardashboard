library(readr)
library(here)
library(dplyr)
library(janitor)
library(jsonlite)
options(scipen = 99)

make_millions_percent_perpolice_cols <- function(data, police_name) {
  data$dollars_per_police_dollar <- data$budget / data$budget[data$name == police_name]
  data$percent_of_budget <- data$budget / sum(data$budget) * 100
  data <-
    data %>%
    dplyr::mutate(total_budget          = sum(budget),
                  budget_millions       = budget / 1000000,
                  total_budget_millions = sum(budget_millions)) %>%
    dplyr::mutate_if(is.numeric, round, 3) %>%
    dplyr::arrange(name)
  return(data)
}
