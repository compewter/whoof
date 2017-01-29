import React from 'react';

export default function Attacks(props) {
  return (
    <table className='ui selectable structured large table'>
      <thead>
        <tr>
          <th colSpan='5'>
            <h3>Attacks</h3>
          </th>
        </tr>
        <tr>
          <th>Name</th>
          <th className='eight wide'>Description</th>
        </tr>
      </thead>
      <tbody>
        {
          props.attacks.map((attack, idx) => (
            <tr
              key={idx}
              onClick={() => {}}
            >
              <td>{attack.name}</td>
              <td>{attack.description}</td>
            </tr>
          ))
        }
      </tbody>
    </table>
  );
}