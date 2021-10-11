var App = (() => {
    // API URL 
    const apiURL = 'https://www.reddit.com';
    const url = apiURL + "/r/" + config.param + "/top.json?limit=" + config.showPosts + "&count=" + config.countOfPosts;
    
    // global variables
    let pagginCount = 0;
    let afterPosts = null;
    let beforePosts = null;

    // initialization func.
    // prepr data
    initialization = () => {
        fetchData(url);
    };

    // fetch Data from reddit API by url 
    const fetchData = async (url) => {
        // show site lodder
        toggleLoader(true);

        const response = await fetch(url);
        const json = await response.json();

        // set data for pagginaion result
        afterPosts = json.data.after;
        beforePosts = json.data.before;

        if(json.data.children){
            for (var i = 0; i < json.data.children.length; i++){  
                var obj = json.data.children[i];
                drawPost(obj.data);
            }
        }

        // check if need show prev button of paggination
        pagginPrevStatus();
    };

    // paggination show nex posts
    const pagginationNext = () => {
        if(afterPosts){
            document.getElementById('app').innerHTML = "";
            fetchData(url + "&after=" +afterPosts);
            pagginCount++;
        }  
    }

    // paggination show prev posts
    const pagginationPrev = () => {
        if(beforePosts && pagginCount > 0){
            document.getElementById('app').innerHTML = "";
            fetchData(url + "&before=" +beforePosts);
            pagginCount--;
        }  
    }

    // check if need show prev button
    const pagginPrevStatus = () => {
        if(pagginCount <= 0 || !config.countOfPosts){
            document.getElementById("pagination-prev-action").classList.add("hide");
        }else{
            document.getElementById("pagination-prev-action").classList.remove("hide");
        }
    };

    // drawing posts
    const drawPost = async (data)=> {
        const url = data.url;
        const title = data.title;
        const author = data.author;
        const votes = data.upvote_ratio;
        const datetime = data.created;

        const authorData = await getAuthorData(author);
        const thumbnail = authorData.data.icon_img;

        const div = document.createElement('div');
        div.className = 'card';

        // post template
        div.innerHTML = `
            <a class="title" href="${url}" target="_blank">${title}</a>
            <div class="post-wrap">
                <div class="icon">
                    <img src="${thumbnail}" alt=""/>
                </div>
                <div class="details">
                    <p>Author: ${author}</p>
                    <p>upvote ratio: ${votes}</span>
                    <p>Created date: ${Helper.convertTimeStempToDateTime(datetime)}</span>
                </div>
            <div>
        `;

        document.getElementById('app').appendChild(div);
        toggleLoader(false);
    };

    // get Author data
    const getAuthorData = async (authorName) => {
        const response = await fetch(apiURL+"/user/"+authorName+"/about.json");
        const AuthorData = await response.json();
        return AuthorData;
    };

    // toggle site Loader
    // show loader when fetching Data
    const toggleLoader = (status) => {
        var body = document.body;
        if(config.showLoader && status){
            body.classList.add("load-data");
        }else{
            body.classList.remove("load-data");
        }
    }

    // functions for external use
    return {
      init:initialization,
      next:pagginationNext,
      prev:pagginationPrev
    };

})();
App.init();