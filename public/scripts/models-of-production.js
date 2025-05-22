import { getTopicColor } from "../../src/utils/colors.js";

function urlToTopic() {
  const path = window.location.pathname;
  const pathParts = path.split("/");
  return pathParts[2];
}

function setUpParameters(render, parameters, modelPrefix) {
  parameters.forEach((param) => {
    const slider = document.getElementById(`slider${modelPrefix}${param}`);
    slider.oninput = function () {
      slider.previousElementSibling.innerText = this.value;
      render();
    };
  });
  return parameters.map((param) => {
    return parseFloat(
      document.getElementById(`output${modelPrefix}${param}`).textContent,
    );
  });
}

function drawSolowGraph() {
  const L = 150,
    K_MAX = 500,
    margin = { top: 20, right: 30, bottom: 20, left: 50 };

  const [A, d, s, alpha] = setUpParameters(
    drawSolowGraph,
    ["A", "d", "s", "alpha"],
    "S",
  );
  const solowOutput = (K) => A * Math.pow(K, alpha) * Math.pow(L, 1 - alpha);
  const solowDepreciation = (K) => d * K;
  const solowInvestment = (Y) => s * Y;

  const container = document.getElementById("solow-visualization");

  const width = container.clientWidth - margin.left - margin.right;
  const height = container.clientHeight - margin.top - margin.bottom;

  console.log(width, height);

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
    .html(`\\(Y\\)`);

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
    .append("xhtml:div")
    .html("\\(\\bar{d}K\\)");

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

  const labelFO = svg
    .append("foreignObject")
    .attr("width", 16)
    .attr("height", 20)
    .attr("x", x(K_MAX))
    .attr("y", y(investmentData[K_MAX - 1].Y))
    .append("xhtml:span")
    .attr("class", "latex-label");

  function renderLabel() {

    katex.render("I", labelFO.node(), {
      displayMode: false,
      throwOnError: false,
    });
  }

  renderLabel();

  // svg
  //   .append("foreignObject")
  //   .attr("width", "1em")
  //   .attr("height", "2em")
  //   .attr("x", x(K_MAX))
  //   .attr("y", y(investmentData[K_MAX - 1].Y))
  //   .append("xhtml:body")
  //   .style("font-size", "0.75em")
  //   .html("\\(I\\)");

  const k_star = L * Math.pow((s * A) / d, 1 / (1 - alpha));
  svg
    .append("line")
    .attr("x1", x(k_star))
    .attr("y1", y((d * k_star) / s))
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
    .attr("x", x(k_star) - 40)
    .attr("y", y(y_star) - 40)
    .append("xhtml:body")
    .style("font-size", "0.75em")
    .html(`(${k_star.toFixed(0)}, ${y_star.toFixed(0)})`);
}

const formatNumber = (num) => {
  return `~${num.toExponential(0)}`;
};

const normalFont = `style="font-weight: normal"`;

const updateRomerTable = (romerData) => {
  const tableHeader = document.getElementById("romer-table-header");
  const rowA_t = document.getElementById("row-A_t");
  const rowY_t = document.getElementById("row-Y_t");

  tableHeader.innerHTML = `<th ${normalFont}>t</th>`;
  rowA_t.innerHTML = `<td class="romer-table-at">A_t</td>`;
  rowY_t.innerHTML = `<td class="romer-table-yt">Y_t</td>`;

  romerData.forEach((d) => {
    if (d.year % 20 === 0 || d.year === 1) {
      tableHeader.innerHTML += `<th ${normalFont}>${d.year}</th>`;
      rowA_t.innerHTML += `<td>${formatNumber(d.A)}</td>`;
      rowY_t.innerHTML += `<td>${formatNumber(d.Y)}</td>`;
    }
  });
};

function drawRomerGraph() {
  const T_MAX = 100,
    margin = { top: 20, right: 100, bottom: 20, left: 50 };

  const [z, L, l, A0] = setUpParameters(
    drawRomerGraph,
    ["z", "L", "l", "A0"],
    "R",
  );

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
    .html(`\\(log_{10}Y\\)`);

  updateRomerTable(romerData);
}

