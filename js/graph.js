function make_bar_plot(data) {
  category = [];
  cost = [];
  background_color = [];

  type = "dollars"
  if ($("#percent").is(':checked')) {
    type = "percent";
  }

  graph_label = "Annual Budget (dollars)";
  value_col = "budget";
  if (type == "percent") {
    graph_label = "Annual Budget (% of Budget)";
    value_col = "percent_of_budget";
  }

  for (var n = 0; n < data.length; n++) {
    category.push(data[n].name);
    cost.push(data[n][value_col]);
    if (data[n].name == "Police") {
      background_color.push("#eb4034")
    } else {
      background_color.push("#787272")
    }
  }

  ctx = document.getElementById("graph").getContext('2d');
  bar_chart = new Chart(ctx, {
    type: 'horizontalBar',
    data: {
      labels: category,
      datasets: [{
        label: graph_label,
        backgroundColor: background_color,
        data: cost
      }]
    },
    options: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Philadelphia Proposed Budget for 2021'
      },
      tooltips: {
        callbacks: {
          label: function(tooltipItem, data) {
            var value = data.datasets[0].data[tooltipItem.index];
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          }
        } // end callbacks:
      },
      scales: {
        xAxes: [{
          ticks: {
            beginAtZero: true,
            callback: function(value, index, values) {
              if (parseInt(value) >= 1000) {
                return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              }
            }
          }
        }]
      }
    }
  });

  return (bar_chart);
}
