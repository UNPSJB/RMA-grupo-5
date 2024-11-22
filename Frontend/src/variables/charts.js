const Chart = require("chart.js");
//const { info } = require("sass");

//
// Chart extension for making the bars rounded
// Code from: https://codepen.io/jedtrow/full/ygRYgo
//

const nombreTipo = {
  1: "Temperatura",
  2: "Temperatura",       
  3: "Humedad",        
  4: "Presión atmosférica",
  5: "Luz",  
  6: "Humedad del suelo",  
  7: "Humedad del suelo 2",
  8: "Resistencia del suelo",
  9: "Resistencia del suelo 2",
  10: "Oxígeno",
  11: "Dióxido de Carbono",
  12: "Velocidad del viento",
  13: "Dirección del Viento",
  14: "Precipitación",
  15: "Movimiento",
  16: "Voltaje",
  17: "Voltaje #2",
  18: "Corriente",
  19: "Corriente #2",
  20: "Iteraciones",
  21: "Latitud GPS",
  22: "Longitud GPS",
  23: "Altitud GPS",
  24: "HDOP GPS (Dilución Horizontal de Precisión)",
  25: "Nivel de Fluido",
  26: "Radiación UV",
  27: "Partículas 1",
  28: "Partículas 2.5",
  29: "Partículas 10",
  30: "Potencia",
  31: "Potencia #2",
  32: "Energía",
  33: "Energía #2",
  34: "Peso",
  35: "Peso #2"         
};
const obtenerNombreTipo = (data) => {
  return nombreTipo[data] || "";
};

const unidadesMedida = {
  1: "°C",       // Grados Celsius para temperatura
  2: "°C",       // Grados Celsius para temperatura 2
  3: "%",        // Porcentaje para humedad
  4: "hPa",      // Hectopascales para presión
  5: "Luz",
  6: "%",       // Humedad del suelo
  7: "%",       // Humedad del suelo 2
  8: "Ω.m2/m",       //Ohmios Resistencia del suelo
  9:"Ω.m2/m",        //Ohmios Resistencia del suelo 2
  10: "%",        //Porcentaje para el oxígeno
  11: "ppm", //Partes por millón (ppm) (Dióxido de Carbono)
  12: "m/s",  // Metros por segundo (Velocidad del Viento)
  13: "°",    // Grados (Dirección del Viento)
  14: "mm",   // Milímetros (Precipitación)
  15: "",     // Sin unidad específica (Movimiento)
  16: "V",    // Voltios (Voltaje)
  17: "V",    // Voltios (Voltaje #2)
  18: "A",    // Amperios (Corriente)
  19: "A",    // Amperios (Corriente #2)
  20: "",     // Sin unidad específica (Iteraciones)
  21: "°",    // Grados (Latitud GPS)
  22: "°",    // Grados (Longitud GPS)
  23: "m",    // Metros (Altitud GPS)
  24: "",     // Sin unidad específica (HDOP GPS)
  25: "m",    // Metros (Nivel de Fluido)
  26: "Índice UV",  // Índice UV (Radiación UV)
  27: "µg/m³",      // Microgramos por metro cúbico (Partículas 1)
  28: "µg/m³",      // Microgramos por metro cúbico (Partículas 2.5)
  29: "µg/m³",      // Microgramos por metro cúbico (Partículas 10)
  30: "W",    // Vatios (Potencia)
  31: "W",    // Vatios (Potencia #2)
  32: "Wh",   // Vatios-hora (Energía)
  33: "Wh",   // Vatios-hora (Energía #2)
  34: "kg",   // Kilogramos (Peso)
  35: "kg"    // Kilogramos (Peso #2)
  
  
};
const obtenerUnidad = (tipo) => {
  // Si el tipo existe devuelve la unidad, sino, devuelve una cadena vacía.
  return unidadesMedida[tipo] || "";
};

