library(readr)
library(here)
library(dplyr)
library(janitor)

philly <- readr::read_csv(here::here("data/raw/philly_budget.csv"))
names(philly) <- janitor::make_clean_names(names(philly))
philly <-
  philly %>%
  dplyr::select(dept_name,
                x2021_revised) %>%
  dplyr::group_by(dept_name) %>%
  dplyr::summarize(budget = sum(x2021_revised))
options(scipen = 99)
philly$percent_of_police <- philly$budget / philly$budget[philly$dept_name == "Police"]
philly$budget_millions <- philly$budget / 1000000


readr::write_csv(philly, path = here::here("data/clean/philly_budget.csv"))
