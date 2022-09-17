import { useState } from 'react';

const Lobby = () => {
    const [user, setUser] = useState('');
    const [room, setRoom] = useState('');

    const submit =()=>{
        //joinRoom(user, room);
    }
    return (
        <form onSubmit={submit}>
            <h1 className="h3 mb-3 fw-normal">Please sign in</h1>
            <input type="text" className="form-control" placeholder="Username" required
                   onChange={e => setUser(e.target.value)}
            />

            <input type="password" className="form-control" placeholder="Password" required
                   onChange={e => setRoom(e.target.value)}
            />

            <button className="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
        </form>
    );
}

export default Lobby
