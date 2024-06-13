import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../componentes/DetalhesTopico.css'
import { BiSolidLike } from "react-icons/bi";
import { BiSolidDislike } from "react-icons/bi";


export function DetalhesTopicoScreen({ status }) {
  const { id } = useParams();
  const [selectedTopico, setSelectedTopico] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [novoComentario, setNovoComentario] = useState('');
  const navigate = useNavigate();

  // Parte do editar tópico
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const baseURL = "https://forumpb-5520b-default-rtdb.firebaseio.com/";

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

  // Parte do adicionar comentário
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

  // Parte do deletar tópico
  const handleDeleteTopic = () => {
    if (status.nome === selectedTopico.username) {
      fetch(`${baseURL}/topicos/${id}.json`, {
        method: 'DELETE'
      })
        .then(response => {
          if (response.ok) {  
            navigate("/");
          } else {
            throw new Error('Falha ao excluir o tópico');
          }
        })
        .catch(error => console.error('Erro ao excluir o tópico:', error));
    }
  };

  // Parte do editar tópico
  const handleEditarTopico = () => {
    if (status.nome === selectedTopico.username) {
      const updateTopico = {
        ...selectedTopico,
        title: editTitle ? editTitle : selectedTopico.title,
        description: editDescription ? editDescription : selectedTopico.description
      };

      fetch(`${baseURL}/topicos/${id}.json`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateTopico),
      })
        .then(response => response.json())
        .then(data => {
          setSelectedTopico(updateTopico);
          setIsEditing(false); 
        })
        .catch(error => console.error('Erro ao editar o tópico:', error));
    }
  }

  // Funções para curtir e descurtir o tópico
  const handleLikeTopico = () => {
    const isLiked = selectedTopico.isLiked;
    const updatedLikes = isLiked ? selectedTopico.likes - 1 : selectedTopico.likes + 1;
    fetch(`${baseURL}/topicos/${id}.json`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ likes: updatedLikes, isLiked: !isLiked }),
    })
      .then(response => response.json())
      .then(data => setSelectedTopico(prevTopico => ({ ...prevTopico, likes: updatedLikes, isLiked: !isLiked })))
      .catch(error => console.error('Erro ao curtir o tópico:', error));
  };

  const handleDislikeTopico = () => {
    const isDisliked = selectedTopico.isDisliked;
    const updatedDislikes = isDisliked ? selectedTopico.dislikes - 1 : selectedTopico.dislikes + 1;
    fetch(`${baseURL}/topicos/${id}.json`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ dislikes: updatedDislikes, isDisliked: !isDisliked }),
    })
      .then(response => response.json())
      .then(data => setSelectedTopico(prevTopico => ({ ...prevTopico, dislikes: updatedDislikes, isDisliked: !isDisliked })))
      .catch(error => console.error('Erro ao descurtir o tópico:', error));
  };

  // Funções para curtir e descurtir comentário
  const handleLikeComentario = (commentId) => {
    const isLiked = selectedTopico.comments[commentId].isLiked;
    const updatedLikes = isLiked ? selectedTopico.comments[commentId].likes - 1 : selectedTopico.comments[commentId].likes + 1;
    fetch(`${baseURL}/topicos/${id}/comments/${commentId}.json`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ likes: updatedLikes, isLiked: !isLiked }),
    })
      .then(response => response.json())
      .then(data => {
        setSelectedTopico(prevTopico => {
          const updatedComments = {
            ...prevTopico.comments,
            [commentId]: {
              ...prevTopico.comments[commentId],
              likes: updatedLikes,
              isLiked: !isLiked
            },
          };

          return {
            ...prevTopico,
            comments: updatedComments,
          };
        });
      })
      .catch(error => console.error('Erro ao curtir o comentário:', error));
  };

  const handleDislikeComentario = (commentId) => {
    const isDisliked = selectedTopico.comments[commentId].isDisliked;
    const updatedDislikes = isDisliked ? selectedTopico.comments[commentId].dislikes - 1 : selectedTopico.comments[commentId].dislikes + 1;
    fetch(`${baseURL}/topicos/${id}/comments/${commentId}.json`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ dislikes: updatedDislikes, isDisliked: !isDisliked }),
    })
      .then(response => response.json())
      .then(data => {
        setSelectedTopico(prevTopico => {
          const updatedComments = {
            ...prevTopico.comments,
            [commentId]: {
              ...prevTopico.comments[commentId],
              dislikes: updatedDislikes,
              isDisliked: !isDisliked
            },
          };

          return {
            ...prevTopico,
            comments: updatedComments,
          };
        });
      })
      .catch(error => console.error('Erro ao descurtir o comentário:', error));
  };

  

