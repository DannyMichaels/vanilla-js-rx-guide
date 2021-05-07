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

const createMedCards = (medType) => {
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
      <h5>${med.fields.taken}</h5>
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

const onDocumentDidMount = async () => {
  await fetchUserMeds();
  await fetchAllMeds();
  state = {
    ...state,
    medsAreLoading: false,
  };
  createMedCards('userMeds');
};

onDocumentDidMount();
