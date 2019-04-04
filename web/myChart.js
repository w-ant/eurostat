const form = document.getElementById("cbtns");
const countriesUrl = "http://0.0.0.0:5000/countries";
fetch(countriesUrl)
  .then(resp => resp.json())
  .then(function (data) {
    return data.map(countryCode => {
      let btn = document.createElement("button");
      btn.value = countryCode;
      btn.innerText = countryCode;
      btn.addEventListener(
        "click",
        function (e) {
          getChartData(countryCode, "e");
          e.preventDefault();
        },
        false
      );
      form.appendChild(btn);
    });
  })
  .catch(function (error) {});

var ctx = document.getElementById("myChart").getContext("2d");
var myChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: 0,
    datasets: [{
        label: "Total in Euro",
        // data: data[0],
        borderColor: "rgba(75,130,180,1)",
        backgroundColor: "rgba(75,130,180,0.6)",
        // borderWidth: 1
      },
      {
        label: "MA12",
        // data: data[1],
        borderColor: "rgba(192, 92, 92, 1)",
        backgroundColor: "rgba(192, 92, 92, 0.1)",
        type: 'line',
        radius: 0
      }
    ]
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }
});

function updateChart(data, labels) {
  myChart.data.datasets[0].data = data[0];
  myChart.data.datasets[1].data = data[1];

  myChart.data.labels = labels;
  myChart.update()
}

function getChartData(cc, tt) {
  $("#loadingMessage").html("Loading");
  $.ajax({
    url: `http://localhost:5000/data/${cc}/${tt}`,
    success: function (result) {
      $("#loadingMessage").html("");
      var data = [];
      var json = JSON.parse(result);
      data.push(Object.values(json.total));
      data.push(Object.values(json.MA12));
      var labels = Object.values(json.PERIOD);

      updateChart(data, labels);
    },
    error: function (err) {
      console.log("error");

      $("#loadingMessage").html("Error");
    }
  });
}