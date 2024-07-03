function drawSolowGraph() {
  const L = 150,
    K_MAX = 500,
    margin = { top: 20, right: 30, bottom: 20, left: 50 };

  ["A", "D", "S", "Alpha"].forEach((param) => {
    const slider = document.getElementById(`slider${param}`);
    slider.oninput = function () {
      slider.previousElementSibling.innerText = this.value;
      drawSolowGraph();
    };
  });

  const A = parseFloat(document.getElementById("outputA").textContent),
    D = parseFloat(document.getElementById("outputD").textContent),
    S = parseFloat(document.getElementById("outputS").textContent),
    alpha = parseFloat(document.getElementById("outputAlpha").textContent);
  const solowOutput = (K) => A * Math.pow(K, alpha) * Math.pow(L, 1 - alpha);
  const solowDepreciation = (K) => D * K;
  const solowInvestment = (Y) => S * Y;

  const container = document.getElementById("solow-visualization");
  const width = container.clientWidth - margin.left - margin.right;
  const height = container.clientHeight - margin.top - margin.bottom;

  container.innerHTML = "";

  const svg = d3
    .select("#solow-visualization")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const x = d3.scaleLinear().domain([0, K_MAX]).range([0, width]);
  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x))
    .append("text")
    .attr("fill", "#000")
    .attr("x", width + 10)
    .attr("y", -10)
    .style("text-anchor", "end")
    .style("font-size", "1.5em")
    .text("K");

  const Y_MAX = solowOutput(K_MAX) + K_MAX / 10;
  const y = d3.scaleLinear().domain([0, Y_MAX]).range([height, 0]);
  svg
    .append("g")
    .call(d3.axisLeft(y))
    .append("text")
    .attr("fill", "#000")
    .attr("x", 0)
    .attr("y", -10)
    .style("text-anchor", "start")
    .style("font-size", "1.5em")
    .text("Y");

  const outputData = Array.from({ length: K_MAX }, (_, k) => ({
    K: k,
    Y: solowOutput(k),
  }));
  svg
    .append("path")
    .datum(outputData)
    .attr("fill", "none")
    .attr("stroke", getTopicColor(urlToTopic()))
    .attr("stroke-width", 2)
    .attr(
      "d",
      d3
        .line()
        .x((d) => x(d.K))
        .y((d) => y(d.Y)),
    );
  svg
    .append("foreignObject")
    .attr("width", "2em")
    .attr("height", "2em")
    .attr("x", x(K_MAX))
    .attr("y", y(outputData[K_MAX - 1].Y))
    .append("xhtml:body")
    .style("font-size", "0.75em")
    .html(`<div class="solow-visualization-y"></div>`);
  katex.render("Y", document.querySelector(".solow-visualization-y"));

  const depreciationData = Array.from({ length: K_MAX }, (_, k) => ({
    K: k,
    Y: solowDepreciation(k),
  }));
  svg
    .append("path")
    .datum(depreciationData)
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 2)
    .attr(
      "d",
      d3
        .line()
        .x((d) => x(d.K))
        .y((d) => y(d.Y)),
    );

  svg
    .append("foreignObject")
    .attr("width", "2em")
    .attr("height", "2em")
    .attr("x", x(K_MAX))
    .attr("y", y(depreciationData[K_MAX - 1].Y))
    .append("xhtml:body")
    .style("font-size", "0.75em")
    .html(`<div class="solow-visualization-d"></div>`);
  katex.render("\\bar{d}K", document.querySelector(".solow-visualization-d"));

  const investmentData = outputData.map((d) => ({
    K: d.K,
    Y: solowInvestment(d.Y),
  }));
  svg
    .append("path")
    .datum(investmentData)
    .attr("fill", "none")
    .attr("stroke", "purple")
    .attr("stroke-width", 2)
    .attr(
      "d",
      d3
        .line()
        .x((d) => x(d.K))
        .y((d) => y(d.Y)),
    );

  svg
    .append("foreignObject")
    .attr("width", "1em")
    .attr("height", "2em")
    .attr("x", x(K_MAX))
    .attr("y", y(investmentData[K_MAX - 1].Y))
    .append("xhtml:body")
    .style("font-size", "0.75em")
    .html(`<div class="solow-visualization-i"></div>`);
  katex.render("I", document.querySelector(".solow-visualization-i"));

  const k_star = L * Math.pow((S * A) / D, 1 / (1 - alpha));
  svg
    .append("line")
    .attr("x1", x(k_star))
    .attr("y1", y((D * k_star) / S))
    .attr("x2", x(k_star))
    .attr("y2", y(0))
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .attr("stroke-dasharray", "5,5");

  const y_star = solowOutput(k_star);
  svg
    .append("foreignObject")
    .attr("width", "20em")
    .attr("height", "2em")
    .attr("x", x(k_star) - 150)
    .attr("y", y(y_star) - 50)
    .append("xhtml:body")
    .style("font-size", "0.75em")
    .html(`<div class="solow-visualization-eq"></div>`);
  katex.render(
    `(K^*,Y^*)=(${k_star.toFixed(0)},${y_star.toFixed(0)})`,
    document.querySelector(".solow-visualization-eq"),
  );
}

