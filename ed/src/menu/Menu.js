import React from 'react';
import {Link} from 'react-router';

import logo from './logo-orange-bleu.png'

export default function Menu(props) {
  const {query, user} = props;

  return (
    <nav className="navbar navbar-default navbar-static-top" role="navigation">
      <div className="container">
        <div className="navbar-header">
          <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#menu-collapse">
            <span className="sr-only">Activer la navigation</span>
            <span className="icon-bar"/>
            <span className="icon-bar"/>
            <span className="icon-bar"/>
          </button>

          <a className="navbar-brand" href="#"><img alt="Logo Jean-Luc Mélenchon" src={logo}/></a>

        </div>
        <div id="menu-collapse" className="collapse navbar-collapse">
          <ul id="menu-menu-principal" className="nav navbar-nav navbar-right">
            <li><Link to={{pathname: "/evenements/", query}}>Mes événements</Link></li>
            <li><Link to={{pathname: "/groupes/", query}}>Mes groupes</Link></li>
            <li><Link to={{pathname: "/", query}}>{user.email}</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
