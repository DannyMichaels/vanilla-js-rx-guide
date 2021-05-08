const useParams = () => {
  const params = window.location.search;
  return window.location.search.replace(params[0], '');
};

const renderMed = (med) => {
  return `
   <div className="about-text" style="text-shadow: 2px 2px peachpuff;">
     <h1>${med?.fields?.name} </h1>
    <h2>Class: ${med?.fields?.medClass ?? 'No specific class'}</h2>
     
     <h2>Description:</h2>
     <h4 style="margin-left: 100px; margin-right: 100px;">
       ${med?.fields?.description}
     </h4>
     <img
       src="${med?.fields?.image}"
       style="max-width: 350px; max-height: 350px;"
       alt="${med?.fields?.name}"
     />
   </div>`;
};

const onComponentDidMount = async () => {
  const medId = useParams();
  const oneMed = await getMedById(medId);
  const containerDiv = document.getElementById('medDetail__medContainer');
  containerDiv.innerHTML = renderMed(oneMed);
};

onComponentDidMount();
