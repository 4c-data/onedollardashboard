function readCSV(csv) {
  var result = null;
  var scriptUrl = csv;
  $.ajax({
    url: scriptUrl,
    type: 'get',
    dataType: 'text',
    async: false,
    success: function(data) {
      result = data;
    }
  });
  return result;
}

function get_budget_json(url) {
data = $.getJSON({
  url: url,
  type: 'get',
  dataType: 'json',
  async: false,
  success: function(data) {
    result = data;
  }
});
data = data.responseJSON;
return (data);
}

function allowSaveGraph() {
  var url = myLine.toBase64Image();
}

function makeTable(data) {

//  console.log(table_headers)
// Makes real (as they appear in the data) names and pretty names
// as they will appear in the table.
table_headers = _.keys(data[0])
console.log(table_headers)
table_columns = [];
for (var i = 0; i < table_headers.length; i++) {
  label_name = table_headers[i];
  data_name = table_headers[i];
  table_columns.push({
    data: data_name,
    title: label_name,
    className: "dt-head-left dt-body-right"
  });
}

console.log(data)
$("#table").DataTable({
    data: data,
    columns: table_columns,
    "scrollX": true,
    "sScrollXInner": "100%",
    "sScrollX": "100%",
    "stripe": true,
    "hover": true,
    "lengthChange": true,
    "paging": true,
    "searching": true,
    "pageLength": 51,
    "ordering": true,
    "fixedHeader": true
  });
}

function make_bar_plot(data) {
  category = [];
  cost = [];
  background_color = [];

  for (var n = 0; n < data.length; n++) {
    category.push(data[n].name);
    cost.push(data[n].budget);
    if (data[n].name == "Police") {
      background_color.push("#eb4034")
    } else {
      background_color.push("#787272")
    }

  }
  new Chart(document.getElementById("graph"), {
    type: 'horizontalBar',
    data: {
      labels: category,
      datasets: [{
        label: "Annual Budget (dollars)",
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
            if (parseInt(value) >= 1000) {
              return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            } else {
              return value;
            }
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
}


// Licensed under the MIT license (https://raw.githubusercontent.com/jhovgaard/jquery.rangegroup/master/LICENSE)

$(document).on('input', 'input[range-group]', function() {
  selectedRange = $(this);
  var group = selectedRange.attr('range-group');
  var max = selectedRange.attr('range-group-max-sum');

  var ranges = $('input[range-group=' + group + ']');
  var total = 0;
  ranges.each(function(i, item) {
    total += parseInt($(item).val());
  });

  var left = max - total;

  if(left < 0) {

    var half = Math.ceil(left / 2);

    ranges.each(function(i, item) {
      $item = $(item);
      if ($item.get(0) === selectedRange.get(0)) {
        return true;
      };
      var newValue = parseInt($item.val()) + half;
      $item.val(newValue);
      $item.trigger('change');
    });
  }
});
