// Write chatr code here!

// === FECTH API ===

//Routes built into Chatr-Express
//GET /messages -> A JSON array of Messages
//POST /messages -> A confirmation (creates a message)
//PATCH /messages/:id -> A confirmation (edit message)
//DELETE /messages/:id -> A confirmation (deletes a message)

//GET request
//Calling "fetch" with URL as its only argument, it will make
//a GET request to that URL.  It is asynchronous and returns a promise

fetch('http://localhost:3434/messages')
//"fetch" returns an object that represents the HTTP response
//use async method .text() or .json() on the response tp
//parse its body.  Make sure to return it from the callback
.then(response => response.json())

//.then(data => console.table(data))
//this is the same as below.  We can pass console.table as a callback
//because how console.table is defined is it will log the argument
//that is passed to it. If the data is specifically an array of objects,
//we can use console.table to output it in a neat format
.then(console.table)

// //list of messages
// const loadMessages = () => {
//     fetch("/messages")
//     .then(res => res.json ())
//     .then(messages => {
//         const messagesContainer = document.querySelector("#messages");
//         let messagesHTML = "";
//         messages.forEach(message => {
//             messagesHTML += `
//             <li>
//                 ${message.body}
//                 <i data-id=${message.id} class="delete-link">x</i>
//             </li>
//             `;
//             messagesContainer.innerHTML = messagesHTML;
//         })
//     })
// }

// //write code to refresh list intermittently
// const refreshIntervalmsg = 3000;
// document.addEventListener("DOMContentLoaded", () => {
//     loadMessages();
//     setInterval(loadMessages, refreshIntervalmsg)
// })

// //POST AJAX req to create message
// //req from Form
// const fd = new FormData();
// fd.set("body", "Hello, World!")
// fetch("/messages",{
//     method: "POST",
//     body: fd
// });

// // fetch("/messages",{
// //     method: "POST",
// //     body: new FormData(document.querySelector("#form"))
// // });

// //Basic POST req with JSON
// const headers = new Headers({
//     Accept: "application/json, text/plain, */*",
//     "Content-Type": "application/json"
// });

// fetch("/messages", {
//     method: "POST",
//     headers: headers,
//     body: JSON.stringify({ body: "Hello, World!"})
// })
    
// All our requests to messages
const Message = {
    index() {
        return fetch('http://localhost:3434/messages')
        .then(response => response.json())
    },
    create(params){
        return fetch('/messages', { //we can omit the domain because '/' is on the same domain as the server
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(params),
            username: JSON.stringify(params)
        })
    },
    delete(id) {
        return fetch(`/messages/${id}`, {
            method: 'DELETE'
        })
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const messagesUL = document.querySelector('#messages')
    const messageForm = document.querySelector('#new-message')

    const refreshMessages = () => {
        Message.index()
        .then(messages => {
            messagesUL.innerHTML = messages.map(message => {
                return `
                    <li>
                    <strong>#${message.id}</strong>
                    ${message.body}</br>Posted by: ${message.username}
                    <button data-id=${message.id} class="delete-button">Delete</button>
                    </li>
                    `;
                
            })
            .join('')
        })
    }
    setInterval(refreshMessages, 3000)

    messageForm.addEventListener('submit', event => {
        event.preventDefault()

        const { currentTarget } = event //the form element

        //Use FormData constructor to create an object representation
        //of the keys and values of the form that we pass as an argument
        //to the constructor

        const formData = new FormData(currentTarget)

        //formData.get returns the value associated with the given key
        //from within the FormData object

        Message.create({ body: formData.get("body"), username: formData.get("username")})
            .then(() => {
                console.log("Message created!")
                refreshMessages()
                currentTarget.reset() //resets (empties) the form inputs
            })
    })

    messagesUL.addEventListener('click', event => {
        const { target } = event //the element that triggered the event

        //Delegate the event to the unordered list <ul> because only the list exists
        //when the DOM first loads.  If the target we clicked matches the selector
        //we'll delete the message
        if (target.matches('.delete-button')) {
            Message.delete(target.dataset.id)
            .then(() => {
                console.log("Message Deleted!")
                refreshMessages()
            })
        }
    })
})