Chart.elements.Rectangle.prototype.draw = function () {
  var ctx = this._chart.ctx;
  var vm = this._view;
  var left, right, top, bottom, signX, signY, borderSkipped, radius;
  var borderWidth = vm.borderWidth;
  // Set Radius Here
  // If radius is large enough to cause drawing errors a max radius is imposed
  var cornerRadius = 6;

  if (!vm.horizontal) {
    // bar
    left = vm.x - vm.width / 2;
    right = vm.x + vm.width / 2;
    top = vm.y;
    bottom = vm.base;
    signX = 1;
    signY = bottom > top ? 1 : -1;
    borderSkipped = vm.borderSkipped || "bottom";
  } else {
    // horizontal bar
    left = vm.base;
    right = vm.x;
    top = vm.y - vm.height / 2;
    bottom = vm.y + vm.height / 2;
    signX = right > left ? 1 : -1;
    signY = 1;
    borderSkipped = vm.borderSkipped || "left";
  }

  // Canvas doesn't allow us to stroke inside the width so we can
  // adjust the sizes to fit if we're setting a stroke on the line
  if (borderWidth) {
    // borderWidth shold be less than bar width and bar height.
    var barSize = Math.min(Math.abs(left - right), Math.abs(top - bottom));
    borderWidth = borderWidth > barSize ? barSize : borderWidth;
    var halfStroke = borderWidth / 2;
    // Adjust borderWidth when bar top position is near vm.base(zero).
    var borderLeft = left + (borderSkipped !== "left" ? halfStroke * signX : 0);
    var borderRight =
      right + (borderSkipped !== "right" ? -halfStroke * signX : 0);
    var borderTop = top + (borderSkipped !== "top" ? halfStroke * signY : 0);
    var borderBottom =
      bottom + (borderSkipped !== "bottom" ? -halfStroke * signY : 0);
    // not become a vertical line?
    if (borderLeft !== borderRight) {
      top = borderTop;
      bottom = borderBottom;
    }
    // not become a horizontal line?
    if (borderTop !== borderBottom) {
      left = borderLeft;
      right = borderRight;
    }
  }

  ctx.beginPath();
  ctx.fillStyle = vm.backgroundColor;
  ctx.strokeStyle = vm.borderColor;
  ctx.lineWidth = borderWidth;

  // Corner points, from bottom-left to bottom-right clockwise
  // | 1 2 |
  // | 0 3 |
  var corners = [
    [left, bottom],
    [left, top],
    [right, top],
    [right, bottom],
  ];

  // Find first (starting) corner with fallback to 'bottom'
  var borders = ["bottom", "left", "top", "right"];
  var startCorner = borders.indexOf(borderSkipped, 0);
  if (startCorner === -1) {
    startCorner = 0;
  }

  function cornerAt(index) {
    return corners[(startCorner + index) % 4];
  }

  // Draw rectangle from 'startCorner'
  var corner = cornerAt(0);
  ctx.moveTo(corner[0], corner[1]);

  for (var i = 1; i < 4; i++) {
    corner = cornerAt(i);
    let nextCornerId = i + 1;
    if (nextCornerId === 4) {
      nextCornerId = 0;
    }

    // let nextCorner = cornerAt(nextCornerId);

    let width = corners[2][0] - corners[1][0];
    let height = corners[0][1] - corners[1][1];
    let x = corners[1][0];
    let y = corners[1][1];
    // eslint-disable-next-line
    var radius = cornerRadius;

    // Fix radius being too large
    if (radius > height / 2) {
      radius = height / 2;
    }
    if (radius > width / 2) {
      radius = width / 2;
    }

    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
  }

  ctx.fill();
  if (borderWidth) {
    ctx.stroke();
  }
};

var mode = "light"; //(themeMode) ? themeMode : 'light';
var fonts = {
  base: "Open Sans",
};

// Colors
var colors = {
  gray: {
    100: "#f6f9fc",
    200: "#e9ecef",
    300: "#dee2e6",
    400: "#ced4da",
    500: "#adb5bd",
    600: "#8898aa",
    700: "#525f7f",
    800: "#32325d",
    900: "#212529",
  },
  theme: {
    default: "#172b4d",
    primary: "#5e72e4",
    secondary: "#f4f5f7",
    info: "#11cdef",
    success: "#2dce89",
    danger: "#f5365c",
    warning: "#fb6340",
  },
  black: "#12263F",
  white: "#FFFFFF",
  transparent: "transparent",
};