const formatNumber = (num) => {
  return `~${num.toExponential(0)}`;
};

const normalFont = `style="font-weight: normal"`;

const updateRomerTable = (romerData) => {
  const tableHeader = document.getElementById("romer-table-header");
  const rowA_t = document.getElementById("row-A_t");
  const rowY_t = document.getElementById("row-Y_t");

  tableHeader.innerHTML = `<th ${normalFont}><div class="romer-table-time"></th>`;
  katex.render(`t`, document.querySelector(".romer-table-time"));
  rowA_t.innerHTML = `<td class="romer-table-at"></td>`;
  rowY_t.innerHTML = `<td class="romer-table-yt"></td>`;
  katex.render("A_t", document.querySelector(".romer-table-at"));
  katex.render("Y_t", document.querySelector(".romer-table-yt"));

  romerData.forEach((d) => {
    if (d.year % 20 === 0 || d.year === 1) {
      tableHeader.innerHTML += `<th ${normalFont}>${d.year}</th>`;
      rowA_t.innerHTML += `<td>${formatNumber(d.A)}</td>`;
      rowY_t.innerHTML += `<td>${formatNumber(d.Y)}</td>`;
    }
  });
};

function drawRomerGraph() {
  const T_MAX = 100;
  margin = { top: 20, right: 100, bottom: 20, left: 50 };

  ["Z", "L", "l", "A0"].forEach((param) => {
    const slider = document.getElementById(`slider${param}`);
    slider.oninput = function () {
      slider.previousElementSibling.innerText = this.value;
      drawRomerGraph();
    };
  });

  const z = parseFloat(document.getElementById("outputZ").textContent),
    L = parseFloat(document.getElementById("outputL").textContent),
    l = parseFloat(document.getElementById("outputl").textContent),
    A0 = parseFloat(document.getElementById("outputA0").textContent);

  const container = document.getElementById("romer-visualization");
  const width = container.clientWidth - margin.left - margin.right;
  const height = container.clientHeight - margin.top - margin.bottom;

  container.innerHTML = "";

  const svg = d3
    .select("#romer-visualization")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  let A = A0;
  const romerData = [];

  for (let t = 1; t <= T_MAX; ++t) {
    const A_t = A * (1 + z * l * L);
    const Y_t = A_t * (1 - l) * L;
    romerData.push({ year: t, A: A_t, Y: Math.log10(Y_t) });
    A = A_t;
  }

  const x = d3.scaleLinear().domain([1, T_MAX]).range([0, width]);
  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x))
    .append("text")
    .attr("fill", "#000")
    .attr("x", width + 10)
    .attr("y", -10)
    .style("text-anchor", "end")
    .style("font-size", "1.5em")
    .text("t");

  const y = d3
    .scaleLinear()
    .domain([0, romerData[romerData.length - 1].Y])
    .range([height, 0]);
  svg
    .append("g")
    .call(d3.axisLeft(y).ticks(10, d3.format(".1s")))
    .append("text")
    .attr("fill", "#000")
    .attr("x", 0)
    .attr("y", -10)
    .style("text-anchor", "start")
    .style("font-size", "1.5em")
    .text("log(Y)");

  svg
    .append("path")
    .datum(romerData)
    .attr("fill", "none")
    .attr("stroke", getTopicColor(urlToTopic()))
    .attr("stroke-width", 2)
    .attr(
      "d",
      d3
        .line()
        .x((d) => x(d.year))
        .y((d) => y(d.Y)),
    );

  svg
    .append("foreignObject")
    .attr("width", "4em")
    .attr("height", "2em")
    .attr("x", x(T_MAX))
    .attr("y", y(romerData[T_MAX - 1].Y))
    .append("xhtml:body")
    .style("font-size", "0.75em")
    .html(`<div class="romer-visualization-y"></div>`);
  katex.render("log_{10}Y", document.querySelector(".romer-visualization-y"));

  updateRomerTable(romerData);
}

