source(here::here("R/utils.R"))

clean_nyc_data <- function() {
  nyc <- readr::read_csv(here::here("data/raw/nyc_Expense_Budget.csv"))
  names(nyc) <- janitor::make_clean_names(names(nyc))
  nyc <-
    nyc %>%
    dplyr::select(agency_name,
                  fiscal_year,
                  current_modified_budget_amount) %>%
    dplyr::group_by(agency_name,
                    fiscal_year) %>%
    dplyr::summarize(budget = sum(current_modified_budget_amount)) %>%
    dplyr::ungroup() %>%
    dplyr::rename(name = agency_name) %>%
    dplyr::mutate(name = tolower(name),
                  name = tools::toTitleCase(name)) %>%
    dplyr::filter(fiscal_year > 100)
  
  for (year in unique(nyc$fiscal_year)) {
    temp <- nyc[nyc$fiscal_year %in% year,]
    temp <- make_millions_percent_perpolice_cols(temp, "Police Department")
    nyc_json <- jsonlite::toJSON(temp,
                                 pretty = TRUE)
    write(nyc_json,
          here::here(paste0("data/clean/nyc_", year, "_budget.json")))
  }
  return(nyc)
}

clean_sf_data <- function() {
  data <- readr::read_csv(here::here("data/raw/san_francisco_Budget.csv"))
  names(data) <- janitor::make_clean_names(names(data))
  data$department <- gsub("^[A-Z]{3} ", "", data$department)
  data <-
    data %>%
    filter(revenue_or_spending %in% "Spending",
           fund_category == "Operating") %>%
    dplyr::select(department,
                  fiscal_year,
                  budget) %>%
    dplyr::group_by(department,
                    fiscal_year) %>%
    dplyr::summarize(budget = sum(budget)) %>%
    dplyr::ungroup() %>%
    dplyr::rename(name = department) %>%
    dplyr::filter(fiscal_year > 100)
}

clean_la_data <- function() {
  data <- readr::read_csv(here::here("data/raw/los_angeles_City_Budget_and_Expenditures.csv"))
  names(data) <- janitor::make_clean_names(names(data))
  data <-
    data %>%
    dplyr::select(department_name,
                  budget_fiscal_year,
                  total_budget) %>%
    dplyr::group_by(department_name,
                    budget_fiscal_year) %>%
    dplyr::summarize(budget = sum(total_budget, na.rm = TRUE)) %>%
    dplyr::ungroup() %>%
    dplyr::rename(name = department_name,
                  fiscal_year = budget_fiscal_year) %>%
    dplyr::mutate(name = tolower(name),
                  name = tools::toTitleCase(name))
  
  for (year in unique(data$fiscal_year)) {
    temp <- data[data$fiscal_year %in% year,]
    temp <- make_millions_percent_perpolice_cols(temp, "Police")
    temp_json <- jsonlite::toJSON(temp,
                                 pretty = TRUE)
    write(temp_json,
          here::here(paste0("data/clean/los_angeles_", year, "_budget.json")))
  }
}

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
  philly <- make_millions_percent_perpolice_cols(philly, "Police")
  
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
      here::here("data/clean/philly_2021_budget.json"))
