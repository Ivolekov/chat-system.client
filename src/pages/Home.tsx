import  {useEffect, useState} from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

const Home = (props: { name: string }) => {
    //const [users, setUsers] = useState([] as any[]);  
    const [onlineUsers, setOnlineUsers] = useState([] as any[]); 
    const [connection, setConnection] = useState({} as any);
    const [messages, setMessages] = useState([] as any[]);
    const [message, setMessage] = useState('');
    const [showMessageForm, setShowMessageForm] = useState(false);
    const [receiverUsername, setReceiverUsername] = useState('');

    const getUsers = async () => {
    if(localStorage.getItem('token')){
            //const response = await fetch('https://localhost:44368/Users', {
            //    method: 'GET',
           // headers: { 
            //    "Authorization": "Bearer " + localStorage.getItem('token')
           // }
           // }).then((res) => res.json());

            //setUsers(response);
        };
        const connection = new HubConnectionBuilder()
        .withUrl("https://localhost:44368/chat")
        .configureLogging(LogLevel.Information)
        .build();

        connection.on("receiveMessage", (message) => {
            setMessages(messages => [...messages, { message }]);
          });

        connection.on("receiveOnlineUsernames", addOnlineUsers);
        
        connection.onclose(e => {
                     setConnection(connection);
                     setMessages([]);
                     //setUsers([]);
                   });
        
        connection.start().then(e=>{
                connection.invoke("addUserToChatSystem", connection.connectionId, props.name);
                connection.invoke("sendOnlineUsernames");
        }).catch(er=>console.log(er));
        
        setConnection(connection);
    }

    const sendMessageToHub = function(text: string) {
        let receiverUsernameStrJson = JSON.stringify(receiverUsername);
        let receiverName =JSON.parse(receiverUsernameStrJson).username;
        let senderName = props.name;
        let messageObj = JSON.stringify({
            text,
            receiverName,
            senderName
        });
        
        connection.invoke("sendMessage", JSON.parse(messageObj));
    }

    const addOnlineUsers = function(onlineUsers: any[]){
        setOnlineUsers(onlineUsers);
    }

    const activateSendMessage = function(username:any){
        setReceiverUsername(username);
        setShowMessageForm(true);
    }

    let usersHtml;
    if(localStorage.getItem('token')){
    usersHtml = (<div className="app">
                <h3>Users in the system</h3>
                <ul className='list-group' id='users'>
                    { Object.entries(onlineUsers).map(([username,value], idx) => {
                        return  <li className='list-group-item d-flex justify-content-between align-items-center hover-user' onClick={()=>{activateSendMessage({username})}} connection-id={value} key={idx}>{username}
                            <span className="badge badge-primary badge-pill"></span>
                        </li>
                    })}
                </ul>
            </div>)
    }

    let messageForm;
    if (showMessageForm) {
        messageForm =(<form onSubmit={e=>{
                e.preventDefault();
                sendMessageToHub(message);
                setMessage('');
            }}>
            <h1 className="h3 mb-3 fw-normal">Message</h1>
            <input type="text" className="form-control" placeholder="message..." required
                   onChange={e => setMessage(e.target.value)} value={message}
            />
            <button className="w-100 btn btn-lg btn-primary" type="submit" disabled={!message}>Send</button>
        </form>)
    }

    useEffect(() => {
        getUsers();
        var main = document.getElementsByTagName("main")[0];
        main.classList.add('home');
        main.classList.remove('form-signin');
        }, []);
        
    return (
        <div>
            {props.name ? <h5>Hi {props.name}</h5> : 'You are not logged in'}
            {usersHtml}
            <div>{messages.map((m, index) => <h6 key={index}>{m.message}</h6>)}</div>
            {messageForm}
        </div>)
};

export default Home;
