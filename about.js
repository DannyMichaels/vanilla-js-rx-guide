let state = {
  allMeds: [],
  queriedMeds: [],
};

const fetchAllMeds = async () => {
  const medData = await getAllMeds();
  state = {
    ...state,
    allMeds: medData,
    queriedMeds: medData,
  };
};

const allMedsParentDiv = document.getElementById('about__meds--container');

allMedsParentDiv.innerHTML =
  '<img src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Loading_2.gif" id="about-page-loading">';

const renderMeds = () => {
  allMedsParentDiv.innerHTML = state.queriedMeds
    .map((med) => renderMed(med))
    .join('');
};

const renderMed = (med) => {
  return `
  <a href="med-detail.html?${med.id}" style="text-decoration: none; color: inherit;" >
   <div class="med-card" id="med-card-${med.id}">
     <h3>${med.fields.name}</h3>
        <img
          src="${med.fields.image}"
          width="100"
          height="50"
          alt="${med.fields.name}"
        />
       </div>
       </a>
    `;
};

const onComponentDidMount = async () => {
  await fetchAllMeds();
  renderMeds();
  const loading = document.getElementById('about-page-loading');
  loading.parentNode.removeChild(loading);
};

onComponentDidMount();

const searchForm = document.getElementById('about__search--form');
searchForm.addEventListener('submit', (e) => e.preventDefault());

const handleChange = ({ target: { value } }) => {
  const newMeds = [...state.allMeds];

  state = {
    ...state,
    queriedMeds: newMeds.filter((med) =>
      med.fields.name.toLowerCase().includes(value.toLowerCase())
    ),
  };

  onComponentDidUpdate();
};

searchForm.addEventListener('input', handleChange);

const onComponentDidUpdate = () => {
  renderMeds();
};
