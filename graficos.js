var charts = {};

function desenharGraficos(escolas) {
  var com = function(campo) {
    return escolas.filter(function(e) {
      return e[campo] === true;
    }).length;
  };
  var sem = function(campo) {
    return escolas.filter(function(e) { 
      return e[campo] === false;
    }).length;
  };

  criarGrafico("grafico-internet", "pie",
    ["Com Internet", "Sem Internet"],
    [com("internet"), sem("internet")],
    ["#2c7be5", "#e04040"]
  );

  criarGrafico("grafico-lab", "pie",
    ["Com Laboratório", "Sem Laboratório"],
    [com("laboratorio"), sem("laboratorio")],
    ["#f0a500", "#aaaaaa"]
  );

  criarGrafico("grafico-alunos", "bar",
    escolas.map(function(e) {
      return e.nome || "Sem nome";
    }),
    escolas.map(function(e) {
      return e.qtdAlunos || 0;
    }),
    "#2c7be5"
  );
}

function criarGrafico(id, tipo, labels, dados, cores) {
  if (charts[id]) charts[id].destroy();

  var options = {
    responsive: true,
    plugins: {
      legend: { display: tipo === "pie" }
    }
  };

  if (tipo === "bar") {
    options.scales = {
      x: {
        ticks: { color: "#c0c0c0", font: { size: 11 } },
        grid:  { color: "#2a2a35" }
      },
      y: {
        beginAtZero: true,
        ticks: { color: "#c0c0c0" },
        grid:  { color: "#2a2a35" }
      }
    };
  }

  charts[id] = new Chart(document.getElementById(id).getContext("2d"), {
    type: tipo,
    data: {
      labels: labels,
      datasets: [{ data: dados, backgroundColor: cores, label: "Alunos" }]
    },
    options: options
  });
}