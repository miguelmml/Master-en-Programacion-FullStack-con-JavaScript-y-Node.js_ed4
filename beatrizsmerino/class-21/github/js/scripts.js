/**
 * @file Live Coding: Github. Web application that asks for a github user and returns his profile information including email. If the email does not appear, use the events to display it.
 * @author Beatriz Sopeña Merino <beatrizsmerino@gmail.com>
 * @copyright (2019-2020)
 */

// https://developer.github.com/v3/users/
// https://github.com/octocat
// https://api.github.com/users/%5Bnombre_usuario%5D/events

/**
 * @const urlAPI
 * @description API route 'GitHub'.
 * @type {String}
 * @see Used in: {@link setUserData}, {@link init}
 */
const urlAPI = "https://api.github.com/users/";

/**
 * @const urlEventsAPI
 * @description API route 'GitHub' to the user events.
 * @type {String}
 * @see Used in: {@link setUserData}
 */
const urlEventsAPI = "/events";

/**
 * @var searchDom
 * @description Input field of type text, where get the value to search.
 * @type {HTMLElement}
 * @see Used in: {@link removeData}, {@link keyup}, {@link click}
 */
let searchDom = document.getElementById("search");

/**
 * @var searchButtonDom
 * @description Button search.
 * @type {HTMLElement}
 * @see Used in: {@link init}, {@link click}
 */
let searchButtonDom = document.getElementById("button");

/**
 * @var color
 * @description List of colors.
 * @type {Object}
 * @see Used in: {@link stylesConsoleUser}
 */
let color = {
    color_brand_1: "#eba764",
    color_brand_2: "#514e51",
    color_brand_3: "#e7dfdd",
    color_brand_4: "#f1c28f",
    color_brand_5: "#fd7667",
    color_brand_6: "#c48344"
};

/**
 * @var stylesConsoleUser
 * @description Template literal with the styles of a message console for the user object.
 * @type {String}
 * @see Used inside: {@link color}
 * @see Used in: {@link insertUserData}
 */
let stylesConsoleUser = `
    padding: 0.4rem .8rem;
    color: ${color.color_brand_2};
    background-color: ${color.color_brand_1};
`;

/**
 * @var stylesConsoleFunction
 * @description Template literal with the styles of a message console for function.
 * @type {String} 
 * @see Used inside: {@link color}
 * @see Used in: {@link setUserData}, {@link getUserEmail}
 */
let stylesConsoleFunction = `
    padding: 0.4rem .8rem;
    color: ${color.color_brand_3};
    background-color: ${color.color_brand_2};
`;

/**
 * @var user
 * @description Object json of the user with the properties name, login and email. Empty user to be filled in with the user data found.
 * @type {Object} 
 * @see Used in: {@link setUserData}, {@link getUserEmail}, {@link insertUserData}
 */
let user = {
    name: "",
    login: "",
    email: ""
};








// TOOLS
//////////////////////////////////

/**
 * @function delay
 * @description Executes a function after a given time.
 * @param {Function} fn - function to execute
 * @param {Number} ms - delay time in miliseconds
 * @return {Function}
 * @see Used in: {@link keyup}
 */
function delay(fn, ms) {
    let timer = 0;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(fn.bind(this, ...args), ms || 0);
    };
}

/**
 * @function svgMe
 * @description Converts an `<img>` tag, with a `.svg` extention and a class `svgMe`, into a `<svg>` tag.
 * @return {Object} Return the file svg
 * @see Used in: {@link functionAnonimAutoExecuted}
 */
