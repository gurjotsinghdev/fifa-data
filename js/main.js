const API_KEY = 'd7bc68283efd4014a5d91e475a4e4699';  // Replace with your actual API key
const API_URL = 'https://api.football-data.org/v4/matches';
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

fetch(CORS_PROXY + API_URL, {
    headers: {
        'X-Auth-Token': 'd7bc68283efd4014a5d91e475a4e4699'
    }
})
.then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
})
.then(data => {
    console.log('Fetched data:', data);
    const matches = data.matches;
    createBarChart(matches);
    createPieChart(matches);
    createScatterPlot(matches);
    createLineChart(matches);
    createSankeyDiagram(matches);
    createMap(matches);
})
.catch(error => console.error('Error fetching data:', error));

// Example: Create a Bar Chart
function createBarChart(data) {
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#bar-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const teamWins = d3.rollup(data, v => v.length, d => d.homeTeam.name);

    const x = d3.scaleBand()
        .domain(Array.from(teamWins.keys()))
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(teamWins.values())])
        .nice()
        .range([height, 0]);

    svg.append("g")
        .selectAll(".bar")
        .data(Array.from(teamWins))
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d[0]))
        .attr("y", d => y(d[1]))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d[1]))
        .attr("fill", "steelblue");

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y));
}

// Add similar functions for Pie Chart, Scatter Plot, Line Chart, Sankey Diagram, and Map
function createPieChart(data) {
    // Example: Count goals by home team
    const teamGoals = d3.rollup(data, v => d3.sum(v, d => d.score.fullTime.homeTeam), d => d.homeTeam.name);

    const width = 450;
    const height = 450;
    const margin = 40;

    const radius = Math.min(width, height) / 2 - margin;

    const svg = d3.select("#pie-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

    const pie = d3.pie()
        .value(d => d[1]);

    const data_ready = pie(Array.from(teamGoals));

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    svg.selectAll('slices')
        .data(data_ready)
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', (d, i) => d3.schemeCategory10[i]);

    svg.selectAll('slices')
        .data(data_ready)
        .enter()
        .append('text')
        .text(d => d.data[0])
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .style("text-anchor", "middle")
        .style("font-size", 14);
}

function createScatterPlot(data) {
    // Implement Scatter Plot
}

function createLineChart(data) {
    // Implement Line Chart
}

function createSankeyDiagram(data) {
    // Implement Sankey Diagram
}

function createMap(data) {
    // Implement Map
}

fetch('https://jsonplaceholder.typicode.com/posts')
.then(response => response.json())
.then(data => console.log('Test data:', data))
.catch(error => console.error('Error fetching test data:', error));