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


function makeTable(type) {
  data = subsetColumns(table_data, table_headers, "table", type);
  data_keys = _.keys(data[0]);
  data_keys = data_keys.filter(function(a) {
    return !["agency", "year", "state", "ORI", "county", "sector", "fiscal_year", "school_name", "school_unique_ID"].includes(a);
  });
  // Adds commas in numbers to make it easier to read!
  for (var m = 0; m < data.length; m++) {
    for (n = 0; n < data_keys.length; n++) {
      data[m][data_keys[n]] = parseFloat(data[m][data_keys[n]]).toLocaleString();

      if (data[m][data_keys[n]] == "NaN") {
        data[m][data_keys[n]] = ""
      }
    }
  }
//  console.log(table_headers)
  // Makes real (as they appear in the data) names and pretty names
  // as they will appear in the table.
  table_columns = [];
  for (var i = 0; i < table_headers.length; i++) {
    label_name = fixTableName(table_headers[i], type);
    data_name = fixTableDataName(table_headers[i], type);
    table_columns.push({
      data: data_name,
      title: label_name,
      className: "dt-head-left dt-body-right"
    });
  }
  temp_table = $("#table").DataTable({
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
    "pageLength": 25,
    "ordering": true,
    "order": [1, "desc"],
    "fixedHeader": true,
    "render": function(data) {
      if (typeof(data) == "undefined") {
        return "tbd"
      } else {
        return data
      }
    },
    fixedColumns: {
      leftColumns: 2
    }
  });
  return temp_table;
}
