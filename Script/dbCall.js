if (!localStorage.getItem('coworkingDB')) {
  fetch('Data/full_coworking_database.json')
    .then(res => res.json())
    .then(data => {
      localStorage.setItem('coworkingDB', JSON.stringify(data));
    })
    .catch(err => console.error('Failed to load coworkingDB:', err));
}