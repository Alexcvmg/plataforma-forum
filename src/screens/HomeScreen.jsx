import React, { useEffect, useState } from 'react';
import '../App.css';
import '../componentes/Home.css';
import { TopicoCard } from '../componentes/TopicoCard';
import { NavLink } from 'react-router-dom';

export function HomeScreen(props) {
  const [topicos_data, setTopicos_data] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [filterTerm, setFilterTerm] = useState('');
  const [ordenacao, setOrdenacao] = useState('');

  const baseURL = "https://forumpb-5520b-default-rtdb.firebaseio.com/";
  const itensPaginas = 5;
  const quantidadePaginas = Math.ceil(topicos_data.length / itensPaginas);
  const { status } = props;
  const melhoresTopicos = topicos_data.slice(0, 5);

  function dadosPagina(topicos) { 
    const indiceInicial = (paginaAtual - 1) * itensPaginas;
    const indiceFinal = indiceInicial + itensPaginas;
    return topicos.slice(indiceInicial, indiceFinal);
  }

  function mudarPagina(numeroPagina) {
    setPaginaAtual(numeroPagina);
  }

  function botoesPaginacao() {
    const estilo = (numero) => ({
      padding: '5px 10px',
      margin: "2px",
      color: paginaAtual == numero ? '#254560' : 'white',
      cursor: "pointer",
      backgroundColor: paginaAtual == numero ? "white" : '#254560',
    });

    let botoes = [];
    for (let numero = 1; numero <= quantidadePaginas; numero++) {
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

  function filterTopicosList() {
    return topicos_data.filter(topico => topico.title.toLowerCase().includes(filterTerm.toLowerCase()));
  }

  function handleOrdenacao(event) {
    const value = event.target.value;
    setOrdenacao(value);
  }

  let topicosFiltrados = filterTopicosList();
  if (ordenacao === 'title') {
    topicosFiltrados.sort((a, b) => {
      if (a.title < b.title) return -1;
      if (a.title > b.title) return 1;
      return 0;
    });
  }

  const topicosExibidos = status ? dadosPagina(topicosFiltrados) : topicosFiltrados.slice(0, 5);

  const estiloBotaoLinkHome = {
    color: 'white',
    padding: '5px',
    backgroundColor: '#254560',
    fontWeight: 'bold',
    borderRadius: '5px',
    cursor: 'pointer',
    border: '1px solid black'
  }

  return (
    <div style={{ marginTop: '50px' }} className='containerHome'>
      {isLoading ? (<p>Carregando...</p>)
        : message ? (<p>{message}</p>)
          : (
            <div className='containerHome'>
              <div className='tituloBotaoHome'>
                <h1 style={{ color: "white" }}>Forum</h1>
                {status && <NavLink style={estiloBotaoLinkHome} to='./novoTopico'>Novo Tópico</NavLink>}
              </div>
              {!status && (<TopicoCard topicos={melhoresTopicos} logado={status} />)}
              {status && (
                <div className='containerHome'>
                  <TopicoCard logado={status} topicos={topicosExibidos} />
                  <div className='divBotoesNav'>
                    <div className='botoesDiv'>{botoesPaginacao()}</div>
                    <div className='ContainerfiltroOrdenacao'>
                      <input
                        data-cy='input-filtro'
                        value={filterTerm}
                        onChange={event => setFilterTerm(event.target.value)}
                        id='inputSearch'
                        className='inputFiltro'
                        placeholder='Buscar tópico'
                      />
                      <div className='ordenarFiltrar'>
                        <label>Ordenar:</label>
                        <select value={ordenacao} onChange={handleOrdenacao} className='selectedFiltro'>
                          <option>Selecione</option>
                          <option value={'title'}>Título</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
    </div>
  );
}