return (
  <div className='containerDetalhesGeral'>
    {isLoading ? (
      <p>Carregando...</p>
    ) : message ? (
      <p>{message}</p>
    ) :  (
      <div>
        {isEditing ? (
          <div className='containerEditGeralTopico'>
            <div className='containerEditGeral'>
              <div className='containerInputEdit'>
                <h1>Editar Tópico</h1>
                <div className='containerLabelInput'>
                  <label className='inputEdit'>Título:</label>
                  <input
                    className='inputEdit'
                    type="text"
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    placeholder="Editar título"
                  />
                </div>
                <div className='containerLabelInput'>
                  <label className='inputEdit'>Descrição:</label>
                  <textarea
                    className='inputEdit'
                    value={editDescription}
                    onChange={e => setEditDescription(e.target.value)}
                    placeholder="Editar descrição"
                  />
                </div>
              </div>
              <div className='containerBotaoEdit'>
                <button className='botaoEdit' onClick={handleEditarTopico}>Salvar</button>
                <button className='botaoEdit' onClick={() => setIsEditing(false)}>Cancelar</button>
              </div>
            </div>
          </div>
          
        ) : (
          <div className='containerDetalhes'>
            <h1 style={{color: 'rgb(111,168,220)', textDecoration: 'underline', padding: '10px', borderBottom: 'solid 1px #666'}}>{selectedTopico.title}</h1>
            <p style={{margin: '5px 0', padding: '0 5px'}}>Autor: {selectedTopico.username}</p>
            <p style={{margin: '5px 0', padding: '0 5px'}}>Descrição: {selectedTopico.description}</p>
            {status.logado && (
              <div className='containerReacao'>
                <div className='reacaoMaisContador'>
                  <button className='botaoReacao' onClick={handleLikeTopico}><BiSolidLike/></button>
                  <p>{selectedTopico.likes}</p>
                </div>
                <div className='reacaoMaisContador'>
                  <button className='botaoReacao' onClick={handleDislikeTopico}><BiSolidDislike/></button> 
                  <p>{selectedTopico.dislikes}</p>
                </div>
              </div>
            )}
            {status.nome === selectedTopico.username && (
              <div className='containerEditarExcluir'>
                <button className='botaoEdit' onClick={() => setIsEditing(true)}>Editar</button>
                <button className='botaoEdit' onClick={handleDeleteTopic}>Excluir</button>
              </div>
            )}
            <div className='spanParte'></div>
            <div className='comentariosParte'>
              <h2>Comentários:</h2>
              {selectedTopico.comments && Object.entries(selectedTopico.comments).map(([commentId, comentario]) => (
                <div key={commentId}>
                  <p>Usuário: {comentario.username}</p>
                  <p>Comentário: {comentario.comment}</p>
                  {status.logado && (
                    <div className='containerReacao'>
                      <div className='reacaoMaisContador'>
                        <button className='botaoReacao' onClick={() => handleLikeComentario(commentId)}><BiSolidLike/></button> 
                        <p>{comentario.likes}</p>
                      </div>
                      <div className='reacaoMaisContador'>
                        <button className='botaoReacao' onClick={() => handleDislikeComentario(commentId)}><BiSolidDislike/></button>
                        <p>{comentario.dislikes}</p>
                      </div>                  
                    </div>
                  )}
                </div>
              ))}
            </div>
            {status.logado && (
            <div className='comentarTopicoClass'>
              <input
                placeholder='Digite o comentário'
                style={{padding: '5px'}}
                type="text"
                value={novoComentario}
                onChange={e => setNovoComentario(e.target.value)}
              />
              <button className='botaoEdit' onClick={adicionarComentario}>Comentar</button>
            </div>
            )}
          </div>
        )}
      </div>
    )}
  </div>
);
}

            
                    
                     







