const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;

  input[type='text'],
  input[type='email'],
  input[type='tel'] {
    padding: 10px;
    font-size: 1.2rem;
    margin-bottom: 20px;
    border-radius: 5px;
    border: 1px solid #ccc;
    transition: all 0.3s ease-in-out;
  }

  input[type='text']:focus,
  input[type='email']:focus,
  input[type='tel']:focus {
    border: 1px solid #555;
    box-shadow: 0 0 10px #555;
  }

  select {
    padding: 10px;
    font-size: 1.2rem;
    margin-bottom: 20px;
    border-radius: 5px;
    border: 1px solid #ccc;
    transition: all 0.3s ease-in-out;
  }

  select:focus {
    border: 1px solid #555;
    box-shadow: 0 0 10px #555;
  }

  button[type='submit'] {
    padding: 10px 20px;
    background-color: #555;
    color: #fff;
    border: none;
    border-radius: 5px;
    font-size: 1.2rem;
    transition: all 0.3s ease-in-out;
  }

  button[type='submit']:hover {
    cursor: pointer;
    background-color: #fff;
    color: #555;
  }
`;