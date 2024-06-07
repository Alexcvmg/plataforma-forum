import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export function DetalhesTopicoScreen({status}) {
  const { id } = useParams();
  const [selectedTopico, setSelectedTopico] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [novoComentario, setNovoComentario] = useState(''); 

  const baseURL = "https://forumpb-5520b-default-rtdb.firebaseio.com/";
  //const baseURL = "https://plataforma-de-forum-gamificada-default-rtdb.firebaseio.com/";

  function convertData(data) {
    const ids = Object.keys(data);
    let topicos = Object.values(data);
    return topicos.map((topico, index) => {
      return {
        id: ids[index],
        ...topico
      };
    });
  }

  const fetchTopico = () => {
    setLoading(true);
    fetch(`${baseURL}/topicos/${id}.json`)
      .then(async (resp) => {
        const topico = await resp.json();
        setSelectedTopico({ id, ...topico });
      })
      .catch((err) => setMessage(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTopico();
  }, [id]);


  const adicionarComentario = () => {
    if (novoComentario.trim() !== '') {
      const novoComentarioObj = {
        username: status.nome, 
        comment: novoComentario,
        likes: 0,
        dislikes: 0
      };

      fetch(`${baseURL}/topicos/${id}/comments.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(novoComentarioObj),
      })
        .then(response => response.json())
        .then(data => {
          setSelectedTopico(prevTopico => ({
            ...prevTopico,
            comments: {
              ...(prevTopico.comments || {}),
              [data.name]: novoComentarioObj
            }
          }));
          setNovoComentario('');
        })
        .catch(error => console.error('Erro ao adicionar comentário:', error));
    }
  };

  return (
    <div>
      {isLoading ? (
        <p>Carregando...</p>
      ) : message ? (
        <p>{message}</p>
      ) : (
        <div>
          <h1>{selectedTopico.title}</h1>
          <p>Autor: {selectedTopico.username}</p>
          <p>Descrição: {selectedTopico.description}</p>
          <p>Like: {selectedTopico.likes} Dislike: {selectedTopico.dislikes}</p>

          <input
            type="text"
            value={novoComentario}
            onChange={e => setNovoComentario(e.target.value)}
          />

          <button onClick={adicionarComentario}>Adicionar Comentário</button>
          <h2>Comentários:</h2>
          {selectedTopico.comments && Object.values(selectedTopico.comments).map((comentario, index) => (
            <div key={index}>
              <p>Usuário: {comentario.username}</p>
              <p>Comentário: {comentario.comment}</p>
              <p>Likes: {comentario.likes} Dislikes: {comentario.dislikes}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



