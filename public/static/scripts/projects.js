window.onload = () => {
    getProjects();
};
function getProjects() {
    let url = '/treeEditor/projects';
    fetch(url, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => listProjects(data));
}
function deleteProject(id) {
    let url = '/treeEditor/projects/delete?id=' + id;
    fetch(url, {
        method: 'POST'
    });
}
function listProjects(data) {
    let ul = document.getElementById("projects");
    for (let project of data) {
        let li = document.createElement("li");
        let span = document.createElement("span");
        span.setAttribute("class", "close");
        span.appendChild(document.createTextNode("x"));
        li.appendChild(document.createTextNode(project["name"]));
        li.setAttribute("id", project["project_id"]);
        li.appendChild(span);
        ul.appendChild(li);
        li.addEventListener("click", function () {
            openProject(project["project_id"], project["name"], project["width"], project["height"]);
        });
        let btnList = document.getElementsByClassName("close");
        for (let i = 0; i < btnList.length; i++) {
            btnList[i].addEventListener("click", function (e) {
                let id = this.parentElement.getAttribute("id");
                deleteProject(id);
                this.parentElement.remove();
                e.stopPropagation();
            });
        }
    }
}
function openProject(id, name, width, height) {
    window.location.href = "/treeEditor/project?id=" + id + "&name=" + name + "&width=" + width + "&height=" + height;
}
