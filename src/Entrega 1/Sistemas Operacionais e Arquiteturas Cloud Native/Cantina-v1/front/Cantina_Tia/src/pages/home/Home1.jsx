import React from 'react'
import { Link } from 'react-router-dom';
import logo from '../../assets/Logo.svg'
import bloob1 from '../../assets/Vector(tia1).svg'
import bloob2 from '../../assets/Vector(tia2).svg'
import comedoria from '../../assets/comedoria.svg'
import cardapio from '../../assets/meal-svgrepo-com.svg'
import './home.css';

const Home = () => {
  return (
    <div className="page-container">
      <div id="background-overlay"></div>
      <div id="navbar">
        <div id="container-nav">
            <img src={logo} alt="Logo" id="logo-nav"/>
            <Link to="/login"><button id="login">Login</button></Link>
        </div>
      </div>
      <div id="container-home">
          <img src={comedoria} id="comedoria" alt="comedoria" />
          <h2 className='adm'>- ADMINISTRATIVO -</h2>
          <a href="https://www.canva.com/design/DAGet9pmafQ/xdcO-PvnBJ11qnyJH0LYdQ/view?utm_content=DAGet9pmafQ&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h59a309e793" 
            target="_blank" 
            id="cardapio" 
            rel="noopener noreferrer">
            <img src={cardapio} alt="Ícone" id="cardapio-icon" />Cardápio Online
          </a>
          <h2 id="primeiro">Av. da Liberdade, 532 - Liberdade, São Paulo - SP, 01502-001</h2>
          <h2>Bloco C - 1º Andar</h2>
      </div>
      <img src={bloob1} alt="bloob1" id="bloob1" />
      <img src={bloob2} alt="bloob2" id="bloob2" />
      <footer> Created by InovaTech - 2025®</footer>
    </div>
  )
}

export default Home
