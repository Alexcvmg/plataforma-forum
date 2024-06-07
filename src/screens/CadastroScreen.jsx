import { useState } from 'react';
import '../componentes/Cadastro.css';
import * as Yup from 'yup';
import {Formik, useFormik} from 'formik';
import { useNavigate } from 'react-router-dom';

const textosPlace = {
  textEmail: "Digite seu email",
  textSenha: "Digite a senha",
  textNome: "Digite o nome",
};

export function CadastroScreen({action}){
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      nome: '',
      email: '',    
      senha: '',
      confirmarSenha: ''
    },
    validationSchema: Yup.object({
      nome: Yup.string()
        .required('O nome é obrigatório')
        .min(3, 'Nome deve ter no mínimo 3 caracteres'),
      email:Yup.string()
        .required('O email é obrigatório')
        .email('Digite um email válido'),
      senha: Yup.string()
        .required('A senha é obrigatória')
        .min(6, 'A senha deve ter no mínimo 6 caracteres'),
      confirmarSenha: Yup.string()
        .required('É obrigatório confirmar a senha.')
        .oneOf([Yup.ref('senha'), null], 'As senhas não são iguais')
    }),
    onSubmit: function(values, {resetForm}) {
      action(values);
      navigate("/");
      resetForm();
    }
  })
      
return(
    <form className='formularioCadastro' onSubmit={formik.handleSubmit}>
      <h1>Tela de Cadastro</h1>
      <div className='divInput'>
        <label>Nome:</label>
        <input placeholder={textosPlace.textNome} type={'text'} value={formik.values.nome} onChange={formik.handleChange} name={'nome'}/>
        {formik.errors.nome && <p style={{color: 'red'}}>{formik.errors.nome}</p>}
      </div>
      <div className='divInput'>
        <label>Email:</label>
        <input placeholder={textosPlace.textEmail} type={'text'} value={formik.values.email} onChange={formik.handleChange} name={'email'}/>
        {formik.errors.email && <p style={{color: 'red'}}>{formik.errors.email}</p>}
      </div>
      <div className='divInput'>
        <label>Senha:</label>
        <input placeholder={textosPlace.textSenha} type={'password'} value={formik.values.senha} onChange={formik.handleChange} name={'senha'}/>
        {formik.errors.senha && <p style={{color: 'red'}}>{formik.errors.senha}</p>}
      </div>
      <div className='divInput'>
        <label>Confirmar Senha:</label>
        <input placeholder={textosPlace.textSenha} type={'password'} value={formik.values.confirmarSenha} onChange={formik.handleChange} name={'confirmarSenha'}/>
        {formik.errors.confirmarSenha && <p style={{color: 'red'}}>{formik.errors.confirmarSenha}</p>}
      </div>
      <button className='botaoForm' type='submit'>Enviar</button>
    </form>
  )
}


        