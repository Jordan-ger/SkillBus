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

})();
