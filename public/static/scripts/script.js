"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var d3 = require("./modules/d3.js");
window.onload = function () {
    var g;
    var rect;
    var circleTop;
    var circleBottom;
    var circleLeft;
    var circleRight;
    var deltaX;
    var deltaY;
    var svg = d3.select("#graph")
        .on("mousedown", mousedown)
        .on("mouseup", mouseup);
    var drag = d3.drag()
        .on("start", dragstart)
        .on("drag", dragmove);
    function mousedown() {
        var event = d3.mouse(this);
        g = svg.append("g")
            .call(drag);
        rect = g.append("rect")
            .attr("x", event[0])
            .attr("y", event[1])
            .attr("rx", 20)
            .attr("ry", 20)
            .attr('height', 0)
            .attr('width', 0)
            .attr("stroke", "#7b9eb4")
            .attr("stroke-width", 4)
            .attr("fill", "#aaa9ad")
            .call(drag)
            .on("mouseover", function () {
            d3.select(this)
                .style("cursor", "pointer");
        })
            .on("mouseout", function () {
            d3.select(this)
                .style("cursor", "default");
        });
        circleTop = g.append("circle")
            .attr("cx", (+rect.attr("x") + (+rect.attr("width") / 2)))
            .attr("cy", +rect.attr("y"))
            .attr("r", 5)
            .attr("class", "circleTop")
            .attr("fill", "grey");
        circleBottom = g.append("circle")
            .attr("cx", (+rect.attr("x") + (+rect.attr("width") / 2)))
            .attr("cy", (+rect.attr("y") + +rect.attr("height")))
            .attr("r", 5)
            .attr("class", "circleBottom")
            .attr("fill", "grey");
        circleLeft = g.append("circle")
            .attr("cx", +rect.attr("x"))
            .attr("cy", (+rect.attr("y") + (+rect.attr("height") / 2)))
            .attr("r", 5)
            .attr("class", "circleLeft")
            .attr("fill", "grey");
        circleRight = g.append("circle")
            .attr("cx", (+rect.attr("x") + +rect.attr("width")))
            .attr("cy", (+rect.attr("y") + (+rect.attr("height") / 2)))
            .attr("r", 5)
            .attr("class", "circleRight")
            .attr("fill", "grey");
        svg.on("mousemove", mousemove);
    }
    function mousemove() {
        var event = d3.mouse(this);
        rect.attr("width", Math.max(0, event[0] - +rect.attr("x")))
            .attr("height", Math.max(0, event[1] - +rect.attr("y")));
        circleTop
            .attr("cx", (+rect.attr("x") + (+rect.attr("width") / 2)))
            .attr("cy", +rect.attr("y"));
        circleBottom
            .attr("cx", (+rect.attr("x") + (+rect.attr("width") / 2)))
            .attr("cy", (+rect.attr("y") + +rect.attr("height")));
        circleLeft
            .attr("cx", +rect.attr("x"))
            .attr("cy", (+rect.attr("y") + (+rect.attr("height") / 2)));
        circleRight
            .attr("cx", (+rect.attr("x") + +rect.attr("width")))
            .attr("cy", (+rect.attr("y") + (+rect.attr("height") / 2)));
    }
    function dragstart() {
        var current = d3.select(this);
        deltaX = current.attr("x") - d3.event.x;
        deltaY = current.attr("y") - d3.event.y;
    }
    function dragmove() {
        d3.select(this)
            .attr("x", d3.event.x + deltaX)
            .attr("y", d3.event.y + deltaY);
        var parent = d3.select(this.parentNode);
        parent.select("circle.circleTop")
            .attr("cx", (d3.event.x + deltaX) + (+d3.select(this).attr("width") / 2))
            .attr("cy", (d3.event.y + deltaY));
        parent.select("circle.circleBottom")
            .attr("cx", (d3.event.x + deltaX) + (+d3.select(this).attr("width") / 2))
            .attr("cy", (d3.event.y + deltaY) + +d3.select(this).attr("height"));
        parent.select("circle.circleLeft")
            .attr("cx", (d3.event.x + deltaX))
            .attr("cy", (d3.event.y + deltaY) + (+d3.select(this).attr("height") / 2));
        parent.select("circle.circleRight")
            .attr("cx", (d3.event.x + deltaX) + +d3.select(this).attr("width"))
            .attr("cy", (d3.event.y + deltaY) + (+d3.select(this).attr("height") / 2));
    }
    function mouseup() {
        svg.on("mousemove", null);
    }
};
