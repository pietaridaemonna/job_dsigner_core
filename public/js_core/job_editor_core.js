var links = [
  {source: "Win 10", target: "Debian", type: "licensing"},
  {source: "Win 10", target: "Proxy", type: "licensing"},
  {source: "NetBSD", target: "RedHat 7.3", type: "suit"},
  {source: "Win 8.1", target: "RedHat 7.3", type: "suit"},
  {source: "Firewall", target: "RedHat 7.3", type: "resolved"},
  {source: "Proxy", target: "RedHat 7.3", type: "suit"},
  {source: "CISCO", target: "RedHat 7.3", type: "suit"},
  {source: "Win 10", target: "Solaris", type: "suit"},
  {source: "Win 10", target: "VirtSwitch", type: "suit"},
  {source: "Oracle Linux", target: "Google", type: "suit"},
  {source: "RedHat 7.3", target: "Proxy", type: "suit"},
  {source: "Win 10", target: "Inventec", type: "suit"},
  {source: "NetBSD", target: "CISCO", type: "resolved"},
  {source: "HP_Blade", target: "CISCO", type: "resolved"},
  {source: "HPE", target: "CISCO", type: "suit"},
  {source: "HPE", target: "Google", type: "suit"},
  {source: "iSCSI", target: "HP_Blade", type: "suit"},
  {source: "CISCO", target: "HP_Blade", type: "resolved"},
  {source: "RedHat 7.3", target: "Firewall", type: "resolved"},
  {source: "Qualcomm", target: "Firewall", type: "resolved"},
  {source: "RedHat 7.3", target: "Win 8.1", type: "suit"},
  {source: "Win 10", target: "Win 8.1", type: "suit"},
  {source: "Win 8.1", target: "Win 10", type: "suit"},
  {source: "H3C", target: "SGI", type: "suit"},
  {source: "Asterisk", target: "SGI", type: "suit"},
  {source: "CISCO", target: "NetBSD", type: "resolved"},
  {source: "RedHat 7.3", target: "NetBSD", type: "suit"},
  {source: "CISCO", target: "HPE", type: "suit"},
  {source: "Firewall", target: "Qualcomm", type: "suit"}
];

var nodes = {};

// Compute the distinct nodes from the links.
links.forEach(function(link) {
  link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
  link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
});

var width = 960,
    height = 500;

var force = d3.layout.force()
    .nodes(d3.values(nodes))
    .links(links)
    .size([width, height])
    .linkDistance(80)
    .charge(-300)
    .on("tick", tick)
    .start();

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

// Per-type markers, as they don't inherit styles.
svg.append("defs").selectAll("marker")
    .data(["suit", "licensing", "resolved"])
  .enter().append("marker")
    .attr("id", function(d) { return d; })
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 15)
    .attr("refY", -1.5)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
  .append("path")
    .attr("d", "M0,-5L10,0L0,5");

var path = svg.append("g").selectAll("path")
    .data(force.links())
  .enter().append("path")
    .attr("class", function(d) { return "link " + d.type; })
    .attr("marker-end", function(d) { return "url(#" + d.type + ")"; });

var circle = svg.append("g").selectAll("circle")
    .data(force.nodes())
  .enter().append("circle")
    .attr("r", 6)
    .call(force.drag);

var text = svg.append("g").selectAll("text")
    .data(force.nodes())
  .enter().append("text")
    .attr("x", 8)
    .attr("y", ".31em")
    .text(function(d) { return d.name; });

// Use elliptical arc path segments to doubly-encode directionality.
function tick() {
  path.attr("d", linkArc);
  circle.attr("transform", transform);
  text.attr("transform", transform);
}

function linkArc(d) {
  var dx = d.target.x - d.source.x,
      dy = d.target.y - d.source.y,
      dr = Math.sqrt(dx * dx + dy * dy);
  return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
}

function transform(d) {
  return "translate(" + d.x + "," + d.y + ")";
}