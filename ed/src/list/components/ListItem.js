import React from 'react';
import {Link} from 'react-router';

export default function ListItem(props) {
  const {item, itemType, query} = props;
  return (
    <li>
      <h3><Link to={{pathname: `/${itemType}/${item._id}`, query}}>{item.name}</Link></h3>
      {item.location && item.location.name && <div>Lieu&nbsp;: {item.location.name}</div>}

    </li>
  );
}
