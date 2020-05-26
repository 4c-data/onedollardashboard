library(readr)
library(here)
library(dplyr)
library(janitor)
library(jsonlite)

clean_philly_data <- function() {
  philly <- readr::read_csv(here::here("data/raw/philly_budget.csv"))
  names(philly) <- janitor::make_clean_names(names(philly))
  philly <-
    philly %>%
    dplyr::select(dept_name,
                  x2021_revised) %>%
    dplyr::group_by(dept_name) %>%
    dplyr::summarize(budget = sum(x2021_revised)) %>%
    dplyr::rename(name = dept_name)
  options(scipen = 99)
  philly$dollars_per_police_dollar <- philly$budget / philly$budget[philly$name == "Police"]
  philly$budget_millions <- philly$budget / 1000000
  
  philly$percent_of_budget <- philly$budget / sum(philly$budget) * 100
  philly$police_col <- 0
  philly$police_col[philly$name == "Police"] <- 1
  philly$police_col <- as.character(philly$police_col)
  return(philly)
}

philly_budget <- clean_philly_data() %>%
  dplyr::mutate(total_budget = sum(budget),
                total_budget_millions = sum(budget_millions)) %>%
  dplyr::mutate_if(is.numeric, round, 3) %>%
  dplyr::arrange(name)
philly_json <- jsonlite::toJSON(philly_budget,
                                       pretty = TRUE)
write(philly_json,
      here::here("data/clean/philly_budget.json"))
