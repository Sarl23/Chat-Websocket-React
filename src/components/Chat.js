import React, {useState, useEffect, useRef} from 'react';
import socket from './Socket';
import '../App.css';

const Chat = ({userName, pass}) => {
  const [users, setUsers] = useState([]);
  const [listmessages, setListMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    if (userName && pass) {
      const data = {userName, pass}
      socket.emit("join", data);
    }

    socket.on("users", users => {
      console.log('usuarios', users);
      setUsers(users);
    });

    socket.on("connected", user => {
      console.log('connected', user);
      if (user.pass === 'admin') setAdmin(true);
      setUsers(users => [...users, user]);
    });

    socket.on("exitUser", id => {
      console.log('Chat chao');
      setUsers(users => {
        return users.filter(user => user.id !== id);
      });
    });

  }, []);

  const getOnlyUser = (id) => {
    console.log('User', id);
    socket.emit("specificUser", id);
  };

  useEffect(() => {
    socket.on("messages", (msg) => {
      setListMessages([...listmessages, msg]);
    });

    return () => {
      socket.off();
    };
  }, [listmessages]);

  const divRef = useRef(null);
  useEffect(() => {
    divRef.current.scrollIntoView({behavior: "smooth"});
  });

  const sendMessage = (e) => {
    e.preventDefault();
    socket.emit("message", userName, message);
    setMessage('');
  };

  return (
    <div className={'main'}>
      <h1>Chat App React - Socket io</h1>
      <h1>User:{userName} with {}</h1>
      <div className={'container-chat'}>
        <div className={'box-chat'}>
          <div className="chat">
            {listmessages.map((e, i) => (
              <div key={i}>
                <div><b>{e.userName}</b></div>
                <div className={'message'}>{e.message}</div>
              </div>
            ))}
            <div ref={divRef}/>
          </div>
          <br/>
          <>
            <input
              placeholder={'Escriba su mensaje'}
              name=""
              id=""
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Enviar</button>
          </>
        </div>
        {admin
          ? <div className={'client-list'}>
            <h2>Clients List - User: {userName}</h2>
            {users.map((user, index) => (
              <div style={{textAlign: "start"}}>
                <ul key={index}>
                  <li key={index} onClick={() => {
                    getOnlyUser(user.id);
                  }}><b key={index}>{user.name}</b></li>
                </ul>
              </div>
            ))}
          </div>
          : ''
        }
      </div>
    </div>

  );
};

export default Chat;
