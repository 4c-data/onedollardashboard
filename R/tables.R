make_budget_table <- function(data) {
  data <-
    data %>%
    dplyr::select(name,
                  dollars_per_police_dollar,
                  budget,
                  percent_of_budget) %>%
    dplyr::arrange(desc(dollars_per_police_dollar)) %>%
    dplyr::mutate_at(c("dollars_per_police_dollar",
                       "budget",
                       "percent_of_budget"),
                     round, 3) %>%
    dplyr::mutate(percent_of_budget = paste0(percent_of_budget, "%"),
                  budget = formatC(budget, format="d", big.mark=",")) %>%  
    dplyr::rename(Name                        = name,
                  "Dollars per Police Dollar" = dollars_per_police_dollar,
                  "Budget (in Dollars)"       = budget,
                  "% of City Budget"          = percent_of_budget)



DT::datatable(data,
              filter       = 'top',
              class        = 'cell-border stripe',
              extensions   = c('Buttons', "ColReorder"),
              options      = list(
                pageLength = 51,
                dom        = 'Bfrtip',
                buttons    = c('copy', 'csv', 'excel'),
                columnDefs = list(list(
                  className = 'dt-right', targets = c(2:4))),
                colReorder = TRUE,
                dom        = 't',
                scrollX    = TRUE)) 
}



