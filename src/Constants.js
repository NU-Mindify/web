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