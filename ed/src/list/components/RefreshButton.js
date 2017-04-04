import React from 'react';

export default function RefreshButton(props) {
  const {fetchList} = props;

  return (
    <div style={{position: 'absolute', top: 0, right: 0}}>
      <button className="btn btn-default" onClick={fetchList}>Rafraîchir</button>
    </div>
  );
}