function chartOptions() {
  // Options
  var options = {
    defaults: {
      global: {
        responsive: true,
        maintainAspectRatio: false,
        defaultColor: mode === "dark" ? colors.gray[700] : colors.gray[600],
        defaultFontColor: mode === "dark" ? colors.gray[700] : colors.gray[600],
        defaultFontFamily: fonts.base,
        defaultFontSize: 13,
        layout: {
          padding: 0,
        },
        legend: {
          display: false,
          position: "bottom",
          labels: {
            usePointStyle: true,
            padding: 16,
          },
        },
        elements: {
          point: {
            radius: 0,
            backgroundColor: colors.theme["primary"],
          },
          line: {
            tension: 0.4,
            borderWidth: 4,
            borderColor: colors.theme["primary"],
            backgroundColor: colors.transparent,
            borderCapStyle: "rounded",
          },
          rectangle: {
            backgroundColor: colors.theme["warning"],
          },
          arc: {
            backgroundColor: colors.theme["primary"],
            borderColor: mode === "dark" ? colors.gray[800] : colors.white,
            borderWidth: 4,
          },
        },
        tooltips: {
          enabled: true,
          mode: "index",
          intersect: false,
        },
      },
      doughnut: {
        cutoutPercentage: 83,
        legendCallback: function (chart) {
          var data = chart.data;
          var content = "";

          data.labels.forEach(function (label, index) {
            var bgColor = data.datasets[0].backgroundColor[index];

            content += '<span class="chart-legend-item">';
            content +=
              '<i class="chart-legend-indicator" style="background-color: ' +
              bgColor +
              '"></i>';
            content += label;
            content += "</span>";
          });

          return content;
        },
      },
    },
  };

  // yAxes
  Chart.scaleService.updateScaleDefaults("linear", {
    gridLines: {
      borderDash: [2],
      borderDashOffset: [2],
      color: mode === "dark" ? colors.gray[900] : colors.gray[300],
      drawBorder: false,
      drawTicks: false,
      lineWidth: 0,
      zeroLineWidth: 0,
      zeroLineColor: mode === "dark" ? colors.gray[900] : colors.gray[300],
      zeroLineBorderDash: [2],
      zeroLineBorderDashOffset: [2],
    },
    ticks: {
      beginAtZero: true,
      padding: 10,
      callback: function (value) {
        if (!(value % 10)) {
          return value;
        }
      },
    },
  });

  // xAxes
  Chart.scaleService.updateScaleDefaults("category", {
    gridLines: {
      drawBorder: false,
      drawOnChartArea: false,
      drawTicks: false,
    },
    ticks: {
      padding: 20,
    },
  });

  return options;
}

// Parse global options
function parseOptions(parent, options) {
  for (var item in options) {
    if (typeof options[item] !== "object") {
      parent[item] = options[item];
    } else {
      parseOptions(parent[item], options[item]);
    }
  }
}