function drawRomerlGraph() {
  const T_MAX = 100,
    z = 0.01,
    L = 50,
    A0 = 50,
    margin = { top: 20, right: 100, bottom: 20, left: 50 };

  const [l, t0] = setUpParameters(drawRomerlGraph, ["lChange", "t0"], "");

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

  for (let t = 1; t <= t0; ++t) {
    const A_t = A * (1 + z * l_ * L);
    const Y_t = A_t * (1 - l_) * L;
    romerData.push({ year: t, A: A_t, Y: Math.log10(Y_t) });
    A = A_t;
  }

  for (let t = t0 + 1; t <= T_MAX; ++t) {
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
    .append("line")
    .attr("x1", x(t0))
    .attr("y1", y(romerData[T_MAX - 1].Y))
    .attr("x2", x(t0))
    .attr("y2", height)
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .attr("stroke-dasharray", "4");

  svg
    .append("foreignObject")
    .attr("width", "5em")
    .attr("height", "2em")
    .attr("x", x(0) + 15)
    .attr("y", y(romerData[0].Y))
    .append("xhtml:body")
    .style("font-size", "0.6em")
    .html(`\\(\\bar{l}_0=${l_}\\)`);

  svg
    .append("foreignObject")
    .attr("width", "5em")
    .attr("height", "2em")
    .attr("x", x(t0) + 15)
    .attr("y", y(romerData[t0].Y))
    .append("xhtml:body")
    .style("font-size", "0.6em")
    .html(`\\(\\bar{l}_1=${l}\\)`);

  svg
    .append("foreignObject")
    .attr("width", "4em")
    .attr("height", "2em")
    .attr("x", x(T_MAX))
    .attr("y", y(romerData[T_MAX - 1].Y))
    .append("xhtml:body")
    .style("font-size", "0.75em")
    .html(`\\(log_{10}Y\\)`);
}

function calculateRomerSolowData(
  T_MAX,
  L,
  l,
  A0,
  alpha,
  s,
  d,
  z,
  t0 = Infinity,
  L0,
  l0,
  alpha0,
  z0,
) {
  let A = A0,
    K_t = 1,
    romerSolowData = [];

  for (let t = 1; t <= T_MAX; ++t) {
    if (t > t0) {
      alpha = alpha0;
      z = z0;
      l = l0;
      L = L0;
    }

    const Y_t = A * Math.pow(K_t, alpha) * Math.pow((1 - l) * L, 1 - alpha);
    const A_t = A * (1 + z * l * L);
    K_t = K_t + s * Y_t - d * K_t;
    romerSolowData.push({ year: t, A: A_t, K: K_t, Y: Math.log10(Y_t) });
    A = A_t;
  }

  return romerSolowData;
}

function drawRomerSolowGraph() {
  const T_MAX = 100,
    margin = { top: 20, right: 100, bottom: 20, left: 50 };

  const [z, l, L, A0, s, d, alpha] = setUpParameters(
    drawRomerSolowGraph,
    ["z", "l", "L", "A0", "s", "d", "alpha"],
    "RS",
  );

  const container = document.getElementById("romer-solow-visualization");
  const width = container.clientWidth - margin.left - margin.right;
  const height = container.clientHeight - margin.top - margin.bottom;

  container.innerHTML = "";

  const svg = d3
    .select("#romer-solow-visualization")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const romerSolowData = calculateRomerSolowData(
    T_MAX,
    L,
    l,
    A0,
    alpha,
    s,
    d,
    z,
  );

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
    .domain([0, romerSolowData[romerSolowData.length - 1].Y])
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
    .datum(romerSolowData)
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
    .attr("y", y(romerSolowData[T_MAX - 1].Y))
    .append("xhtml:body")
    .style("font-size", "0.75em")
    .html(`\\(log_{10}Y\\)`);
}

function drawRomerSolowChangeGraph() {
  const T_MAX = 100,
    margin = { top: 20, right: 100, bottom: 20, left: 50 },
    s = 0.2,
    d = 0.2,
    A0 = 50,
    alpha = 0.33,
    l = 0.5,
    L = 100,
    z = 0.5;

  const [z0, l0, L0, alpha0, t0] = setUpParameters(
    drawRomerSolowChangeGraph,
    ["z0", "l0", "L0", "alpha0", "t0"],
    "RSC",
  );

  const container = document.getElementById("romer-solow-change-visualization");
  const width = container.clientWidth - margin.left - margin.right;
  const height = container.clientHeight - margin.top - margin.bottom;

  container.innerHTML = "";

  const svg = d3
    .select("#romer-solow-change-visualization")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const romerSolowData = calculateRomerSolowData(
    T_MAX,
    L,
    l,
    A0,
    alpha,
    s,
    d,
    z,
    t0,
    L0,
    l0,
    alpha0,
    z0,
  );

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
    .domain([0, romerSolowData[romerSolowData.length - 1].Y])
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
    .datum(romerSolowData)
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
    .append("line")
    .attr("x1", x(t0))
    .attr("y1", y(romerSolowData[T_MAX - 1].Y))
    .attr("x2", x(t0))
    .attr("y2", height)
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .attr("stroke-dasharray", "4");

  svg
    .append("foreignObject")
    .attr("width", "4em")
    .attr("height", "2em")
    .attr("x", x(T_MAX))
    .attr("y", y(romerSolowData[T_MAX - 1].Y))
    .append("xhtml:body")
    .style("font-size", "0.75em")
    .html(`\\(log_{10}Y\\)`);
}

document.addEventListener("DOMContentLoaded", function () {
  drawSolowGraph();
  drawRomerGraph();
  drawRomerlGraph();
  drawRomerSolowGraph();
  drawRomerSolowChangeGraph();

  window.onresize = () => {
    drawSolowGraph();
    drawRomerGraph();
    drawRomerlGraph();
    drawRomerSolowGraph();
    drawRomerSolowChangeGraph();
  };
});
