function renderChart(data, labels) {
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Total in Euro',
                data: data[0],
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)'
            }, {
                label: 'MA12',
                data: data[1],
                borderColor: 'rgba(192, 92, 92, 1)',
                backgroundColor: 'rgba(92, 92, 92, 0)',
            }]
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
    })
}

function getChartData(cc, tt) {
    console.log('getChart');

    $("#loadingMessage").html("Loading");
    $.ajax({
        url: `http://localhost:5000/data/${cc}/${tt}`,
        success: function (result) {
            $("#loadingMessage").html("");
            var data = [];
            var json = JSON.parse(result)
            data.push(Object.values(json.total));
            data.push(Object.values(json.MA12));
            var labels = Object.values(json.PERIOD);
            console.log(data);

            renderChart(data, labels)
        },
        error: function (err) {
            $("#loadingMessage").html("Error")
        }
    })
}
$("#renderBtn").click(
    function () {
        getChartData('de', 'e');
    }
);