let graficoLineal = {
  options: {
    scales: {
      yAxes: [
        {
          gridLines: {
            color: colors.gray[900],
            zeroLineColor: colors.gray[900],
          },
          ticks: {
            max: 2, // Máxima altura de las mareas en metros
            min: 0, // Altura mínima
            stepSize: 0.5, // Tamaño de paso en metros
            callback: function (value) {
              return value + "m"; 
            },
          },
        },
      ],
    },
    tooltips: {
      callbacks: {
        label: function (item, data) {
          var label = data.datasets[item.datasetIndex].label || "";
          var yLabel = item.yLabel;
          var content = "";

          if (data.datasets.length > 1) {
            content += label;
          }

          content += "" + parseFloat(yLabel.toFixed(5)) + " Metros"; 
          return content;
        },
      },
    },
    legend: {
      display: true,
      position: 'bottom',
    },
  },
  // nodoDataValues son los parametros recibidos desde "views/index"
  data1: (nodoDataValues, nodoA, nodoDataValues2, nodoB) => {
    // Get current time
    const ahora = new Date();
    const labels = [];
  
    // Loop to create labels for each even hour, going back 24 hours
    for (let i = 12; i >= 0; i--) { // 12 intervals for 24 hours, each 2 hours apart
      const hora = new Date(ahora.getTime() - i * 2 * 60 * 60 * 1000);
      labels.push(hora.getHours() + ":00");
      
    }
    labels[12] = "Hora Actual";
    return {
      labels: labels,
      datasets: [
        {
          label: "Nodo " + nodoA + " ",
          data: nodoDataValues,
          borderColor: 'rgba(255, 50, 132, 1)',
          fill: true,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
        },
        {
          label: "Nodo " + nodoB + " ",
          data: nodoDataValues2,
          borderColor: 'rgba(54, 150, 235, 1)',
          fill: true,
          backgroundColor: 'rgba(54, 150, 235, 0.2)',
        },
      ],
    };
  },  
  data2: (nodoDataValues, nodoA, nodoDataValues2, nodoB) => {
    const hoy = new Date();
    const diasSemana = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
    const labels = [];
  
    // Generate labels for the last 7 days, starting from today and moving backwards
    for (let i = 6; i >= 0; i--) { // Start from 6 to include today as the last label
      const dia = new Date(hoy);
      dia.setDate(hoy.getDate() - i);
      labels.push(diasSemana[dia.getDay()]);
    }
    labels[6] = "Hoy";
    return {
      labels: labels,
      datasets: [
        {
          label: "Nodo " + nodoA + " ",
          data: nodoDataValues,
          borderColor: 'rgba(255, 50, 132, 1)',
          fill: true,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
        },
        {
          label: "Nodo " + nodoB + " ",
          data: nodoDataValues2,
          borderColor: 'rgba(54, 150, 235, 1)',
          fill: true,
          backgroundColor: 'rgba(54, 150, 235, 0.2)',
        },
      ],
    };
  },
  
};


let graficoBarras = {
  options: {
    scales: {
      yAxes: [
        {
          ticks: {
            max: 25, // Máxima tempreratura en c°
            min: 0, // Minima tempreratura en c°
            stepSize: 5, // Tamaño de paso en C°
            callback: function (value) {
            return value;
              
            },
          },
        },
      ],
    },
    tooltips: {
      callbacks: {
        label: function (item, data) {
          var label = data.datasets[item.datasetIndex].label || "";
          var yLabel = item.yLabel;
          var content = "";
          if (data.datasets.length > 1) {
            content += label;
          }
          content += "" + parseFloat(yLabel.toFixed(1)) + "°c";
          return content;
        },
      },
    },
    legend: {
      display: true,
      position: 'bottom',
    },
  },
  data: (valoresTemperatura, nodoA, valoresTemperatura2, nodoB) => {
    const hoy = new Date();
    const diasSemana = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
    const labels = [];
  
    // Generate labels for the last 7 days, starting from today and moving backwards
    for (let i = 6; i >= 0; i--) { // Start from 6 to include today as the last label
      const dia = new Date(hoy);
      dia.setDate(hoy.getDate() - i);
      labels.push(diasSemana[dia.getDay()]);
    }
    labels[6] = "Hoy";
    return {
      labels:labels,
      datasets: [
        {
        label: "Nodo " + nodoA + " ",
        data: valoresTemperatura,
        maxBarThickness: 35,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 50, 132, 1)',
        borderWidth: 1.5,
      },
      {
        label: "Nodo " + nodoB + " ",
        data: valoresTemperatura2,
        maxBarThickness: 35,
        backgroundColor: 'rgba(54, 150, 235, 0.2)',
        borderColor: 'rgba(54, 150, 235, 1)',
        borderWidth: 1.5,
      },
    ],
    };
  },
};

