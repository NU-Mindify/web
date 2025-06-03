import axios from "axios"

export const API_URL = import.meta.env.VITE_URL


export let branches = []


export const fetchBranches = async () => {
  try {
    const { data } = await axios.get(API_URL + "/getbranches")
    branches = data
    return data
  } catch (error) {
    console.error("Error fetching branches:", error)
    return []
  }
}




fetchBranches()

export const categories = [
  {
    id: "abnormal",
    name: "Abnormal Psychology",
  },
  {
    id: "developmental",
    name: "Developmetal Psychology",
  },
  {
    id: "psychological",
    name: "Psychological Assessment ",
  },
  {
    id: "industrial",
    name: "Industrial Psychology",
  },
  {
    id: "general",
    name: "General Psychology",
  }
]

export const levels = [1,2,3,4,5,6,7,8,9,10]

export const modes = [
  {
    mode: "mastery"
  },
  {
    mode: "competition"
  },
  {
    mode: "review"
  }
]

export const defaultAvatar = "https://static.vecteezy.com/system/resources/previews/055/581/121/non_2x/default-profile-picture-icon-avatar-photo-placeholder-illustration-vector.jpg"