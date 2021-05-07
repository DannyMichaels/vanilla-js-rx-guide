const useParams = () => {
  const params = window.location.search;
  return window.location.search.replace(params[0], '');
};

const onComponentDidMount = async () => {
  const medId = useParams();
  console.log({ medId });
  const oneMed = await getMedById(medId);
  console.log({ oneMed });
};

onComponentDidMount();
