import { useState } from 'react';
import '../App.css'
import { useNavigate } from 'react-router-dom';

const textosPlace = {
  textEmail: "Digite seu email",
  textSenha: "Digite a senha"
}

export function LoginScreen (props){
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const {users, action} = props;
  const navigate = useNavigate();
  

  function fazerLogin(event){
    event.preventDefault();
    const usuarioLogado = users.filter((user)=> user.email == email && user.senha == senha);
    if(usuarioLogado.length > 0){
      action(usuarioLogado[0]);
      navigate('/');
      setErro('');
      setEmail('');
      setSenha("");
    }
    else{
      setErro('Email ou senha inválido!');
    }
  }

  return(
      <form onSubmit={fazerLogin} className='formularioCadastro'>
        <h1>Login</h1>
        <div>
        <label>Email:</label>
          <input 
            value = {email} 
            type = 'email' 
            onChange= {(e) => setEmail (e.target.value)} placeholder={textosPlace.textEmail}
            required 
           />        
        </div>
        <div>
          <label>Senha</label>
            <input 
              value = {senha} 
              type = 'password' 
              onChange= {(e) => setSenha (e.target.value)} placeholder={textosPlace.textSenha}
              required 
             />        
          </div>
         <button type='submit' className='botaoForm'>Entrar</button>
        {erro && <p style={{color: "red", justifyContent: "center"}}>{erro}</p>}
      </form>
      )
}
   
        


        



