import React, { useEffect, useState } from 'react';
import '../App.css';
import '../componentes/Home.css';
import {TopicoCard} from '../componentes/TopicoCard';
import {NavLink} from 'react-router-dom';

export function HomeScreen(props) {
  const [topicos_data, setTopicos_data] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  
  const baseURL = "https://forumpb-5520b-default-rtdb.firebaseio.com/";
  //const baseURL = 'https://plataforma-de-forum-gamificada-default-rtdb.firebaseio.com/';
  const itensPaginas = 5;
  const quantidadePaginas = Math.ceil(topicos_data.length / itensPaginas );
  const {status} = props;
  const melhoresTopicos = topicos_data.slice(0,5);


  function dadosPagina(){
    const indiceInicial = (paginaAtual -1) * itensPaginas;
    const indiceFinal = indiceInicial + itensPaginas;
    return topicos_data.slice(indiceInicial, indiceFinal);
  }

  
  function mudarPagina(numeroPagina){
    setPaginaAtual(numeroPagina);
  }

  function botoesPaginacao(){
    const estilo = (numero) => ({
      padding: '5px 10px',
      margin: "2px",
      color: paginaAtual == numero ? '#254560' : 'white' ,
      cursor: "pointer",
      backgroundColor: paginaAtual == numero ? "white"  : '#254560',
      
    })
    
    let botoes = [];
    for(let numero = 1; numero <= quantidadePaginas; numero++){
      botoes.push(<button style={estilo(numero)} key={numero} onClick={() => mudarPagina(numero)}>{numero}</button>)
    }
    return botoes;
  }


    
  function convertData(data) {
    if (!data) return [];
    const ids = Object.keys(data);
    let topicos = Object.values(data);
    return topicos.map((topico, index) => {
      return {
        id: ids[index],
        ...topico,
      };
    });
  }

  

  useEffect(() => {
    fetch(`${baseURL}/topicos.json`)
      .then(async (resp) => {
        const respTopicos = await resp.json();
        let convertedTopicos = convertData(respTopicos);
        setTopicos_data(convertedTopicos);
      })
      .catch((err) => setMessage(err.message))
      .finally((_) => setLoading(false));
  }, [props.reloadTrigger]);

  
  return (
    <div className='containerHome'>
      {isLoading ? (<p>Carregando...</p>) 
        : message ? (<p>{message}</p>) 
        : (
        <div className='containerHome' >
          <div>
            <h1 style={{color: "white"}}>Forum</h1>
            {status && <button><NavLink to='./novoTopico'>Novo Tópico</NavLink></button>}
          </div>
          {!status && (<TopicoCard topicos={melhoresTopicos} logado={status}/>) }
          {status && (
          <div className='containerHome'>
            <TopicoCard logado={status} topicos={dadosPagina()}/>
            <div>{botoesPaginacao()}</div>
          </div>) }
        </div>
      )}
    </div>
  );
}

