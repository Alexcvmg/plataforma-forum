import './TopicoCard.css';
import { BiSolidLike } from "react-icons/bi";
import { BiSolidDislike } from "react-icons/bi";
import { FaComment } from "react-icons/fa";
import { Link } from 'react-router-dom';

export function TopicoCard(props){
   const {logado} = props;
   const estiloLink = {
     fontSize: "18px",
     color: "rgb(111,168,220)",
     padding: "0"
   }
  
  return(
    <div className='div-card-container'>
      {props.topicos.map((topico , index) => (
        <div key={index} className='div-card'>
          <div className='info-princ'>
            {logado ? <Link style={estiloLink} to={`/detalhes/${topico.id}`}>{topico.title}</Link> : <h2>{topico.title}</h2>}
            
            <p>Autor: {topico.username} <FaComment style={{color: "white"}}/>{0}</p>
          </div>
          <div className='reacao'>
            <span><BiSolidLike style={{color: "white"}}/>{topico.likes}</span>        
            <span><BiSolidDislike style={{color: "white"}}/>{topico.dislikes} </span> 
          </div>
        </div>
      ))}  
    </div>
  )
}
                 


