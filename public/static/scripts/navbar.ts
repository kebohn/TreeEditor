import * as d3 from "./modules/d3";
import {resetListeners, resetRectBorder} from "./script";

    export function openNav() {
    let current = d3.select(this);
    let parent = d3.select(this.parentNode);
    let id = parent.attr("id");
    resetListeners();
    document.getElementById("mySidebar").style.width = "335px";
    document.getElementById('rectInfo').innerHTML = id;
    let titleText = <HTMLInputElement>document.getElementById("titleText");
    let contentText = <HTMLInputElement>document.getElementById("contentText");
    let colorPicker = <HTMLInputElement>document.getElementById("colorPicker");
    d3.select("#colorPickerBtn").style("background", current.attr("fill"));
    titleText.value = parent.select("text.titleText").text();
    contentText.value = parent.select("text.contentText").text();
    colorPicker.value = current.attr("fill");


    listFiles(id);

    resetRectBorder();
    d3.select(this)
        .style("stroke", "red")
        .on("dblclick", closeNav);

    d3.select(".closebtn").on("click", function () {
        closeNav();
    });
}

function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById('rectInfo').innerHTML = "";
    let titleText = <HTMLInputElement>document.getElementById("titleText");
    let contentText = <HTMLInputElement>document.getElementById("contentText");
    titleText.value = "";
    contentText.value = "";

    resetRectBorder();
    resetListeners();
}

function listFiles(id) {
    let entries = d3.select("#fileList").selectAll("li");
    entries.each(function () {
        let li = d3.select(this);
        if (li.attr("id").slice(0,1) == id) {
            li.style("display",'inherit');
        }
        else {
            li.style("display",'none');
        }
    });
}

export function processLinkItem() {
    let name = <HTMLInputElement> document.getElementById("linkName");
    let value = <HTMLInputElement> document.getElementById("linkVal");
    if (validURL(value.value)) {
        console.log("yep")
    }
    else {
        console.log("no");
    }
}

function validURL(str) {
    let pattern = new RegExp('^(https?:\\/\\/)?'+
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+
        '((\\d{1,3}\\.){3}\\d{1,3}))'+
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+
        '(\\?[;&a-z\\d%_.~+=-]*)?'+
        '(\\#[-a-z\\d_]*)?$','i');
    return !!pattern.test(str);
}

function appendLinkItem() {

}