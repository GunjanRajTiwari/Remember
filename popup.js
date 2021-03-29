const list = document.getElementById("list");
const saveBtn = document.getElementById("save");

const display = () => {
    var urls = JSON.parse(localStorage.getItem("urls"));
    if (!urls) {
        list.innerHTML += `<p>You have no urls to show ...</p>`;
    } else {
        list.innerHTML = "";
        urls.forEach((url) => {
            var div = document.createElement("div");
            div.classList.add("url");
            div.innerHTML = `
            <p>${url.title}</p>
            <a href="${url.link}" target="_blank">Open</a>
            `;
            list.appendChild(div);
        });
    }
};

window.onload = display();

saveBtn.addEventListener("click", () => {
    var data = {};
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        var tab = tabs[0];
        data = {
            title: tab.title.length < 42 ? tab.title : tab.title.substring(0, 40) + "...",
            link: tab.url,
        };

        var oldList = JSON.parse(localStorage.getItem("urls"));
        if (oldList == null) {
            oldList = [];
        }

        var duplicate = oldList.find((obj) => {
            return obj.link == data.link;
        });

        if (duplicate) {
            return;
        }
        var newList = oldList;
        newList.push(data);

        localStorage.setItem("urls", JSON.stringify(newList));
        display();
    });
});
