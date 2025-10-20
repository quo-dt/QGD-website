window.addEventListener('DOMContentLoaded', () => {

    let showHideEl = document.getElementById('hide_show');
    let buttonsEl = document.getElementById('button-row');
    let button1El = document.getElementById('button1');
    let button2El = document.getElementById('button2');
    let button3El = document.getElementById('button3');
    let button4El = document.getElementById('button4');
    let sizeChanges = document.querySelectorAll('.size-change');
    let addedComments = document.getElementById('added-spotlights');
    let localTimeEl = document.getElementById('local-time');
    let formEl = document.getElementById('comment-form-object');

    // Loading comments on startup
    function initialLoadComments() {
        fetch('http://127.0.0.1:8080/comments.txt')
            .then(response => response.json())
            .then(comments => {
                comments.forEach(comment => {
                    let newComment = document.createElement('div');
                    let iconElement = '<div><svg height="3rem" width="3rem"><circle cx="1.5rem" cy="1.5rem" r="1.5rem"></circle></svg></div><div><h5></h5><p></p></div>';
                    newComment.innerHTML = iconElement;

                    newComment.className = 'comment d-flex';
                    newComment.querySelectorAll('div')[0].className = 'comment-icon';
                    newComment.querySelectorAll('div')[1].className = 'comment-comment';
                    newComment.querySelector('h5').className = 'comment-comment-email';
                    newComment.querySelector('p').className = 'comment-comment-comment';

                    // increment the comment id
                    let lastComment = document.querySelector("#comment-thread").lastElementChild;
                    newComment.id = 'comment' + (Number(lastComment.id.substr(1)) + 1);

                    newComment.querySelector("h5").innerHTML = comment.email;
                    newComment.querySelector("p").innerHTML = comment.comment;
                    newComment.querySelector('circle').setAttribute('fill', comment.color);

                    document.querySelector('#comment-thread').appendChild(newComment);
                });
            });
    }


    function show_buttons() {
        if (buttonsEl.style.display === 'block') {
            buttonsEl.style.display = 'none';
            showHideEl.innerHTML = '<a href="#">Show</a>';
        } else {
            buttonsEl.style.display = 'block';
            showHideEl.innerHTML = '<a href="#">Hide</a>';
        }
    }

    function fontSize_up() {
        sizeChanges.forEach(para => {
            let currentSize = parseFloat(window.getComputedStyle(para, null).getPropertyValue('font-size'));
            if (currentSize <= 31) {
                para.style.fontSize = `${currentSize + 1}px`;
            }
        })
    }


    function fontSize_down() {
        sizeChanges.forEach(para => {
            let currentSize = parseFloat(window.getComputedStyle(para, null).getPropertyValue('font-size'));
            if (currentSize >= 9) {
                para.style.fontSize = `${currentSize - 1}px`;
            }
        })
    }


    function spotlight() {
        let spotlight_msg = prompt('Add a spotlight!');
        if (spotlight_msg != null) {
            if (addedComments.textContent.length != 0) {
                    addedComments.innerHTML += '<br>';
            }
            addedComments.innerHTML += spotlight_msg;
            console.log(addedComments.innerHTML);
        }
    }


    function showLocalTime() {
        let now = new Date();
        let day = now.getDate();
        let month = now.getMonth() + 1;
        let year = now.getFullYear();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        let seconds = now.getSeconds();

        let indices = [day, month, hours, minutes, seconds];
        console.log(indices);

        let disp = indices.map(num => {
            if (num < 10) {
                return num = '0' + num;
            }
            else return num;
        })

        localTimeEl.innerHTML += `${year}-${disp[1]}-${disp[0]} ${disp[2]}:${disp[3]}:${disp[4]}`;
    }


    function formSubmission() {
        event.preventDefault();

    // Saving comments
        const formData = new FormData(formEl);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        fetch('http://127.0.0.1:8080/comments.txt')
            .then(response => response.json())
            .then(comments => {
                commentsArray = Array.from(comments);
                commentsArray.push(data);

                return fetch('http://127.0.0.1:8080/comments.txt', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(commentsArray, null, "\t")
                });
            })

    // Loading comments
        let newComment = document.createElement('div');
        let iconElement = '<div><svg height="3rem" width="3rem"><circle cx="1.5rem" cy="1.5rem" r="1.5rem"></circle></svg></div><div><h5></h5><p></p></div>';
        newComment.innerHTML = iconElement;

        newComment.className = 'comment d-flex';
        newComment.querySelectorAll('div')[0].className = 'comment-icon';
        newComment.querySelectorAll('div')[1].className = 'comment-comment';
        newComment.querySelector('h5').className = 'comment-comment-email';
        newComment.querySelector('p').className = 'comment-comment-comment';

        // increment the comment id
        let lastComment = document.querySelector("#comment-thread").lastElementChild;
        newComment.id = 'comment' + (Number(lastComment.id.substr(1)) + 1);

        newComment.querySelector("h5").innerHTML = document.querySelector("#comment-form-email").value;
        newComment.querySelector("p").innerHTML = document.querySelector("#comment-form-comment").value;

        // get the color choice from the radio buttons
        let newCommentColor = document.querySelectorAll('input[name=color]:checked')[0].value;
        newComment.querySelector('circle').setAttribute('fill', newCommentColor);
        document.querySelector('#comment-thread').appendChild(newComment);
        document.querySelector('form').reset();
    }


    showHideEl.addEventListener('click', () => show_buttons());
    button1El.addEventListener('click', () => fontSize_up());
    button2El.addEventListener('click', () => fontSize_down());
    button3El.addEventListener('click', () => spotlight());
    button4El.addEventListener('click', () => showLocalTime());
    formEl.addEventListener('submit', () => formSubmission());

    initialLoadComments();
});