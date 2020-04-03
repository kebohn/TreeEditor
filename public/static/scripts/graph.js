"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = __importStar(require("./modules/d3.js"));
const navbar_1 = require("./navbar");
const grid_1 = require("./grid");
const concreteRectCreator_1 = require("./node/concreteRectCreator");
let svg, nodes, g, rect, dragRect, dragBorder, dragLine, line, deltaX, deltaY, deltaXBorder, deltaYBorder, deltaXLine, deltaYLine, deltaXCircle, deltaYCircle, rectWidth, rectHeight, lineData, lineFunction, nodeDrawn = false;
function initializeGraph(margin) {
    let graph = document.getElementById('GraphContainer'), boundaries = graph.getBoundingClientRect(), width = boundaries.width - margin.left - margin.right, height = boundaries.height - margin.top - margin.bottom;
    svg = d3.select("#graph")
        .attr("width", width)
        .attr("height", height)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .on("mousedown", mousedown)
        .on("mouseup", mouseUp)
        .on("mouseleave", mouseUp);
    nodes = svg.append("g").attr("id", "nodes");
    dragRect = d3.drag()
        .on("start", dragStart)
        .on("drag", dragMove);
    dragBorder = d3.drag()
        .on("start", dragStartBorder)
        .on("drag", dragMoveBorder);
    lineFunction = d3.line()
        .x(function (d) {
        return d.x;
    })
        .y(function (d) {
        return d.y;
    })
        .curve(d3.curveCardinal);
    dragLine = d3.drag()
        .on("start", dragStartLine)
        .on("drag", dragMoveLine);
}
exports.initializeGraph = initializeGraph;
function mousedown() {
    if (d3.event.button != 2) {
        let event = d3.mouse(this);
        const rectNode = new concreteRectCreator_1.ConcreteRectCreator().createNode();
        rectNode.draw(event);
        rect = rectNode.getNodeObject();
        nodeDrawn = true;
        svg.on("mousemove", mouseMove);
    }
}
function initializeRectListeners() {
    let rect = d3.selectAll("rect");
    rect.on("mouseover", function () {
        d3.select(this)
            .style("cursor", "grabbing");
    })
        .on("mouseout", function () {
        d3.select(this)
            .style("cursor", "default");
    })
        .on("dblclick", navbar_1.openNav)
        .call(dragRect);
    d3.selectAll(".foreign").select("rect")
        .on("dblclick", null);
}
exports.initializeRectListeners = initializeRectListeners;
function initializeCircleListeners() {
    let count = null;
    svg.selectAll("rect").each(function () {
        count = +d3.select(this.parentNode).attr("id");
        d3.selectAll(".lineCircle")
            .on("mouseover", function () {
            d3.select(this)
                .style("cursor", "grabbing");
        })
            .on("mouseout", function () {
            d3.select(this)
                .style("cursor", "default");
        })
            .call(dragLine);
        d3.select(`#circleBottomRight${count}`)
            .on("mouseover", function () {
            d3.select(this)
                .style("cursor", "se-resize");
        })
            .on("mouseout", function () {
            d3.select(this)
                .style("cursor", "default");
        })
            .call(dragBorder);
        d3.selectAll(`#circleRight${count}, #circleLeft${count}, #circleTop${count}, #circleBottom${count}`)
            .on('mouseover', function () {
            d3.select(this)
                .attr("r", 10)
                .style("cursor", "crosshair");
        })
            .on('mouseout', function () {
            d3.select(this)
                .attr("r", 5)
                .style("cursor", "default");
        })
            .on("click", drawLine);
    });
}
exports.initializeCircleListeners = initializeCircleListeners;
function mouseMove() {
    let rectCounter = 1;
    svg.selectAll("rect").each(function () {
        let id = +d3.select(this.parentNode).attr("id");
        if (id >= rectCounter) {
            rectCounter = id;
        }
    });
    let event = d3.mouse(this), newXCoordinate = Math.max(0, event[0] - +rect.attr("x")), newYCoordinate = Math.max(0, event[1] - +rect.attr("y"));
    updateRectSize(newXCoordinate, newYCoordinate, rectCounter, null, rect, true);
}
function dragStart() {
    let current = d3.select(this);
    let tagName = current.node().tagName;
    if (tagName === "rect") {
        deltaX = current.attr("x") - d3.event.x;
        deltaY = current.attr("y") - d3.event.y;
    }
}
function dragMove() {
    let current = d3.select(this);
    let parent = d3.select(this.parentNode);
    let counter = parent.attr("id");
    let tagName = current.node().tagName;
    if (tagName === "rect") {
        let newXCoordinate = d3.event.x + deltaX;
        let newYCoordinate = d3.event.y + deltaY;
        updateRectSize(newXCoordinate, newYCoordinate, counter, parent, current, false);
    }
}
function dragStartBorder() {
    let parent = d3.select(this.parentNode);
    let current = parent.select("rect");
    let tagName = current.node().tagName;
    if (tagName === "rect") {
        deltaXBorder = d3.event.x;
        deltaYBorder = d3.event.y;
        deltaX = current.attr("x") - d3.event.x;
        deltaY = current.attr("y") - d3.event.y;
        rectWidth = +current.attr("width");
        rectHeight = +current.attr("height");
    }
}
function dragMoveBorder() {
    let parent = d3.select(this.parentNode);
    let counter = parent.attr("id");
    let current = parent.select("rect");
    let tagName = current.node().tagName;
    let newRectWidth = rectWidth + (d3.event.x - deltaXBorder);
    let newRectHeight = rectHeight + (d3.event.y - deltaYBorder);
    if (tagName === "rect" && newRectWidth > 0 && newRectHeight > 0) {
        updateRectSize(newRectWidth, newRectHeight, counter, parent, current, true);
    }
}
function dragStartLine() {
    let current = d3.select(this);
    deltaXCircle = current.attr("cx") - d3.event.x;
    deltaYCircle = current.attr("cy") - d3.event.y;
    let parent = d3.select(this.parentNode);
    let classes = current.attr("class").split(" ");
    let path = parent.select("path." + classes[0] + "." + classes[1]);
    let length = path.node().getTotalLength();
    let middle = path.node().getPointAtLength(length / 2);
    middle = { "x": middle.x, "y": middle.y };
    deltaXLine = middle.x - d3.event.x;
    deltaYLine = middle.y - d3.event.y;
}
function dragMoveLine() {
    let current = d3.select(this);
    current.attr("cx", d3.event.x + deltaXCircle);
    current.attr("cy", d3.event.y + deltaYCircle);
    let parent = d3.select(this.parentNode);
    let classes = current.attr("class").split(" ");
    let path = parent.select("path." + classes[0] + "." + classes[1]);
    let length = path.node().getTotalLength();
    let start = path.node().getPointAtLength(0);
    start = { "x": start.x, "y": start.y };
    let end = path.node().getPointAtLength(length);
    end = { "x": end.x, "y": end.y };
    let middle = { "x": d3.event.x + deltaXCircle, "y": d3.event.y + deltaYCircle };
    let data = [start, middle, end];
    path.attr("d", lineFunction(data));
}
function updateRectSize(newXCoordinate, newYCoordinate, counter, parent, current, borderMove) {
    grid_1.alignRectWithGrid(current, newXCoordinate, newYCoordinate, borderMove);
    d3.select("#circleTop" + counter)
        .attr("cx", (+current.attr("x")) + (+current.attr("width") / 2))
        .attr("cy", +current.attr("y"));
    d3.select("#circleBottom" + counter)
        .attr("cx", (+current.attr("x")) + (+current.attr("width") / 2))
        .attr("cy", (+current.attr("y")) + +current.attr("height"));
    d3.select("#circleBottomRight" + counter)
        .attr("cx", (+current.attr("x")) + (+current.attr("width")) - 2)
        .attr("cy", (+current.attr("y")) + +current.attr("height") - 2);
    d3.select("#circleLeft" + counter)
        .attr("cx", (+current.attr("x")))
        .attr("cy", (+current.attr("y")) + (+current.attr("height") / 2));
    d3.select("#circleRight" + counter)
        .attr("cx", (+current.attr("x")) + +current.attr("width"))
        .attr("cy", (+current.attr("y")) + (+current.attr("height") / 2));
    d3.selectAll("path.circleTop" + counter).each(function () {
        updateLinePath(d3.select(this), current, +current.attr("x") + +current.attr("width") / 2, +current.attr("y"), false);
    });
    d3.selectAll("path.circleBottom" + counter).each(function () {
        updateLinePath(d3.select(this), current, +current.attr("x") + +current.attr("width") / 2, +current.attr("y") + +current.attr("height"), false);
    });
    d3.selectAll("path.circleLeft" + counter).each(function () {
        updateLinePath(d3.select(this), current, +current.attr("x"), +current.attr("y") + +current.attr("height") / 2, false);
    });
    d3.selectAll("path.circleRight" + counter).each(function () {
        updateLinePath(d3.select(this), current, +current.attr("x") + +current.attr("width"), +current.attr("y") + +current.attr("height") / 2, false);
    });
    d3.selectAll("path.circleTop" + counter + "Connector").each(function () {
        updateLinePath(d3.select(this), current, +current.attr("x") + +current.attr("width") / 2, +current.attr("y"), true);
    });
    d3.selectAll("path.circleBottom" + counter + "Connector").each(function () {
        updateLinePath(d3.select(this), current, +current.attr("x") + +current.attr("width") / 2, +current.attr("y") + +current.attr("height"), true);
    });
    d3.selectAll("path.circleLeft" + counter + "Connector").each(function () {
        updateLinePath(d3.select(this), current, +current.attr("x"), +current.attr("y") + +current.attr("height") / 2, true);
    });
    d3.selectAll("path.circleRight" + counter + "Connector").each(function () {
        updateLinePath(d3.select(this), current, +current.attr("x") + +current.attr("width"), +current.attr("y") + +current.attr("height") / 2, true);
    });
    if (parent != null) {
        parent.select("text.titleText")
            .attr("x", +current.attr("x") + 10)
            .attr("y", +current.attr("y") + 20);
        parent.select("text.contentText")
            .attr("x", +current.attr("x") + 10)
            .attr("y", +current.attr("y") + 40);
        parent.select("text.descriptionText")
            .attr("x", +current.attr("x"))
            .attr("y", +current.attr("y") + 9);
        updateUploadIconPosition(parent, current);
    }
}
exports.updateRectSize = updateRectSize;
function updateUploadIconPosition(parent, current) {
    parent.select(".foreignAppendix")
        .attr("x", +current.attr("x"))
        .attr("y", +current.attr("y") - 21);
}
exports.updateUploadIconPosition = updateUploadIconPosition;
function updateLinePath(element, current, x, y, isConnector) {
    let length = element.node().getTotalLength();
    let start = null;
    let end = null;
    if (isConnector) {
        start = element.node().getPointAtLength(0);
        start = { "x": start.x, "y": start.y };
        end = { "x": x, "y": y };
    }
    else {
        start = { "x": x, "y": y };
        end = element.node().getPointAtLength(length);
        end = { "x": end.x, "y": end.y };
    }
    let middle = element.node().getPointAtLength(length / 2);
    middle = { "x": middle.x, "y": middle.y };
    let data = [start, middle, end];
    element.attr("d", lineFunction(data));
    let parent = d3.select(element.node().parentNode);
    let classes = element.attr("class").split(" ");
    parent.select("circle." + classes[0] + "." + classes[1])
        .attr("cx", middle.x)
        .attr("cy", middle.y);
}
function mouseUp() {
    if (d3.event.button != 2 && rect != null) {
        svg.on("mousemove", null);
        let parent = rect.select(function () {
            return this.parentNode;
        });
        let width = +rect.attr("width");
        let height = +rect.attr("height");
        let surface = width * height;
        if (surface < 2000) {
            parent.remove();
        }
        else if (nodeDrawn) {
            d3.select("#nodes>g:last-child").append("circle")
                .attr("cx", (+rect.attr("x") + +rect.attr("width")))
                .attr("cy", (+rect.attr("y") + (+rect.attr("height"))))
                .attr("r", 4)
                .attr("id", "circleBottomRight" + parent.attr("id"))
                .attr("class", "circle");
            initializeCircleListeners();
            nodeDrawn = false;
        }
    }
}
function drawLine() {
    let current = d3.select(this);
    let parent = d3.select(this.parentNode);
    let cx = current.attr("cx");
    let cy = current.attr("cy");
    lineData = [{ "x": cx, "y": cy }];
    line = parent.append("path");
    line
        .attr("d", lineFunction(lineData))
        .attr("stroke", "#b3b2b4")
        .attr("stroke-width", 2)
        .attr("class", current.attr("id"))
        .attr("marker-end", "url(#arrow)")
        .attr("fill", "none");
    svg.on("mousemove", moveLine);
    parent.lower();
}
function removeLine() {
    line.remove();
    resetListeners();
}
function resetListeners() {
    let count = null;
    svg
        .on("mousemove", null)
        .on("mousedown", mousedown)
        .on("mouseup", mouseUp)
        .on("mouseleave", mouseUp)
        .on("dblclick", null);
    d3.selectAll("circle")
        .on("click", drawLine);
    svg.selectAll("rect")
        .on("dblclick", navbar_1.openNav)
        .each(function () {
        count = d3.select(this.parentNode).attr("id");
        d3.select(`#circleBottomRight${count}`)
            .on("click", null);
    });
    d3.selectAll(".foreign").select("rect")
        .on("dblclick", null);
}
exports.resetListeners = resetListeners;
function moveLine() {
    let event = d3.mouse(this);
    let newLineData = [lineData[0]];
    newLineData.push({ "x": event[0], "y": event[1] });
    lineData = newLineData;
    line.attr("d", lineFunction(lineData));
    svg
        .on("mousedown", null)
        .on("mouseup", null)
        .on("mouseleave", null)
        .on("dblclick", removeLine);
    d3.selectAll("circle")
        .raise()
        .on("click", combineRect);
}
function combineRect() {
    let current = d3.select(this);
    let parent = d3.select(this.parentNode);
    let x = lineData[0]["x"];
    let y = lineData[0]["y"];
    let sameRect = false;
    parent.selectAll("circle").each(function () {
        let cx = d3.select(this).attr("cx");
        let cy = d3.select(this).attr("cy");
        if (x == cx && y == cy) {
            sameRect = true;
        }
    });
    let id = d3.select(this).attr("id");
    id = id.slice(0, -1);
    if (!sameRect && id != "circleBottomRight") {
        lineData[1] = { "x": +current.attr("cx"), "y": current.attr("cy") };
        line
            .attr("d", lineFunction(lineData))
            .attr("class", line.attr("class") + " " + current.attr("id") + "Connector");
        resetListeners();
        let midpointX = (+lineData[0]["x"] + +lineData[1]["x"]) / 2;
        let midpointY = (+lineData[0]["y"] + +lineData[1]["y"]) / 2;
        let lineParent = d3.select(line.node().parentNode);
        lineParent.append("circle")
            .attr("cx", midpointX)
            .attr("cy", midpointY)
            .attr("r", 5)
            .attr("fill", "rgba(179,178,180,0.39)")
            .attr("class", line.attr("class") + " " + "lineCircle")
            .on("mouseover", function () {
            d3.select(this)
                .style("cursor", "grabbing");
        })
            .on("mouseout", function () {
            d3.select(this)
                .style("cursor", "default");
        })
            .call(dragLine);
    }
}
function updateRectText(object) {
    let id = document.getElementById('rectInfo').innerHTML;
    svg.selectAll("g").each(function () {
        let element = d3.select(this);
        if (element.attr("id") == id) {
            element.select("text." + object.id).html(object.value);
        }
    });
}
exports.updateRectText = updateRectText;
function updateRectColor(object) {
    d3.select("#colorPickerBtn").style("background", object.value);
    let id = document.getElementById('rectInfo').innerHTML;
    svg.selectAll("g").each(function () {
        let element = d3.select(this);
        if (element.attr("id") == id) {
            element.select("rect").attr("fill", object.value);
        }
    });
}
exports.updateRectColor = updateRectColor;
function resetRectBorder() {
    svg.selectAll("rect")
        .style("stroke", "#b3b2b4");
}
exports.resetRectBorder = resetRectBorder;
