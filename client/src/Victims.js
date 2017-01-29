import React from 'react';

export default function Victims(props) {
  return (
    <table className='ui selectable structured large table'>
      <thead>
        <tr>
          <th colSpan='5'>
            <h3>Victims</h3>
          </th>
        </tr>
        <tr>
          <th>ID</th>
          <th>IP</th>
          <th className='eight wide'>Agent</th>
          <th>Time Connected</th>
        </tr>
      </thead>
      <tbody>
        {
          props.victims.map((victim, idx) => (
            <tr
              key={idx}
              onClick={() => {}}
            >
              <td>{victim.id}</td>
              <td>{victim.ip}</td>
              <td>{victim.agent}</td>
              <td>{victim.connectedAt}</td>
            </tr>
          ))
        }
      </tbody>
    </table>
  );
}