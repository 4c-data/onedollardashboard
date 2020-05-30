function get_budget_json(url) {
  city = _.keys(cities_data)[$("#city_dropdown").val()]
  year = cities_data[city][$("#year_dropdown").val()]
  city = city.toLowerCase();
  city = city.replace(/ /g, "_");
  url = 'https://raw.githubusercontent.com/4c-data/onedollardashboard/master/data/clean/' + city + '_' + year + '_budget.json';


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

function sortByKey(array, key, decreasing = true) {
  return array.sort(function(a, b) {
    var x = a[key];
    x = parseFloat(x);
    var y = b[key];
    y = parseFloat(y);
    if (decreasing == true) {
      return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    } else {
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    }
  });
}

function resizeChosen() {
  $(".chosen-container").each(function() {
    $(this).attr('style', 'width: 85%');
  });
}

function on_year_change() {
  data = get_budget_json();
  data = sortByKey(data, "percent_of_budget");
  remake_graph()

  table.destroy();
  $('#table').empty();
  table = makeTable(data);
}

function checkbox_toggle(box_to_check) {
  box_status = $(box_to_check).prop("checked");
  $("#percent").prop("checked", false);
  $("#dollars").prop("checked", false);
  $("#dollars_per_police_dollar").prop("checked", false);

  $(box_to_check).prop("checked", box_status);

  if (!$("#dollars").is(':checked') &&
    !$("#percent").is(':checked')&&
      !$("#dollars_per_police_dollar").is(':checked')) {
    $("#dollars_per_police_dollar").prop("checked", true);
  }
  remake_graph()
}

function remake_graph() {
  $('#graph').remove();
  $('.main').prepend('<canvas id="graph" style="width:70%;height:1200px;"></canvas>');
  ctx = document.getElementById("graph").getContext('2d');
  data = get_budget_json();
  data = sortByKey(data, "percent_of_budget");
  graph = make_bar_plot(data, type = type);
}


function make_city_dropdown() {
  $('.simple-select').chosen();
  resizeChosen();
  cities = _.keys(cities_data)

  $("#city_dropdown").empty();
  $.each(cities, function(val, text) {
    $("#city_dropdown").append(new Option(text, val));
  });
  $("#city_dropdown").val(0);

  make_year_dropdown()
  $('.simple-select').trigger('chosen:updated');
}

function make_year_dropdown() {
  year_values = cities_data[cities[$("#city_dropdown").val()]]
  $("#year_dropdown").empty();
  $.each(year_values, function(val, text) {
    $("#year_dropdown").append(new Option(text, val));
  });
  $("#year_dropdown").val(year_values.length-1);
  $('.simple-select').trigger('chosen:updated');
}

function city_change() {
  make_year_dropdown();
  on_year_change();
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

  if (left < 0) {

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
