import React, {useState} from 'react';
import Chat from './components/Chat';
import './App.css';

const App = () => {
  const [userName, setUserName] = useState('');
  const [passAdmin, setPassAdmin] = useState('');
  const [register, setRegister] = useState(false);

  const login = (e) => {
    e.preventDefault();
    if (userName !== '' && userName.length > 2) {
      setRegister(true);
    }
  };

  const loginAdmin = () => {
    if (userName !== '' && passAdmin === 'admin') {
      //setRegister(true);
       console.log('entro como admin');
      setRegister(true);
    }
    if (userName !== '' && passAdmin.length > 2) {
      setRegister(true);
    }
  };

  return (
    <div className="App">
      {register ? <Chat userName={userName} pass={passAdmin}/>
        : <div className={'main'}>
          <h1>Chat App React - Socket io</h1>
          <div className={'loginChat'}>
            <h3>Ingresa tu nombre</h3>
            <input value={userName} placeholder={'Nombre de Usuario'}
                   onChange={(e) => setUserName(e.target.value)}/><br/><br/>
            <input value={passAdmin} placeholder={'Contraseña'} type={'password'}
                   onChange={(e) => setPassAdmin(e.target.value)}/><br/><br/>
            <button style={{}} onClick={() => loginAdmin()}>
              Login Chat
            </button>
          </div>
        </div>
      }
    </div>
  );
}

export default App;
