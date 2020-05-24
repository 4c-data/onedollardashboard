make_budget_table <- function(data) {
  data <-
    data %>%
    dplyr::select(name,
                  dollars_per_police_dollar,
                  budget_millions,
                  percent_of_budget) %>%
    dplyr::arrange(desc(dollars_per_police_dollar)) %>%
    dplyr::mutate_at(c("dollars_per_police_dollar",
                       "budget_millions",
                       "percent_of_budget"),
                     round, 2) %>%
    dplyr::rename(Name                        = name,
                  "Dollars per Police Dollar" = dollars_per_police_dollar,
                  "Budget (in Millions)"      = budget_millions,
                  "% of Budget"               = percent_of_budget)



DT::datatable(data,
              filter       = 'top',
              class        = 'cell-border stripe',
              extensions   = c('Buttons', "ColReorder"),
              options      = list(
                pageLength = 51,
                dom        = 'Bfrtip',
                buttons    = c('copy', 'csv', 'excel'),
                colReorder = TRUE,
                dom        = 't',
                scrollX    = TRUE)) 
}

