import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import {LoginScreen} from './screens/LoginScreen';
import {CadastroScreen} from './screens/CadastroScreen';
import {HomeScreen} from './screens/HomeScreen';
import { useState, useEffect } from 'react';
import {NovoTopicoScreen} from './screens/NovoTopicoScreen';
import {DetalhesTopicoScreen} from './screens/DetalhesTopicoScreen';


export default function App() {
  const [usuarios, setUsuarios] = useState([
    {nome: 'Alex', email: 'alexcfcv@hotmail.com', senha: '123456', logado: false},
    {nome: 'Tobias', email: 'tobiascv@gmail.com', senha: '123456', logado: true}
  ]);
  const [userAtivo, setUserAtivo] = useState({});  
  const [controle, setControle] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  
  
  const controleNovoTopico = () => {
      setControle(prev => prev + 1); 
  };


  function cadastrarUsuario(values){
    const copiasUsers = usuarios.slice();
    const novoUsuario = {
      nome: values.nome,
      email: values.email,
      senha: values.senha,
      logado: true,
    };
    copiasUsers.push(novoUsuario);
    setUsuarios(copiasUsers);
    setUserAtivo(novoUsuario);
  }

  
  function deslogarUsuario(){
    setUserAtivo({});
  }

  
  function logarUsuario(usuario){
    usuario.logado = true;
    setUserAtivo(usuario);
  }

  
  return (
    <Router>
      <main className='containerGeral'>
        <header>
          <nav>
            <div className='div-link-home'>
              <NavLink to='/' style={{color: "white"}}>Home</NavLink>
            </div>
            <div className='div-link-outras'> 
              <NavLink to='/cadastro' 
                style={!userAtivo.logado ? {color: "white"}: {color: "white", display: "none"}}>Cadastrar</NavLink> 
              {!userAtivo.logado ? <NavLink to='/login' style={{color: "white"}}>Login</NavLink> : <NavLink onClick={deslogarUsuario} style={{color: "white"}}>Logout</NavLink> }
            </div>
          </nav>
        </header>
        <div className='divPrincipal'>
          <Routes>
            <Route path = "/" element = {<HomeScreen status={userAtivo.logado} reloadTrigger={controle}  />}/>
            <Route path = "/cadastro" element = {<CadastroScreen action={cadastrarUsuario} />} />
            <Route path = "/login" element = {<LoginScreen users={usuarios} action={logarUsuario}/>} />
            <Route path = "/detalhes/:id" element = {<DetalhesTopicoScreen status={userAtivo}/>} />
            <Route path = "/novoTopico" element = {<NovoTopicoScreen  status={userAtivo}  onNewTopico={controleNovoTopico}/>} />
          </Routes>
        </div>
      </main>    
    </Router>
  )
}
    
    
      


