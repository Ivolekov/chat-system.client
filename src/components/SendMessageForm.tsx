import { useState } from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

const SendMessageForm = () => {
    const [message, setMessage] = useState('');
    try {
        // const connection = new HubConnectionBuilder()
        // .withUrl("https://localhost:44368/chat")
        // .configureLogging(LogLevel.Information)
        // .build();
        
        // connection.start().then(a => {
        //     if (connection.connectionId) {
        //         connection.invoke("SendMessage", message);
        //     }
        // }).catch(err => console.log('MessageHub Connection Error: ' + err.toString()))
    } catch (e) {
        console.log(e);
    }
    return <form onSubmit={e=>{
        e.preventDefault();
        //sendMessageToHub(message);
        setMessage('');
    }}>
            <h1 className="h3 mb-3 fw-normal">Message</h1>
            <input type="text" className="form-control" placeholder="message..." required
                   onChange={e => setMessage(e.target.value)} value={message}
            />
            <button className="w-100 btn btn-lg btn-primary" type="submit" disabled={!message}>Send</button>
        </form>
}

export default SendMessageForm;
