const BASE_URL = 'https://api.airtable.com/v0/';

const allMedsUrl = `${BASE_URL}${AIRTABLE_BASE}/prescriptions`;

//  global meds
const getAllMeds = async () => {
  try {
    const response = await axios.get(allMedsUrl, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      },
    });
    return response.data.records;
  } catch (error) {
    throw error;
  }
};

const getMedById = async (id) => {
  const medByIdUrl = `${BASE_URL}${AIRTABLE_BASE}/prescriptions/${id}`;

  try {
    const response = await axios.get(medByIdUrl, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      },
    });
    return response.data.records;
  } catch (error) {
    throw error;
  }
};

const createCustomMed = async (fields) => {
  try {
    const response = await axios.post(
      allMedsUrl,
      { fields },
      {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// user meds
const userMedsUrl = `${BASE_URL}${AIRTABLE_BASE}/addedMeds`;

const getUserMeds = async () => {
  try {
    const response = await axios.get(userMedsUrl, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      },
    });
    return response.data.records;
  } catch (error) {
    throw error;
  }
};

const prescribeMed = async (fields) => {
  try {
    const response = await axios.post(
      userMedsUrl,
      { fields },
      {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const editUserMed = async (fields, medId) => {
  const editUrl = `${BASE_URL}${AIRTABLE_BASE}/addedMeds/${medId}`;
  await axios.put(
    editUrl,
    { fields },
    {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      },
    }
  );
};

const deleteUserMed = async (medId) => {
  const deleteUrl = `${BASE_URL}${AIRTABLE_BASE}/addedMeds/${medId}`;
  await axios.delete(deleteUrl, {
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
    },
  });
};
