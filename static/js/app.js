// d3 to read in samples.json
d3.json("../../samples.json").then((data) => {
    console.log(data);
});


// initial page
function init() {

    // d3 to select dropdown options
    var dropdown = d3.select("#selDataset");

    d3.json("../samples.json").then((data) => {

        // populate dropdown menu with id numbers
        data.names.forEach(function (id) {
            dropdown.append("option").text(id).property("value");
        });

        // displaying initial data
        demBox(data.names[0]);
        barChart(data.names[0]);
        bubbleChart(data.names[0]);
    });
}

init();


// demographics box
function demBox(id) {

    // table variables
    var tbody = d3.select("tbody")
    var thead = d3.select("thead")
    var row = tbody.append("tr");
    var head = thead.append("tr")

    d3.json("../samples.json").then((data) => {

        // variables to loop through
        var metadata = data.metadata;
        var metadataFiltered = metadata.filter(mt => mt.id.toString() === id)[0];

        // for each function to populate box with values
        Object.entries(metadataFiltered).forEach((value) => {
            head.append("th").text(value[0]);
            row.append("td").text(value[1]);
        });

    });
}


// horizontal bar chart
function barChart(id) {
    d3.json("../samples.json").then((data) => {

        // variables for plotly
        var samples = data.samples.filter(smp => smp.id.toString() === id)[0];
        var barX = samples.sample_values.slice(0, 10).reverse();
        var ids = (samples.otu_ids.slice(0, 10)).reverse();
        var barY = ids.map(value => `OTU ${value}`)
        var barHover = samples.otu_labels.slice(0, 10);


        // trace for plotly
        var trace = {
            x: barX,
            y: barY,
            text: barHover,
            type: "bar",
            orientation: "h",
        };

        var data = [trace];
        var layout = {
            title: "Top 10 OTUs for Individual",
        };

        Plotly.newPlot("bar", data, layout);

    })
};



// bubble chart
function bubbleChart(id) {
    d3.json("../samples.json").then((data) => {

        // variables for plotly
        var samples = data.samples.filter(smp => smp.id.toString() === id)[0];
        var bubbleX = samples.otu_ids;
        var bubbleY = samples.sample_values;
        var bubbleHover = samples.otu_labels;


        // trace for plotly
        var trace = {
            x: bubbleX,
            y: bubbleY,
            text: bubbleHover,
            mode: "markers",
            marker: {
                size: bubbleY,
                color: bubbleX,
            }
        };

        var data = [trace];
        var layout = {
            xaxis: { title: "OTU ID" },
        };

        Plotly.newPlot("bubble", data, layout);

    })
};


// grab function from html to update with new selection
function optionChanged(id) {

    //clear dem table
    var tbody = d3.select("tbody")
    var thead = d3.select("thead")
    tbody.html("");
    thead.html("");

    // call updated functions
    demBox(id);
    barChart(id);
    bubbleChart(id);
}