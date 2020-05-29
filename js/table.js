function makeTable(data) {
  data_keys = _.keys(data[0]);
  // Adds commas in numbers to make it easier to read!
  for (var m = 0; m < data.length; m++) {
    for (n = 2; n < data_keys.length; n++) {
      data[m][data_keys[n]] = parseFloat(data[m][data_keys[n]]).toLocaleString();

      if (data[m][data_keys[n]] == "NaN") {
        data[m][data_keys[n]] = ""
      }
    }
  }

//  console.log(table_headers)
// Makes real (as they appear in the data) names and pretty names
// as they will appear in the table.
table_headers = _.keys(data[0])
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

table_columns[0].className = "dt-head-left dt-body-right";
table_columns[0].sClass = "dt-head-left dt-body-right";

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
    "pageLength": 51,
    "ordering": true,
    "fixedHeader": true,
    fixedColumns: {
      leftColumns: 1
    }
  });

  return temp_table;
}
