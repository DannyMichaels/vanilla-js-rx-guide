let state = {
  allMeds: [],
  userMeds: [],
  medsAreLoading: true,
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

const fetchUserMeds = async () => {
  const addedMedsResponse = await getUserMeds();
  state = {
    ...state,
    userMeds: getSortedMeds(addedMedsResponse),
  };
};

const fetchAllMeds = async () => {
  const medData = await getAllMeds();
  state = {
    ...state,
    allMeds: medData,
  };
};

const PrefillDOMWithMeds = (medType) => {
  const userMedsParentDiv = document.getElementById(
    'home__userMeds--container'
  );

  state[medType].forEach((med) => {
    let medCard = document.createElement('div');
    medCard.className = 'med-card';
    medCard.setAttribute('id', med.id);

    medCard.innerHTML = `
    <h3>${med.fields.name}</h3>
    <img
        src="${med.fields.image}"
        width="100"
        height="50"
        alt="${med.fields.name}"
      />
     
     ${
       medType === 'userMeds'
         ? `
      <div>
      <h4>Taken At: </h4>
        <h5 id="med-taken-${med.id}">${med.fields.taken}</h5>
      <form className="update-med" id="home__medCard--form" data-id=${med.id} >
          <label htmlFor="taken" type="text">
            Edit Time:
          </label>
          <input
            name="taken"
            type="time"
          />
          <button className="edit-button" id="home__editMed--button" type="submit">
            <img src="https://i.imgur.com/SnXF0hi.png" alt="Edit" />
          </button>
      </form>
      <button id="home__deleteMed--button">
            <img
                src="https://i.imgur.com/NhIlDPF.png"
                alt="delete"
                width="20px"
              />
      </button>
      </div>`
         : ''
     }
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

const onDocumentDidMount = async () => {
  await fetchUserMeds();
  await fetchAllMeds();
  state = {
    ...state,
    medsAreLoading: false,
  };

  PrefillDOMWithMeds('userMeds');
  const editMedCardForm = document.getElementById('home__medCard--form');
  editMedCardForm.addEventListener('submit', onUpdateMed);
};

onDocumentDidMount();

const onDocumentWillUpdate = () => {
  // methods that should and will cause an update to the DOM.
};
