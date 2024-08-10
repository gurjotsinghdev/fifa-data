d3.csv('data/people-100.csv').then(data => {
    // Convert relevant fields (like Date of birth) to appropriate formats
    data.forEach(d => {
        d['Date of birth'] = new Date(d['Date of birth']);
        d['Age'] = calculateAge(d['Date of birth']);
        d['Year'] = d['Date of birth'].getFullYear();  // Extract year from the date
    });

    console.log('CSV Data:', data);

    createGenderBarChart(data);
    createJobTitleBarChart(data);
    createAgeHistogram(data);
    createBirthMonthPieChart(data);  // Updated Pie Chart for Job Title Proportion
    createTopJobTitlesChart(data);
    createBirthYearLineChart(data);  // Line Chart Visualization
}).catch(error => console.error('Error loading CSV data:', error));

// Function to calculate Age
function calculateAge(dob) {
    const diff = Date.now() - dob.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

// 1. Gender Distribution (Bar Chart) with Tooltip
function createGenderBarChart(data) {
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#gender-bar-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const genderCounts = d3.rollup(data, v => v.length, d => d.Sex);

    const x = d3.scaleBand()
        .domain(Array.from(genderCounts.keys()))
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(genderCounts.values())])
        .nice()
        .range([height, 0]);

    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    svg.append("g")
        .selectAll(".bar")
        .data(Array.from(genderCounts))
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d[0]))
        .attr("y", d => y(d[1]))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d[1]))
        .attr("fill", "steelblue")
        .on("mouseover", function(event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`Gender: ${d[0]}<br>Count: ${d[1]}`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
            d3.select(this).attr("fill", "orange");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
            d3.select(this).attr("fill", "steelblue");
        });

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y));
}


// 2. Job Title Distribution (Bar Chart)
function createJobTitleBarChart(data) {
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#job-title-bar-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const jobTitleCounts = d3.rollup(data, v => v.length, d => d['Job Title']);

    const x = d3.scaleBand()
        .domain(Array.from(jobTitleCounts.keys()))
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(jobTitleCounts.values())])
        .nice()
        .range([height, 0]);

    svg.append("g")
        .selectAll(".bar")
        .data(Array.from(jobTitleCounts))
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d[0]))
        .attr("y", d => y(d[1]))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d[1]))
        .attr("fill", "orange");

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y));
}

// 3. Age Distribution (Histogram) with Hover Effect
function createAgeHistogram(data) {
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#age-histogram")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.Age))
        .nice()
        .range([0, width]);

    const bins = d3.histogram()
        .domain(x.domain())
        .thresholds(x.ticks(10))
        (data.map(d => d.Age));

    const y = d3.scaleLinear()
        .domain([0, d3.max(bins, d => d.length)])
        .nice()
        .range([height, 0]);

    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    svg.append("g")
        .selectAll(".bar")
        .data(bins)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.x0) + 1)
        .attr("y", d => y(d.length))
        .attr("width", d => x(d.x1) - x(d.x0) - 1)
        .attr("height", d => height - y(d.length))
        .attr("fill", "green")
        .on("mouseover", function(event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`Count: ${d.length}`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
            d3.select(this).attr("fill", "orange");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
            d3.select(this).attr("fill", "green");
        });

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y));
}


// 4. Birth Month Distribution (Pie Chart) with Hover Effect
function createBirthMonthPieChart(data) {
    const width = 450;
    const height = 450;
    const margin = 40;

    const radius = Math.min(width, height) / 2 - margin;

    const svg = d3.select("#birth-month-pie-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

    const monthCounts = new Array(12).fill(0);
    data.forEach(d => {
        const month = d['Date of birth'].getMonth();
        monthCounts[month]++;
    });

    const pieData = monthCounts.map((count, index) => ({
        month: index,
        count: count
    }));

    const pie = d3.pie()
        .value(d => d.count);

    const data_ready = pie(pieData);

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    const monthNames = ["January", "February", "March", "April", "May", "June", 
                        "July", "August", "September", "October", "November", "December"];

    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    svg.selectAll('slices')
        .data(data_ready)
        .enter().append('path')
        .attr('d', arc)
        .attr('fill', (d, i) => d3.schemeCategory10[i])
        .on("mouseover", function(event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`${monthNames[d.data.month]}: ${d.data.count} people`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
            d3.select(this).transition()
                .duration(200)
                .attr("transform", "scale(1.1)");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
            d3.select(this).transition()
                .duration(200)
                .attr("transform", "scale(1)");
        });

    svg.selectAll('slices')
        .data(data_ready)
        .enter().append('text')
        .text(d => monthNames[d.data.month])
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .style("text-anchor", "middle")
        .style("font-size", 10);
}



// 5. Top 10 Job Titles by Frequency (Horizontal Bar Chart) with Click Event
function createTopJobTitlesChart(data) {
    const margin = { top: 20, right: 30, bottom: 40, left: 100 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#top-job-titles")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const jobTitleCounts = Array.from(d3.rollup(data, v => v.length, d => d['Job Title']))
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    const y = d3.scaleBand()
        .domain(jobTitleCounts.map(d => d[0]))
        .range([0, height])
        .padding(0.1);

    const x = d3.scaleLinear()
        .domain([0, d3.max(jobTitleCounts, d => d[1])])
        .nice()
        .range([0, width]);

    svg.append("g")
        .selectAll(".bar")
        .data(jobTitleCounts)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("y", d => y(d[0]))
        .attr("x", 0)
        .attr("width", d => x(d[1]))
        .attr("height", y.bandwidth())
        .attr("fill", "teal")
        .on("click", function(event, d) {
            d3.selectAll(".bar").attr("fill", "teal");  // Reset all bars
            d3.select(this).attr("fill", "orange");
            console.log(`Job Title: ${d[0]}, Count: ${d[1]}`);
        });

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y));
}


// 6. Birth Year Trend (Line Chart)
function createBirthYearLineChart(data) {
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#birth-year-trend")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Aggregate data by birth year
    const birthYearCounts = d3.rollup(data, v => v.length, d => d['Year']);
    const birthYearData = Array.from(birthYearCounts, ([year, count]) => ({ year, count })).sort((a, b) => a.year - b.year);

    const x = d3.scaleLinear()
        .domain(d3.extent(birthYearData, d => d.year))
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(birthYearData, d => d.count)])
        .nice()
        .range([height, 0]);

    const line = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.count));

    svg.append("path")
        .datum(birthYearData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line);

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("d")));  // Format as full year

    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y));
}