function svgMe() {
    let images = document.querySelectorAll("img.svgMe");

    // console.info("Array of images -> ", images);

    images.forEach(image => {
        let imgId = image.getAttribute("id");
        let imgClass = image.getAttribute("class");
        let imgUrl = image.getAttribute("src");

        let request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200) {
                // console.info("request in xml -> ", request.responseXML);
                callback(request.responseXML);
            }
        };

        function callback(requestXML) {
            let imgSvg = requestXML.querySelector("svg");

            // console.info("data type of 'data' -> ", typeof requestXML);
            // console.info("'data' -> ", requestXML);
            // console.info("images with svgMe -> ", imgSvg);

            if (typeof imgId !== "undefined") {
                // console.info(imgId);
                imgSvg.setAttribute("id", imgId);
            }

            if (typeof imgClass !== "undefined") {
                // console.info(imgClass);
                imgSvg.setAttribute("class", imgClass);
                imgSvg.classList.add("svgMe--replaced");
            }

            imgSvg.removeAttribute("xmlns:a");
            if (
                !imgSvg.getAttribute("viewBox") &&
                imgSvg.getAttribute("height") &&
                imgSvg.getAttribute("width")
            ) {
                imgSvg.setAttribute(
                    "viewBox",
                    "0 0 " +
                    imgSvg.getAttribute("height") +
                    " " +
                    imgSvg.getAttribute("width")
                );
            }

            image.replaceWith(imgSvg);
        }

        request.open("GET", imgUrl);
        request.send();
    });
}


/**
 * @function objectIsEmpty
 * @description Verify if the object it is empty
 * @param {Object} object
 * @return {Boolean}
 */
function objectIsEmpty(object) {
    for (var property in object) {
        if (object.hasOwnProperty(property)) {
            return false;
        }
    }

    return JSON.stringify(object) === JSON.stringify({});
}





// AJAX HANDLER - FETCH
//////////////////////////////////

/**
 * @function ajaxHandler
 * @description API request.
 * @param {String} url - root of the API
 * @param {String} action - name of the action to excute
 * @return {Object}
 * @see Used inside: {@link addLoader}, {@link removeLoader}, {@link setAction}, {@link error404}
 * @see Used in: {@link setUserData}, {@link init}
 */
function ajaxHandler(url, action) {
    // console.info(url);

    addLoader();

    fetch(url)
        .then(function (response) {
            if (response.status == 200) {
                response.json().then(function (data) {
                    let timer = setInterval(function () {
                        removeLoader();
                        setAction(action, data);
                        clearInterval(timer);
                        return data;
                    }, 3000);
                });
            } else if (response.status == 404) {
                console.warn(response.status);
                let timer = setInterval(function () {
                    removeLoader();
                    error404();
                    clearInterval(timer);
                    return response.status;
                }, 1000);
            }
        })
        .catch(function (error) {
            console.warn(error);
        });
}





// LOADER
//////////////////////////////////

/**
 * @function addLoader
 * @description Add loading animation.
 * @see Used in: {@link ajaxHandler}
 */
function addLoader() {
    let loader = document.getElementById("loader");
    if (!loader) {
        let loader = document.createElement("div");
        loader.setAttribute("id", "loader");
        loader.setAttribute("class", "loader");
        loader.style.backgroundImage = "url('images/loader.gif')";
        document.body.appendChild(loader);
    }
}

/**
 * @function removeLoader
 * @description Remove loading animation.
 * @see Used in: {@link ajaxHandler}
 */
function removeLoader() {
    let loader = document.getElementById("loader");
    if (loader) {
        document.body.removeChild(loader);
    }
}





// INSERT DATA
//////////////////////////////////

/**
 * @function setAction
 * @description List of functions to choose from.
 * @param {String} action - name of the action to excute
 * @param {Object} responseData - response data of the ajax handler (json)
 * @see Used inside: {@link setUserData}, {@link getUserEmail}
 * @see Used in: {@link ajaxHandler}
 */
function setAction(action, responseData) {
    switch (action) {
        case "setUserData":
            setUserData(responseData);
            break;
        case "getUserEmail":
            getUserEmail(responseData);
            break;
        default:
            break;
    }
}



/**
 * @function templatePopup
 * @description Create popup html template empty with a button for close it.
 * @see Used inside: {@link removeData}
 */
