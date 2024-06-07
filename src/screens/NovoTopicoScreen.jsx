import React, { useState, useEffect } from 'react';
import '../componentes/Cadastro.css';
import { useNavigate } from 'react-router-dom';

export function NovoTopicoScreen({status, controleNovoTopico }) {
   const baseUrl = "https://forumpb-5520b-default-rtdb.firebaseio.com/";
 // const baseUrl = 'https://plataforma-de-forum-gamificada-default-rtdb.firebaseio.com/';
  const [isLoading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  function salvarTopico(event) {
    event.preventDefault();
    setLoading(true);
    const topico = {
        username: status.nome,
        title: title,
        description: description,
        comments: {},        
        likes: 0,    
        dislikes: 0  
    };

    fetch(`${baseUrl}/topicos.json`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(topico),
    })
      .then(_ => {setMessage("Salvo com sucesso")
                    controleNovoTopico(); 
                    
                    
                 })
      .catch(error => setMessage(error.message))
      .finally(() => {setLoading(false);
                      navigate('/');});
    
      
  };

  return (
    <form onSubmit={salvarTopico} className='formularioCadastro'>
      <h1>Criar novo tópico</h1>
      <div className='divInput'>
        <label htmlFor='title'>Título:</label>
        <input id='title' value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className='divInput'>
        <label htmlFor='description'>Descrição:</label>
        <textarea id='description' value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <button className='botaoForm' type='submit' disabled={isLoading}>
        {isLoading ? 'Salvando...' : 'Salvar'}
      </button>
        {message && <p>{message}</p>}
    </form>
  );
}

      
