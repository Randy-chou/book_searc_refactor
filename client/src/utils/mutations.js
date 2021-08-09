import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user{
        username
        email
      }
    } 
  }
`;

export const ADD_USER = gql`
  mutation addUser($email: String!, $username: String!, $password: String!) {
    addUser(email: $email, username: $username, password: $password) {
      token
      user {
        username
        email
      }
    } 
  }
`;

export const SAVE_BOOK = gql`
  mutation saveBook($input: BookInput!) {
    saveBook(input: $input) {
      username
      email
      bookCount
      savedBooks{
        bookId
        authors
        description
        title
        image
        link
      }
    } 
  }
`;


export const REMOVE_BOOK = gql`
  mutation removeBook($bookId: ID!) {
    removeBook(bookId: $bookId) {
      username
      email
      bookCount
      savedBooks{
        bookId
        authors
        description
        title
        image
        link
      }
    } 
  }
`;