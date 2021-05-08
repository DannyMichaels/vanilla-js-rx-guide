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

const renderMed = (med) => {
  return `
    <div class="med-card" id="med-card-${med.id}">
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
      <form className="update-med" id="home__medCard--form" data-id=${med.id}>
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

      </div>
    `;
};

const renderMeds = () => {
  userMedsParentDiv.innerHTML = state.userMeds
    .map((med) => renderMed(med))
    .join('');
};

const renderCreateMedForm = () => {
  const form = document.getElementById('home__createMed');
  form.innerHTML = `
   <label for="name" type="text">
        Name:
      </label>
      <select
        class="select-css"
        name="name"
        type="text"
        id="home-select-med"
        ${state.allMeds
          .map((med) => `<option value="${med.id}">${med.fields.name}</option>`)
          .join('')}
      </select>

      <label for="taken" type="text">
        Taken At:
      </label>
      <input
        name="taken"
        type="time"
        id="home-taken-input"
      />
       <button type="Submit" class="edit-button">
        <img
        class="add"
          style="width:50px; height: 50px;"
          src="https://i.imgur.com/BZOV6FC.png"
          alt="Submit"
        />
      </button>
  `;
};

const onUpdateMed = (e) => {
  e.preventDefault();
  const medIdToUpdate = e.target.dataset.id;
  const allForms = document.querySelectorAll('#home__medCard--form');

  const editMedCardForm = Array.from(allForms).find(
    (form) => form.dataset.id === medIdToUpdate
  );
  const timeTakenInput = editMedCardForm.querySelector(`input[name="taken"]`);

  let foundMed = state.userMeds.find((med) => med.id === medIdToUpdate);

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

  timeTakenInput.value = '';
};

const onDeleteMed = async (e) => {
  let idToDelete = e.target.parentNode.dataset.id;
  const medToDelete = state.userMeds.find((med) => med.id === idToDelete);

  const medCardToRemove = document.getElementById(`med-card-${idToDelete}`);
  medCardToRemove.parentNode.removeChild(medCardToRemove);

  await deleteUserMed(medToDelete.id);

  state = {
    ...state,
    userMeds: state.userMeds.filter((med) => med.id !== medToDelete.id),
  };

  onComponentDidUpdate();
};

const handleCreateMed = async (e) => {
  e.preventDefault();
  let medInput = document.getElementById('home-select-med');
  let takenInput = document.getElementById('home-taken-input');

  let medicine = state.allMeds.find((med) => med.id === medInput.value);

  const createdMed = {
    ...medicine,
    fields: {
      ...medicine.fields,
      taken: takenInput.value,
    },
  };

  const fieldsToSend = {
    name: createdMed.fields.name,
    image: createdMed.fields.image,
    taken: createdMed.fields.taken,
  };

  const newMed = await prescribeMed(fieldsToSend);

  state = {
    ...state,
    userMeds: [...state.userMeds, newMed],
  };

  onComponentDidUpdate();
};

const initEventListeners = async () => {
  const editMedCardForms = document.querySelectorAll('#home__medCard--form');
  const deleteMedBtns = document.querySelectorAll('#home__deleteMed--button');

  deleteMedBtns.forEach((btn) => {
    btn.addEventListener('click', onDeleteMed);
  });

  const createMedForm = document.getElementById('home__createMed');

  createMedForm.addEventListener('submit', handleCreateMed);

  editMedCardForms.forEach((form) =>
    form.addEventListener('submit', onUpdateMed)
  );
};

const onComponentDidMount = async () => {
  await fetchAllMeds();
  await fetchUserMeds();
  renderMeds();
  renderCreateMedForm();
  initEventListeners();
};

onComponentDidMount();

const onComponentDidUpdate = async () => {
  renderCreateMedForm();
  renderMeds();
  initEventListeners();
};