let graficoCompuesto = {
  data: (nodoDataValues, tipo, nodoDataValues1, tipo1, nodoDataValues2, tipo2) => {
    const hoy = new Date();
    const diasSemana = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
    const labels = [];
  
    // Generate labels for the last 7 days, starting from today and moving backwards
    for (let i = 6; i >= 0; i--) { // Start from 6 to include today as the last label
      const dia = new Date(hoy);
      dia.setDate(hoy.getDate() - i);
      labels.push(diasSemana[dia.getDay()]);
    }
    labels[6] = "Hoy";
    return{
    labels: labels,
    datasets: [
      {
        label: obtenerNombreTipo(tipo),
        unidad: obtenerUnidad(tipo),
        data:nodoDataValues,
        backgroundColor: 'rgba(54, 150, 235, 0.5)',
        borderWidth: 1,
        borderColor: 'rgba(54, 150, 235, 0.8)',
        maxBarThickness: 35,
      },
      {
        label: obtenerNombreTipo(tipo1),
        unidad: obtenerUnidad(tipo1),
        data: nodoDataValues1,
        type: 'line',
        borderColor: 'rgba(50, 50, 200, 1)',
        fill: false,
        lineTension: 0,
      },
      {
        label: obtenerNombreTipo(tipo2),
        unidad: obtenerUnidad(tipo2),
        data: nodoDataValues2,
        type: 'line',
        borderColor: 'rgba(255, 50, 132, 1)',
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        lineTension: 0,
      },
    ],
    };
  },

  options: {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            callback: (value) => `${value}`, // Formatting y-axis labels
          },
        },
      ],
    },
    tooltips: {
      callbacks: {
        label: (tooltipItem, data) => {
          let dataset = data.datasets[tooltipItem.datasetIndex];
          return `${dataset.label}: ${parseFloat(tooltipItem.yLabel).toFixed(2)} ${dataset.unidad}`;
        },
      },
    },
    legend: {
      display: true,
      position: 'bottom',
    },
  },
};

let graficoRadar = {
  options: {
    legend: {
      display: true,
      position: 'bottom',
    },
  },
  data: (valoresTemperatura, nodoA, valoresTemperatura2, nodoB) => {
    const hoy = new Date();
    const diasSemana = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
    const labels = [];
  
    // Generate labels for the last 7 days, starting from today and moving backwards
    for (let i = 6; i >= 0; i--) { // Start from 6 to include today as the last label
      const dia = new Date(hoy);
      dia.setDate(hoy.getDate() - i);
      labels.push(diasSemana[dia.getDay()]);
    }
    labels[6] = "Hoy";
    return {
      labels:labels,
      datasets: [
        {
        label: "Nodo " + nodoA + " ",
        data: valoresTemperatura,
        maxBarThickness: 35,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 50, 132, 1)',
        borderWidth: 1.5,
      },
      {
        label: "Nodo " + nodoB + " ",
        data: valoresTemperatura2,
        maxBarThickness: 35,
        backgroundColor: 'rgba(54, 150, 235, 0.2)',
        borderColor: 'rgba(54, 150, 235, 1)',
        borderWidth: 1.5,
      },
    ],
    };
  },
};

let graficoPolar = {
  options: {
    legend: {
      display: true,
      position: "bottom",
      labels: {
        generateLabels: (chart) => {
          const datasets = chart.data.datasets;
          return datasets.map((dataset, i) => ({
            text: dataset.label, // Toma la etiqueta del dataset
            fillStyle: dataset.backgroundColor,
            strokeStyle: dataset.borderColor,
            lineWidth: dataset.borderWidth,
            hidden: !chart.isDatasetVisible(i),
            index: i,
          }));
        },
      },
    },
  },
  data: (valoresTemperatura, nodoA, valoresTemperatura2, nodoB) => {
    const hoy = new Date();
    const diasSemana = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
    const labels = [];
  
    // Generate labels for the last 7 days, starting from today and moving backwards
    for (let i = 6; i >= 0; i--) { // Start from 6 to include today as the last label
      const dia = new Date(hoy);
      dia.setDate(hoy.getDate() - i);
      labels.push(diasSemana[dia.getDay()]);
    }
    labels[6] = "Hoy";
    return {
      labels:labels,
      datasets: [
        {
        label: "Nodo " + nodoA + " ",
        data: valoresTemperatura,
        maxBarThickness: 35,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 50, 132, 1)',
        borderWidth: 1.5,
      },
      {
        label: "Nodo " + nodoB + " ",
        data: valoresTemperatura2,
        maxBarThickness: 35,
        backgroundColor: 'rgba(54, 150, 235, 0.2)',
        borderColor: 'rgba(54, 150, 235, 1)',
        borderWidth: 1.5,
      },
    ],
    };
  },
};
module.exports = {
  chartOptions, // used inside src/views/Index.js
  parseOptions, // used inside src/views/Index.js
  graficoLineal, // used inside src/views/Index.js
  graficoBarras, // used inside src/views/Index.js
  graficoCompuesto, //grafico compuesto
  graficoPolar,
  graficoRadar
};