import axios from "axios"

export const API_URL = import.meta.env.VITE_URL

export const fetchBranches = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/getbranches`);
    return data;
  } catch (error) {
    console.error("Error fetching branches:", error);
    return [];
  }
};

export let branches = [

  {
    "id": "moa",
    "name": "NU MOA",
    "extension": "@nu-moa.edu.ph"
  },
  {
    "id": "manila",
    "name": "NU Manila",
    "extension": "@nu-manila.edu.ph"
  },
  {
    "id": "baliwag",
    "name": "NU Baliwag",
    "extension": "@nu-baliwag.edu.ph"
  },
  {
    "id": "fairview",
    "name": "NU Fairview",
    "extension": "@nu-fairview.edu.ph"
  },
  {
    "id": "eastortigas",
    "name": "NU East-Ortigas",
    "extension": "@nu-east-ortigas.edu.ph"
  },
  {
    "id": "laspinas",
    "name": "NU Las Pinas",
    "extension": "@nu-las-pinas.edu.ph"
  },
  {
    "id": "lipa",
    "name": "NU Lipa",
    "extension": "@nu-lipa.edu.ph"
  },
  {
    "id": "clark",
    "name": "NU Clark",
    "extension": "@nu-clark.edu.ph"
  },
  {
    "id": "laguna",
    "name": "NU Laguna",
    "extension": "@nu-laguna.edu.ph"
  },
  {
    "id": "dasmarinas",
    "name": "NU Dasmarinas",
    "extension": "@nu-dasmarinas.edu.ph"
  },
  {
    "id": "bacolod",
    "name": "NU Bacolod",
    "extension": "@nu-bacolod.edu.ph"
  },
  {
    "id": "cebu",
    "name": "NU Cebu",
    "extension": "@nu-cebu.edu.ph"
  }
]

export const categories = [
  {
    category: "abnormal"
  },
  {
    category: "developmental"
  },
  {
    category: "psychological"
  },
  {
    category: "industrial"
  },
  {
    category: "general"
  }
]

export const levels = [1,2,3]

export const modes = [
  {
    mode: "classic"
  },
  {
    mode: "mastery"
  }
]