function drawRomerlGraph() {
  const T_MAX = 100,
    z = 0.01,
    L = 50,
    A0 = 50;
  margin = { top: 20, right: 100, bottom: 20, left: 50 };

  const slider = document.getElementById(`sliderlChange`);
  slider.oninput = function () {
    slider.previousElementSibling.innerText = this.value;
    drawRomerlGraph();
  };

  const l = parseFloat(document.getElementById("outputlChange").textContent);

  const container = document.getElementById("romer-lchange-visualization");
  const width = container.clientWidth - margin.left - margin.right;
  const height = container.clientHeight - margin.top - margin.bottom;

  container.innerHTML = "";

  const svg = d3
    .select("#romer-lchange-visualization")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  let A = A0,
    l_ = 0.1;
  const romerData = [];

  for (let t = 1; t <= Math.floor(T_MAX / 2) - 1; ++t) {
    const A_t = A * (1 + z * l_ * L);
    const Y_t = A_t * (1 - l_) * L;
    romerData.push({ year: t, A: A_t, Y: Math.log10(Y_t) });
    A = A_t;
  }

  for (let t = Math.floor(T_MAX / 2); t <= T_MAX; ++t) {
    const A_t = A * (1 + z * l * L);
    const Y_t = A_t * (1 - l) * L;
    romerData.push({ year: t, A: A_t, Y: Math.log10(Y_t) });
    A = A_t;
  }

  const x = d3.scaleLinear().domain([1, T_MAX]).range([0, width]);
  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x))
    .append("text")
    .attr("fill", "#000")
    .attr("x", width + 10)
    .attr("y", -10)
    .style("text-anchor", "end")
    .style("font-size", "1.5em")
    .text("t");

  const y = d3
    .scaleLinear()
    .domain([0, romerData[romerData.length - 1].Y])
    .range([height, 0]);
  svg
    .append("g")
    .call(d3.axisLeft(y).ticks(10, d3.format(".1s")))
    .append("text")
    .attr("fill", "#000")
    .attr("x", 0)
    .attr("y", -10)
    .style("text-anchor", "start")
    .style("font-size", "1.5em")
    .text("log(Y)");

  svg
    .append("path")
    .datum(romerData)
    .attr("fill", "none")
    .attr("stroke", getTopicColor(urlToTopic()))
    .attr("stroke-width", 2)
    .attr(
      "d",
      d3
        .line()
        .x((d) => x(d.year))
        .y((d) => y(d.Y)),
    );
}

document.addEventListener("DOMContentLoaded", function () {
  drawSolowGraph();
  window.onresize = drawSolowGraph;

  drawRomerGraph();
  window.onresize = drawRomerGraph;

  drawRomerlGraph();
  window.onresize = drawRomerlGraph;
});
