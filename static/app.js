class Chatbox{
    constructor(){
    this.args = {
        openButton : document.querySelector('.chatbox__button'),//reference to the base html div
        chatBox : document.querySelector('.chatbox__support'),//reference to the base html div
        sendButton : document.querySelector('.send__button') //reference to base html div

    }
    this.state = false;
    this.messages = [];
    }

// display message
    display() {
    const {openButton,chatBox,sendButton} = this.args;

    openButton.addEventListener ('click',() => this.toggleState(chatBox))

    sendButton.addEventListener('click', ()=> this.onSendButton(chatBox))

    const node = chatBox.querySelector('input');
    node.addEventListener("keyup",({key}) => {
        if (key === "Enter"){
            this.onSendButton(chatBox)
        }
    })
}
    toggleState(chatbox){
    this.state = !this.state;

    //whether to hide or show the box
    if(this.state) {
        chatbox.classList.add('chatbox--active') //opacity in CSS
    }else {
        chatbox.classList.remove('chatbox--active') //opacity in CSS
    }
}

    onSendButton(chatbox){
        var textField = chatbox.querySelector('input');
        let text1 = textField.value
        if (text1 === ""){
            return
        }
        let msg1 = {name: "User", message: text1} //object
        this.messages.push(msg1);

        fetch($SCRIPT_ROOT + '/predict', {
            method : 'POST',
            body : JSON.stringify({message:text1}),
            mode: 'cors',
            headers: {
                'Content-Type' : 'application/json'
            },
        })
        .then(r => r.json())
        .then(r =>{
            let msg2 = {name:"Sam",message : r.answer};
            this.messages.push(msg2);
            this.updateChatText(chatbox)
            textField.value = ''
        }).catch((error) => {
            console.error('Error:',error);
            this.updateChatText(chatbox)
            textField.value = ''
        });
    }

    updateChatText(chatbox) {
        var html = '';
        this.messages.slice().reverse().forEach(function(item, ){
            if (item.name ==="Sam")
            {
                html += '<div class ="messages__item messages__item--visitor">' + item.message + '</div>'
            }
            else 
            {
                html += '<div class ="messages__item messages__item--operator">' + item.message + '</div>'
            }
        });
    const chatmessage = chatbox.querySelector('.chatbox__messages');
    chatmessage.innerHTML = html
}

}
const chatbox = new Chatbox();
chatbox.display();