function templatePopup() {
    let popup = document.createElement("div");
    popup.setAttribute("id", "popup");
    popup.setAttribute("class", "popup");

    let template = `
            <div class="popup__inner">
                <div id="popupClose" class="popup__close"></div>
                    <div class="popup__content"></div>
                </div>
            </div>
	        `;

    popup.innerHTML = template;
    document.body.appendChild(popup);

    document.getElementById("popupClose").addEventListener("click", function () {
        removeData();
    });
}



/**
 * @function setUserData
 * @description Search for name and email by entering your username of login.
 * If the user exit search his name and email, and insert info.
 * @param {Object} responseData - response data of the ajax handler (json)
 * @see Used inside: {@link user}, {@link templatePopup}, {@link insertUserData}
 * @see Used in: {@link setAction}
 */
function setUserData(responseData) {
    console.group("%csetUserData: ", stylesConsoleFunction);
    console.table(responseData);
    console.groupEnd();

    if (!document.getElementById("popup")) {
        templatePopup();
    }

    if (responseData) {
        let userDataDom = document.getElementById("userData");
        if (!userDataDom) {
            let userData = document.createElement("div");
            userData.classList.add("user-data");
            userData.setAttribute("id", "userData");
            document.getElementsByClassName("popup__content")[0].appendChild(userData);
        }

        // If the user exists
        let userLogin = "";
        if (
            responseData.login === null ||
            responseData.login === "" ||
            responseData.login === "undefined"
        ) {
            userLogin = "User not found";
        } else {
            userLogin = responseData.login;
        }
        user.login = userLogin;

        // If the user exists we search for his name and his email
        if (userLogin !== "") {
            // If the username exists we search for your name
            let userName = "";
            if (
                responseData.name === null ||
                responseData.name === "" ||
                responseData.name === "undefined"
            ) {
                userName = "Name not found";
            } else {
                userName = responseData.name;
            }
            user.name = userName;

            // If the username exists we search for your email
            let userEmail = "";
            if (
                responseData.email === null ||
                responseData.email === "" ||
                responseData.email === "undefined"
            ) {
                // If you can't find it, search deeper into user events.
                userEmail = "Email not found";
                ajaxHandler(urlAPI + user.login + urlEventsAPI, "getUserEmail");
            } else {
                userEmail = responseData.email;
            }
            user.email = userEmail;
        }

        insertUserData();
    }
}

/**
 * @function removeData
 * @description Remove the pop-up window, empty the search field and the user object.
 * @see Used inside: {@link user}
 * @see Used in: {@link templatePopup}
 */
function removeData() {
    let popup = document.getElementById("popup");
    if (popup) {
        document.body.removeChild(popup);
    }
    searchDom.value = "";

    for (const key in user) {
        user[key] = "";
    }
}

/**
 * @function getUserEmail
 * @description If the email is not found with the function 'setUserData', search it within user events, his 'commits' that will have the email asociated.
 * If the email has the string 'noreply' it is not valid and find another.
 * @param {Object} responseData - response data of the ajax handler (json)
 * @see Used inside: {@link user}, {@link insertUserData}
 * @see Used in: {@link setAction}
 */
function getUserEmail(responseData) {
    console.group("%cgetUserEmail: ", stylesConsoleFunction);
    console.table(responseData);
    console.groupEnd();

    console.assert(responseData.length !== 0, "This user hasn`t events");
    // console.table(objectIsEmpty(responseData));

    for (let i = 0; i < responseData.length; i++) {
        let element = responseData[i];
        // let userEmail = element.payload.commits[0].author.email;

        // console.log(user.email);
        if (user.email === "Email not found") {
            if (element.hasOwnProperty("payload")) {
                let payload = element.payload;
                if (payload.hasOwnProperty("commits")) {
                    for (let j = 0; j < element.payload.commits.length; j++) {
                        let commit = element.payload.commits[j];
                        if (commit.hasOwnProperty("author")) {
                            let author = commit.author;

                            if (author.hasOwnProperty("name")) {
                                let userName = "";
                                if (user.name === "Name not found") {
                                    if (
                                        author !== null ||
                                        author !== "" ||
                                        author !== "undefined"
                                    ) {
                                        userName = author.name;
                                    }
                                } else {
                                    userName = user.name;
                                }

                                if (author.hasOwnProperty("email")) {
                                    let userEmail = "";

                                    if (user.email === "Email not found") {
                                        if (userName == user.name || userName == user.login) {
                                            userEmail = author.email;

                                            // console.log(userEmail.search("noreply"));
                                            if (userEmail.search("noreply") == -1) {
                                                user.email = userEmail;
                                                break;
                                            } else {
                                                continue;
                                            }
                                        } else {
                                            continue;
                                        }
                                    }
                                } else {
                                    continue;
                                }
                            } else {
                                continue;
                            }
                        } else {
                            continue;
                        }
                    }
                } else {
                    continue;
                }
            } else {
                continue;
            }
        } else {
            break;
        }
    }

    insertUserData();
}

