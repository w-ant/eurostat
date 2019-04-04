function createRadio(element) {
  return document.createElement(element);
}
function append(parent, el) {
  return parent.appendChild(el);
}
const form = document.getElementById("cform");
const countriesUrl = "http://0.0.0.0:5000/countries";
fetch(countriesUrl)
  .then(resp => resp.json())
  .then(function(data) {
    return data.map(countryCode => {
      let btn = document.createElement("button");
      btn.value = countryCode;
      btn.innerText = countryCode;
      btn.addEventListener(
        "click",
        function(e) {
          getChartData(countryCode, "e");
          e.preventDefault();
        },
        false
      );
      form.appendChild(btn);
    });
  })
  .catch(function(error) {});

function renderChart(data, labels) {
  var ctx = document.getElementById("myChart").getContext("2d");
  var myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Total in Euro",
          data: data[0],
          borderColor: "rgba(75,192,192,1)",
          backgroundColor: "rgba(75,192,192,0.2)"
        },
        {
          label: "MA12",
          data: data[1],
          borderColor: "rgba(192, 92, 92, 1)",
          backgroundColor: "rgba(92, 92, 92, 0)"
        }
      ]
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ]
      },
      events: ["mousemove"]
    }
  });
}

function getChartData(cc, tt) {
  $("#loadingMessage").html("Loading");
  $.ajax({
    url: `http://localhost:5000/data/${cc}/${tt}`,
    success: function(result) {
      $("#loadingMessage").html("");
      var data = [];
      var json = JSON.parse(result);
      data.push(Object.values(json.total));
      data.push(Object.values(json.MA12));
      var labels = Object.values(json.PERIOD);

      renderChart(data, labels);
    },
    error: function(err) {
      console.log("error");

      $("#loadingMessage").html("Error");
    }
  });
}
$("#renderBtn").click(function() {
  getChartData("de", "e");
});
