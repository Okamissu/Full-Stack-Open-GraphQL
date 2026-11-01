import { useState } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

const FIND_PERSON = gql`
  query findPersonByName($nameToSearch: String!){
    findPerson(name: $$nameToSearch) {
      name
      phone
      id
      address {
        street
        city
      }
    }
  }`;

const Person = ({ person, onClose }) => {
  return (
    <div>
      <h2>{person.name}</h2>
      <div>
        {person.address.street} {person.address.city}
      </div>
      <div>{person.phone}</div>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

const Persons;
