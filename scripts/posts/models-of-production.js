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

  const A = document.getElementById("outputA").textContent,
    D = document.getElementById("outputD").textContent,
    S = document.getElementById("outputS").textContent,
    alpha = document.getElementById("outputAlpha").textContent;
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
  const xAxis = svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  xAxis
    .append("text")
    .attr("fill", "#000")
    .attr("x", width + 10)
    .attr("y", -10)
    .style("text-anchor", "end")
    .style("font-size", "1.5em")
    .text("K");

  const Y_MAX = solowOutput(K_MAX) + K_MAX / 10;
  const y = d3.scaleLinear().domain([0, Y_MAX]).range([height, 0]);
  const yAxis = svg.append("g").call(d3.axisLeft(y));

  yAxis
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
  katex.render("Y", document.querySelector(".solow-visualization-y"), {
    throwOnError: false,
  });

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
  katex.render("\\bar{d}K", document.querySelector(".solow-visualization-d"), {
    throwOnError: false,
  });

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
  katex.render("I", document.querySelector(".solow-visualization-i"), {
    throwOnError: false,
  });

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
    {
      throwOnError: false,
    },
  );
}

document.addEventListener("DOMContentLoaded", function () {
  drawSolowGraph();
  window.onresize = drawSolowGraph;
});
