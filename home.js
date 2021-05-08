let state = {
  userMeds: [],
  allMeds: [],
};

const getSortedMeds = (meds) => {
  const sortedMeds = meds.sort((recordA, recordB) => {
    const date1 = new Date(recordA.createdTime).getTime();
    const date2 = new Date(recordB.createdTime).getTime();

    if (date1 < date2) {
      return -1;
    } else if (date1 > date2) {
      return 1;
    } else {
      return 0;
    }
  });
  return sortedMeds;
};

const fetchAllMeds = async () => {
  const medData = await getAllMeds();
  state = {
    ...state,
    allMeds: medData,
  };
};

const fetchUserMeds = async () => {
  const addedMedsResponse = await getUserMeds();
  state = {
    ...state,
    userMeds: getSortedMeds(addedMedsResponse),
  };
};

const userMedsParentDiv = document.getElementById('home__userMeds--container');
userMedsParentDiv.innerHTML =
  '<img src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Loading_2.gif" id="home-page-loading">';

const renderMeds = () => {
  state.userMeds.forEach((med) => {
    let medCard = document.createElement('div');
    medCard.className = 'med-card';
    medCard.setAttribute('id', `med-card-${med.id}`);

    medCard.innerHTML = `
    <h3>${med.fields.name}</h3>
    <img
        src="${med.fields.image}"
        width="100"
        height="50"
        alt="${med.fields.name}"
      />
     
    
      <div>
      <h4>Taken At: </h4>
        <h5 id="med-taken-${med.id}">${med.fields.taken}</h5>
      <form className="update-med" id="home__medCard--form" data-id=${med.id} >
          <label for="taken" type="text">
            Edit Time:
          </label>
          <input
            name="taken"
            type="time"
          />
          <button class="edit-button" id="home__editMed--button" type="submit" style="margin-top: 20px;">
            <img src="https://i.imgur.com/SnXF0hi.png" alt="Edit" />
          </button>
      </form>
      
      <button id="home__deleteMed--button" data-id=${med.id} class="edit-button" style="margin-top: 20px;">
            <img
                src="https://i.imgur.com/NhIlDPF.png"
                alt="delete"
                width="20px"
              />
      </button>
      </div>
    `;
    userMedsParentDiv.appendChild(medCard);
  });
};

const onUpdateMed = (e) => {
  e.preventDefault();

  const editMedCardForm = document.getElementById('home__medCard--form');
  const timeTakenInput = editMedCardForm.querySelector('input[name="taken"]');

  let foundMed = state.userMeds.find(
    (med) => med.id === editMedCardForm.dataset.id
  );

  const updatedMed = {
    ...foundMed,
    fields: {
      ...foundMed.fields,
      taken: timeTakenInput.value,
    },
  };

  editUserMed(updatedMed.fields, updatedMed.id);

  state = {
    ...state,
    userMeds: state.userMeds.map((med) =>
      med.id === updatedMed.id ? updatedMed : med
    ),
  };

  const elementToChange = document.getElementById(`med-taken-${updatedMed.id}`);
  elementToChange.innerText = updatedMed.fields.taken;
};

const onDeleteMed = async () => {
  const deleteMedBtn = document.getElementById('home__deleteMed--button');
  const medToDelete = state.userMeds.find(
    (med) => med.id === deleteMedBtn.dataset.id
  );

  const medCardToRemove = document.getElementById(`med-card-${medToDelete.id}`);
  medCardToRemove.parentNode.removeChild(medCardToRemove);

  await deleteUserMed(medToDelete.id);

  state = {
    ...state,
    userMeds: state.userMeds.filter((med) => med.id !== medToDelete.id),
  };
};

const renderCreateMedForm = () => {
  const form = document.getElementById('home__createMed');
  form.innerHTML = `
   <label for="name" type="text">
        Name:
      </label>
      <select
        className="select-css"
        name="name"
        type="text"
        value={props.name}
        ${state.allMeds
          .map((med) => `<option>${med.fields.name}</option>`)
          .join('')}
      </select>

      <label htmlFor="taken" type="text">
        Taken At:
      </label>
      <input
        name="taken"
        type="time"
        value={props.taken}
      />
  `;

  console.log({ form });
};

const onComponentDidMount = async () => {
  await fetchAllMeds();
  await fetchUserMeds();

  renderMeds();

  const loading = document.getElementById('home-page-loading');
  userMedsParentDiv.removeChild(loading);

  const editMedCardForm = document.getElementById('home__medCard--form');
  const deleteMedBtn = document.getElementById('home__deleteMed--button');

  editMedCardForm.addEventListener('submit', onUpdateMed);
  deleteMedBtn.addEventListener('click', onDeleteMed);

  renderCreateMedForm();
};

onComponentDidMount();
