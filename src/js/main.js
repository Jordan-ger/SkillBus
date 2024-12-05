(() => {
  const TABLE_COLUMN_COUNT = 6;
  const firmColorClass = 'firm-color';
  const elemHiddenClass = 'element-hidden';
  const urlApi = new URL('http://localhost:3000/api/clients');
  const dateFormat = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  };
  const timeFormat = {
    hour: 'numeric',
    minute: 'numeric',
  };
  let gottenData;

  async function getData() {
    const response = await fetch(urlApi);
    const data = await response.json();

    return data;
  }

  async function getClient(id) {
    const urlWithId = new URL(`clients/${id}`, urlApi);
    const response = await fetch(urlWithId);
    const data = await response.json();

    return data;
  }

  async function searchClients(subStr) {
    urlApi.searchParams.set('search', subStr);
    const response = await fetch(urlApi);
    const data = await response.json();

    return data;
  }

  async function checkResponse(response) {
    const data = await response.json();
    let responseObj = {};
    responseObj.error = null;

    if (response.status !== 200 && response.status !== 201) {
      if (response.status === 404) {
        responseObj.error = 'Client not found';
        responseObj.message = 'Клиент с таким id не найден';

        return responseObj;
      }
      if (response.status > 499 && response.status < 600) {
        responseObj.error = 'ServerError';
        responseObj.message = 'странно, но сервер сломался :(\nОбратитесь к куратору Skillbox, чтобы решить проблему';

        return responseObj;
      }
      if (response.status === 422) {
        responseObj.error = 'inputs are not filled';
        responseObj.message = '';
        data.errors.forEach(error => {
          if (!responseObj.message) {
            responseObj.message = error.message;
          } else {
            responseObj.message = responseObj.message + '\n' + error.message;
          }
        });

        return responseObj;
      }
      responseObj.error = 'Unknown error';
      responseObj.message = 'Что-то пошло не так...';

      return responseObj;
    }

    return responseObj;
  }


  async function postData(clientName, clientSurname, clientLastName, clientContacts) {
    const response = await fetch(urlApi, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: clientName,
        surname: clientSurname,
        lastName: clientLastName,
        contacts: clientContacts,
      }),
    });

    return checkResponse(response);
  }

  async function editClientInfo(clientId, clientName, clientSurname, clientLastName, clientContacts) {
    const userUrl = new URL(`clients/${clientId}`, urlApi)
    const response = await fetch(userUrl, {
      method: 'PATCH',
      body: JSON.stringify({
        name: clientName,
        surname: clientSurname,
        lastName: clientLastName,
        contacts: clientContacts,
      }),
      header: { 'Content-Type': 'application/json' },
    });

     return checkResponse(response);
  }

  function deleteClient(clientId) {
    const userUrl = new URL(`clients/${clientId}`, urlApi)
    fetch(userUrl, {
      method: 'DELETE',
    });
  }

  function sortBy(sortingBy, sortDirection) {
    if (sortingBy === 'id') {
      gottenData.sort((a, b) => {
        if (sortDirection === 'up') return a.id - b.id;
        else return b.id - a.id;
      });
    }

    if (sortingBy === 'alphabet') {
      gottenData.sort((a, b) => {
        const surnameA = a.surname.toLowerCase();
        const surnameB = b.surname.toLowerCase();
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        const lastNameA = a.lastName.toLowerCase();
        const lastNameB = b.lastName.toLowerCase();
        const fullNameA = `${surnameA} ${nameA} ${lastNameA}`;
        const fullNameB = `${surnameB} ${nameB} ${lastNameB}`;

        if (sortDirection === 'up') {
          if (fullNameA > fullNameB) return 1;
          if (fullNameA < fullNameB) return -1;
          return 0;
        } else {
          if (fullNameA < fullNameB) return 1;
          if (fullNameA > fullNameB) return -1;
          return 0;
        }
      });
    }

    if (sortingBy === 'createdAt' || sortingBy === 'updatedAt') {
      gottenData.sort((a, b) => {
        const timeA = Date.parse(a[`${sortingBy}`]);
        const timeB = Date.parse(b[`${sortingBy}`]);
        if (sortDirection === 'up') {
          return timeA - timeB;
        } else {
          return timeB - timeA;
        }
      });
    }
  }

  
})();
