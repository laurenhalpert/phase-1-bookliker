document.addEventListener("DOMContentLoaded", function() {
    function getBooks() {
        fetch("http://localhost:3000/books")
        .then(resp => resp.json())
        .then(data => data.forEach((elem)=>{
            renderBook(elem)
        }))
    }
    getBooks();

    function renderBook(book) {
        let ul = document.querySelector("#list");
        let li = document.createElement("li");

        li.className = "book";
        li.innerText = book.title;
        li.addEventListener("click", ()=> handleClick(book))



        ul.appendChild(li);
    }

    function handleClick(book){
        let detailSection = document.querySelector("#show-panel");
        let details = document.createElement("div");

        details.className ="details";
        details.innerHTML= `
        <img src="${book.img_url}">
        <h3>${book.title}</h3>
        <h4>${hasSubtitle(book)}</h4>
        <h3>${book.author}</h3>
        <p>
            ${book.description}
        </p>
        <ul id = "likers-list">Users Who Liked This Book:</ul>
        <button id = "like-button">LIKE</button>
        `
        function hasSubtitle(book) {
            let sub = book.subtitle;
            if (sub !== undefined) {
                return book.subtitle;
            } else {
                return "";
            }
        }

        function listLikers(book){
            book.users.forEach(elem =>{
                let liker = document.createElement("li");
                liker.className ="liker";
                liker.innerText = elem.username;
                details.querySelector("#likers-list").appendChild(liker);
            })
        }
        listLikers(book);
        

        details.querySelector("#like-button").addEventListener("click", ()=>updateLikers(book))
        detailSection.innerHTML="";
        detailSection.appendChild(details);

        function updateLikers(book) {
            let likersOnList = details.querySelectorAll(".liker");
            console.log(likersOnList);
            let likingUser = {id: 1, username: "pouros"};
            console.log(book.users);
            book.users.push(likingUser);
            const filteredArr = book.users.filter(elem => {
                return elem.username !== likingUser.username
            })
            console.log(filteredArr);
            let userObj = {
                users: book.users
            }
            let deleteUserObj = {
                users: filteredArr
            }
            let hasLikingUser = true;
            likersOnList.forEach(elem =>{
                
                
                if (elem.innerText === likingUser.username) {
                    hasLikingUser= true;
                    details.querySelector("#likers-list").removeChild(elem);
                    
                    deleteLiker(book);
                    
                } else if (elem.innerText !== likingUser.username){
                    hasLikingUser = false;
                    
                }
                
            })
            console.log(hasLikingUser);
            if (hasLikingUser === false) {
                patchLikes(book);
                    
                document.querySelector("#show-panel").innerHTML = "";
                handleClick(book);
            }
            function deleteLiker(book) {
                fetch(`http://localhost:3000/books/${book.id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(deleteUserObj)
                })
                .then(resp=> resp.json())
                .then(data => console.log(data))
            }
            
            function patchLikes(book){
                fetch(`http://localhost:3000/books/${book.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(userObj)
                })
                .then (resp => resp.json())
                .then (data => book.users = data.users)
            }
            
            
        }
        
        
    }

    






    

});

