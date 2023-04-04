const format = d3.format(',');

var TravalNumber

const main = d3.main()
  .attr('class', 'main')
  .html(d => 
    `<strong>Country: </strong><span class='outputs'>${d.properties.name}<br></span>
    <strong>Number of confirmed cases has travelled: </strong>
    <span class='outputs'>${format(d.TravalNumber)}</span>`);

const width = 1450;
const height = 500;

const color = d3.scaleThreshold()
  .domain([
    1,
    10,
    20,
    50,
    100,
    200,
    400
  ])
  .range([
    '#FFDCDC',
    '#FEADAD',
    '#FE8B8B',
    '#FF6363',
    '#FF0202',
    '#DE0000',
    '#7E0000'
  ]);

const svg = d3.select('body')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .append('g')
  .attr('class', 'map');

const projection = d3.geoRobinson()
  .translate( [width / 2, height / 2]);

const path = d3.geoPath().projection(projection);

svg.call(main);

Promise.all([
  d3.json('world_countries.json'),
  d3.tsv ('TravelHistory.tsv')
]).then(
  d => ready(null, d[0], d[1])
);

function ready(error, data, TravalNumber) {
  const TravalNumberById = {};

  TravalNumber.forEach(d => { TravalNumberById[d.id] = +d.TravalNumber; });
  data.features.forEach(d => { d.TravalNumber = TravalNumberById[d.id] });

  svg.append('g')
    .attr('class', 'countries')
    .selectAll('path')
    .data(data.features)
    .enter().append('path')
      .attr('d', path)
      .style('fill', d => color(TravalNumberById[d.id]))
      .style('stroke', 'white')
      .style('opacity', 0.8)
      .style('stroke-width', 0.3)
      .on('mouseover',function(d){
        main.show(d);
      })
      .on('mouseout', function(d){
        main.hide(d);
      });

}