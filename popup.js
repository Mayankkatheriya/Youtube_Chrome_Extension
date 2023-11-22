import { getActiveTabURL } from "./utlis.js";

//TODO append BookMark to the extension

const addNewBookmark = (bookmarks, bookmark) => {

  //TODO create a new bookMark
  const newBookmarkElement = document.createElement("div");
  newBookmarkElement.id = "bookmark-" + bookmark.time;
  newBookmarkElement.className = "bookmark";
  newBookmarkElement.setAttribute("timestamp", bookmark.time);

  //TODO add title to the bookmark
  const bookmarkTitleElement = document.createElement("div");
  bookmarkTitleElement.innerHTML = bookmark.desc;
  bookmarkTitleElement.className = "bookmark-title";
  newBookmarkElement.appendChild(bookmarkTitleElement);

  //TODO add keypoint of bookmark
  const bookmarkdels = document.createElement("div")
  bookmarkdels.textContent = bookmark.dels;
  bookmarkdels.className = "bookmark-dels";
  newBookmarkElement.appendChild(bookmarkdels);
  
  //TODO add controls of bookmark
  const controlsElement = document.createElement("div");
  controlsElement.className = "bookmark-controls";
  setBookmarkAttributes("play", onPlay, controlsElement);
  setBookmarkAttributes("delete", onDelete, controlsElement);
  newBookmarkElement.appendChild(controlsElement);

  bookmarks.appendChild(newBookmarkElement);
};

//TODO set attribute fuction for setting attributes to each control item

const setBookmarkAttributes = (src, eventListener, controlParentElement) => {
  const controlElement = document.createElement("img");

  controlElement.src = "./Assets/" + src + ".png";
  controlElement.title = src;
  controlElement.classList.add(src)
  controlElement.addEventListener("click", eventListener);
  controlParentElement.appendChild(controlElement);
};

//TODO show all the bookmarks which are store in chrome storage(if available) for a prticular video
const viewBookmarks = (currentBookmarks = []) => {
  const bookmarksElement = document.getElementById("bookmarks");
  bookmarksElement.innerHTML = "";

  if (currentBookmarks.length > 0) {
    for (let i = 0; i < currentBookmarks.length; i++) {
      const bookmark = currentBookmarks[i];
      addNewBookmark(bookmarksElement, bookmark);
    }
  } else {
    bookmarksElement.innerHTML =
    `<i class="row">No bookmarks to show</i>
    <img class="bhaiMeme" src="./Assets/bhai-kya-kar-raha-hai-tu-ashneer-grover.gif" alt="">`;
  }

  return;
};

//TODO click event for play button
const onPlay = async (e) => {
  const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
  const activeTab = await getActiveTabURL();

  chrome.tabs.sendMessage(activeTab.id, {
    type: "PLAY",
    value: bookmarkTime,
  });
};

//TODO click event for delete button
const onDelete = async (e) => {
  const activeTab = await getActiveTabURL();
  const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
  const bookmarkElementToDelete = document.getElementById(
    "bookmark-" + bookmarkTime
  );

  bookmarkElementToDelete.parentNode.removeChild(bookmarkElementToDelete);

  chrome.tabs.sendMessage(
    activeTab.id,
    {
      type: "DELETE",
      value: bookmarkTime,
    },
    viewBookmarks
  );
};


//*Start
//TODO load content according to the situtation
document.addEventListener("DOMContentLoaded", async () => {
  const activeTab = await getActiveTabURL();
  const queryParameters = activeTab.url.split("?")[1];
  const urlParameters = new URLSearchParams(queryParameters);

  const currentVideo = urlParameters.get("v");

  if (activeTab.url.includes("youtube.com/watch") && currentVideo) {
    chrome.storage.sync.get([currentVideo], (data) => {
      const currentVideoBookmarks = data[currentVideo]
        ? JSON.parse(data[currentVideo])
        : [];

      viewBookmarks(currentVideoBookmarks);
    });
  }
  else {
    const container = document.getElementsByClassName("container")[0];

    container.innerHTML = `
    <div class="title">This is not a youtube video page.
    <img src="./Assets/welcome-bhaisahab-ye-kis-line-me-aa-gaye-aap.gif" alt="" class="memegif"></div>
    `
  }
});