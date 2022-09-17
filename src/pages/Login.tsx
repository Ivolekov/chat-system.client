import React, {SyntheticEvent, useState, useEffect} from 'react';
import {Navigate } from "react-router-dom";

const Login = (props: { setName: (name: string) => void }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);

    const submit = async (e: SyntheticEvent) => {
        e.preventDefault();

        const response = await fetch('https://localhost:44368/Identity/Login', {
            method: 'POST',
            headers: { "access-control-allow-origin" : "*",
            "Content-type": "application/json; charset=UTF-8"},
            body: JSON.stringify({
                username,
                password
            })
        });

        const content = await response.json();
        setRedirect(true);
        props.setName(content.username);
        localStorage.setItem("token", content.token)
        localStorage.setItem("username", content.username)
    }
    useEffect(() => {
        var main = document.getElementsByTagName("main")[0];
        main.classList.remove('home');
        main.classList.add('form-signin');
        }, []);

    if (redirect) {
        return <Navigate  to="/"/>;
    }

    return (
        <form onSubmit={submit}>
            <h1 className="h3 mb-3 fw-normal">Please sign in</h1>
            <input type="text" className="form-control" placeholder="Username" required
                   onChange={e => setUsername(e.target.value)}
            />

            <input type="password" className="form-control" placeholder="Password" required
                   onChange={e => setPassword(e.target.value)}
            />

            <button className="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
        </form>
    );
};

export default Login;
