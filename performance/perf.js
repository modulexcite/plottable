
var plotTypes = []; 
var category = false;
var pts_array = [10];
var ds_array = [1]; 
var samples = 10;




var render = function(plot, points, datasets){
  var ds_array = [];
    
  for( var i = 0; i < datasets; i++){
    var data = makeRandomData(points);
    if(category){
      for( var j = 0; j < points; j++){
        data[j].x = j.toString();
      }
    }    
    ds_array.push(new Plottable.Dataset(data));
  }
                         
  var xScale= category ? new Plottable.Scales.Category() : new Plottable.Scales.Linear();
  var yScale = new Plottable.Scales.Linear();
    
  for( var i = 0; i < datasets; i++ ){
    plot.addDataset(ds_array[i]); 
  }
  plot.x(function(d) { return d.x; }, xScale)
      .y(function(d) { return d.y; }, yScale);
  
  var start = Date.now();
  plot.renderTo("#chart");  
  var end = Date.now();  
  plot.destroy();
    
  return end - start;    
};

var get_average = function(plotType, points, datasets){
  var total = 0;
  for( var i = 0; i < samples; i++){
    var newPlot = new Plottable.Plots[plotType]()
    total += render(newPlot, points, datasets);
    d3.select("#chart").text("");
  }  
  return total/samples;
};    


var render_results = function(result_data, plotType){

  var xScale = new Plottable.Scales.Linear();
  var yScale = new Plottable.Scales.Linear();
   
  var xAxis = new Plottable.Axes.Numeric(xScale, "bottom");
  var xAxisLabel = new Plottable.Components.AxisLabel("total number of points rendered", 0);
  var yAxis = new Plottable.Axes.Numeric(yScale, "left");
  var yAxisLabel = new Plottable.Components.AxisLabel("time to render (ms)", 270);
    
  var colorScale = new Plottable.Scales.Color();
  var csDomain = [];
  for(var i = 0; i < ds_array.length; i++){
    csDomain.push(ds_array[i].toString());      
  }      
  colorScale.domain(csDomain); 
  var legend = new Plottable.Components.Legend(colorScale);
  var legend_title = new Plottable.Components.AxisLabel("datasets", 0);
  var legend_table = new Plottable.Components.Table([[legend_title], [legend]]);  
  
  var titleString = "Time to render points on " + plotType + " Plots";
  var title_label = new Plottable.Components.TitleLabel(titleString, 0);  
    
  var dataset = new Plottable.Dataset(result_data);
    
  var results = new Plottable.Plots.Scatter()
    .addDataset(dataset)
    .x(function(d){
      return d.points * d.datasets;
    }, xScale)
    .y(function(d){
      return d.time;
    }, yScale)
    .size(15)
    .attr("fill", 
    function(d){
      return d.datasets.toString();
    }, colorScale);
    
  var table = new Plottable.Components.Table([[null, null, title_label, null],
                                              [yAxisLabel, yAxis, results, legend_table],
                                              [null, null, xAxis, null],
                                              [null, null, xAxisLabel, null]]);
    var svg = d3.select("#results")
        .append("svg")
        .attr("class", "result_plot")
        .attr("width", "50%")
        .attr("height", "600");
    svg.append("rect")
	    .attr("width", "100%")
	    .attr("height", "100%")
	    .attr("fill", "#ffffff");

    table.renderTo(svg);       
};  


var collect_data = function(plotType){
  var result_data = [];
    
  for( var i = 0; i < pts_array.length; i++){
    for( var j = 0; j < ds_array.length; j++){
      result_data.push({points: pts_array[i]/ds_array[j], datasets: ds_array[j], 
                    time: get_average(plotType, pts_array[i]/ds_array[j], ds_array[j])})         
    }    
  }      
  return result_data;  
};

var update_plotTypes = function(){
  plotTypes = [];
  var boxes = $(":checkbox:checked");
  for(var i = 0; i < boxes.length; i++){
    plotTypes.push(boxes[i].value)
  }
};  

update_samples = function(){
  samples = $("#samples")[0].value;
}  


run = function() {
  $('.result_plot').remove();
  update_plotTypes();
  update_samples();

  var len = plotTypes.length;
  var i = 0;
  var runTests = setInterval(function() {
      if (i < len) {
        render_results(collect_data(plotTypes[i]), plotTypes[i]);
        $("#progress").text("Progress: " + (i + 1).toString() + "/" + len.toString());
      } else {
        clearInterval(runTests);
      }
      i++     
  }, 1);

};