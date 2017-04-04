import React from 'react';

export default function Header(props) {
  const {itemLabelPlural, lastSuccess} = props;
  return <h2>Voir mes {itemLabelPlural} <small>(dernière mise à jour {lastSuccess.format("HH:mm")})</small></h2>
}
