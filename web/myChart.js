const cbtns = document.getElementById("cbtns"),
  ul = document.createElement('ul'),
  countriesUrl = "http://0.0.0.0:5000/countries";
cbtns.appendChild(ul);
fetch(countriesUrl)
  .then(resp => resp.json())
  .then(function (data) {
    return data.map(countryCode => {
      let li = document.createElement('li')
      let label = document.createElement('span')
      let btnI = document.createElement("button");
      let btnE = document.createElement("button");
      btnI.value = countryCode;
      btnI.innerText = "Import";
      btnE.value = countryCode;
      btnE.innerText = "Export";
      label.innerText = countryCode;
      li.appendChild(label)
      li.appendChild(btnI)
      li.appendChild(btnE)
      ul.appendChild(li);

      btnI.addEventListener(
        "click",
        function (e) {
          getChartData(countryCode, "i");
          e.preventDefault();
        },
        false
      );
      btnE.addEventListener(
        "click",
        function (e) {
          getChartData(countryCode, "e");
          e.preventDefault();
        },
        false
      );
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
      // xAxes: [{
      //   type: 'time',
      //   time: {
      //     displayFormats: {
      //       month: 'MM YYYY'
      //     }
      //   }
      // }],
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
  console.log(`Country code: ${cc}, Trade type: ${tt}`);
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