/**
 * @function insertUserData
 * @description If exist the user create and insert a template with the user info, that its save it in the object user, if not otherwise it shows a 404 error image.
 * If exist the user but not found the email after searching in the user events with the second function 'getUserEmail', shows the message 'Email not found'.
 * @see Used inside: {@link stylesConsoleUser}, {@link user}, {@link error404}
 * @see Used in: {@link setUserData}, {@link getUserEmail}
 */
function insertUserData() {
    console.group("%cUser:", stylesConsoleUser);
    console.info(user);
    console.groupEnd();

    let templateUserEmail = "";
    if (user.email !== "Email not found") {
        templateUserEmail = `<a href="mailto:${user.email}">
								${user.email}
							</a>`;
    } else {
        templateUserEmail = user.email;
    }

    let templateUser = `
					<div class="user-data__inner">
						<p class="user-data__login">
							<a href="http://github.com/${user.login}" target="_blank">
								${user.login}
							</a>
						</p>
						<p class="user-data__name">
							${user.name}
						</p>
						<p class="user-data__email">
							${templateUserEmail}
						</p>
					</div>
				`;

    let userData = document.getElementById("userData");
    userData.innerHTML = templateUser;

    if (user.login === "undefined" || user.login === "User not found") {
        error404();
    }
}



/**
 * @function error404
 * @description Add a pop-up window and give it a css class, which applies a background image with 404 error.
 * @see Used inside: {@link templatePopup}
 * @see Used in: {@link insertUserData}
 */
function error404() {
    templatePopup();
    document.getElementById("popup").classList.add("is-error404");
}



/**
 * @function init
 * @description Add a class css while searching and set ajax handler
 * @param {String} searchValue
 * @see Used inside: {@link ajaxHandler}
 */
function init(searchValue) {
    if (searchValue !== "") {
        searchButtonDom.classList.add("is-searching");
        ajaxHandler(urlAPI + searchValue, "setUserData");
    }
}





// EVENTS
//////////////////////////////////

/**
 * @event keyup
 * @description When write in the input field search, after a few seconds, get his value and find the user
 * @see Used inside: {@link delay}, {@link init}
 */
searchDom.addEventListener(
    "keyup",
    delay(function () {
        init(this.value);
    }, 2000)
);



/**
 * @event keypress
 * @description When press the key 'enter' get his value and find the user
 * @see Used inside: {@link delay}, {@link init}
 */
searchDom.addEventListener(
    "keypress",
    function (e) {
        var keycode = (e.keyCode ? e.keyCode : e.which);
        if (keycode == '13') {
            e.preventDefault();
            init(searchDom.value);
            return false;
        }
    }
);



/**
 * @event click
 * @description If click the button search, get his value and find the user
 * @see Used inside: {@link init}
 */
searchButtonDom.addEventListener("click", function (e) {
    e.preventDefault();
    init(searchDom.value);
});





/**
 * @function functionAnonimAutoExecuted
 * @description Anonymous auto executed function
 * @see Used inside: {@link svgMe}
 */
(function () {
    svgMe();
})();
