import  {useEffect, useState} from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

const Home = (props: { name: string }) => {
    //const [users, setUsers] = useState([] as any[]);  
    const [onlineUsers, setOnlineUsers] = useState([] as any[]); 
    const [connection, setConnection] = useState({} as any);
    const [messages, setMessages] = useState<{
        text:string,
        senderName: string,
        receiverName:string,
        timestamp: string
    }[]>([]);
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

        connection.on("receiveMessage", (obj) => {
            let objStr = JSON.stringify(obj);
            let messageObj = JSON.parse(objStr);
            setMessages(messages => [...messages, {text:messageObj.text,receiverName:messageObj.receiverName,senderName:messageObj.senderName,timestamp:messageObj.timestamp}]);
            console.log(messages)
          });

        connection.on("receiveOnlineUsernames", addOnlineUsers);
        
        connection.onclose(e => {
                     setConnection(connection);
                     //setMessages([]);
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
        let messageStrObj = JSON.stringify({
            text,
            receiverName,
            senderName
        });
        let messageObj = JSON.parse(messageStrObj);
        setMessages(messages => [...messages, {text:messageObj.text,receiverName:messageObj.receiverName,senderName:messageObj.senderName,timestamp:messageObj.timestamp}]);
        connection.invoke("sendMessage", JSON.parse(messageStrObj));
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
    usersHtml = (<div className="users">
                <h3>Users in the system</h3>
                <ul className='list-group'>
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
            <div>
                <input type="text" className="form-control send-msg-input" placeholder="Type a message..." required onChange={e => setMessage(e.target.value)} value={message}/>
                <button className="w-100 btn btn-lg btn-primary send-msg-btn" type="submit" disabled={!message}>Send</button>
            </div>
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
                <div className='grid-container'>
                    {usersHtml}
                    <div className='chat'>{messages.map((m, index) => {
                        if (m.senderName === props.name) {
                            let date = new Date();
                            let ampm =  date.getHours() >= 12 ? 'pm' : 'am';
                            let month = date.getMonth() + 1;
                            let formatedDateTime = date.getDate() + '.' + month + '.' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes()+ampm

                            return <div>
                                <div className='datetime text-alighn-end'>{formatedDateTime}</div>
                                <h6 className='sender-chat' key={index}>{m.text}</h6>
                            </div>
                        } else {
                            let date =new Date(m.timestamp);
                            let ampm =  date.getHours() >= 12 ? 'pm' : 'am';
                            let month = date.getMonth() + 1;
                            let formatedDateTime = date.getDate() + '.' + month + '.' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes()+ampm

                            return <div>
                                <div className='datetime'>{formatedDateTime}</div>
                                <h6 className='receiver-chat' key={index}>{m.text}</h6>
                            </div>
                        }
                            
                        })}
                </div>
            </div> 
            {messageForm}
        </div>)
};

export default Home;
