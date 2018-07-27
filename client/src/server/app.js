const axios = require('axios');

// Helper functions
const {intersect, difference} = require('./utils/helpers');

// Data
const all = require('./all.json');

// API key
const key = 'IVaXjca'


const getId = (name) => {
  const index = Object.keys(all).findIndex(strain => strain === name)
  return Object.values(all)[index].id
}

const getRace = (name) => {
  const index = Object.keys(all).findIndex(strain => strain === name)
  return Object.values(all)[index].race
}


const getNewName = (nameA, nameB) => {
  if (nameA === nameB) {
    return nameA
  } else {
    return nameA + ' ' + nameB
  }
}

const getNewRace = (raceA, raceB) => {
  if (raceA === raceB) {
    return raceA
  } else {
    return 'hybrid'
  }
}

const getNewEffects = async (idA, idB) => {
  try {
    const effectsA = await axios.get(`http://strainapi.evanbusse.com/${key}/strains/data/effects/${idA}`)
    const effectsB = await axios.get(`http://strainapi.evanbusse.com/${key}/strains/data/effects/${idB}`)
    const dominantPositive = intersect(effectsA.data.positive, effectsB.data.positive)
    const minorPositive = difference(effectsA.data.positive, effectsB.data.positive)
    const dominantNegative = intersect(effectsA.data.negative, effectsB.data.negative)
    const minorNegative = difference(effectsA.data.negative, effectsB.data.negative)
    const dominantMedical = intersect(effectsA.data.medical, effectsB.data.medical)
    const minorMedical = difference(effectsA.data.medical, effectsB.data.medical)
    const result = {
      dominantPositive,
      minorPositive,
      dominantNegative,
      minorNegative,
      dominantMedical,
      minorMedical,
    }
    return result
  } catch (e) {
    throw new Error(`Couldn't fetch effects`)
  }
}

const getNewFlavors = async (idA, idB) => {
  try {
    const flavorsA = await axios.get(`http://strainapi.evanbusse.com/${key}/strains/data/flavors/${idA}`)
    const flavorsB = await axios.get(`http://strainapi.evanbusse.com/${key}/strains/data/flavors/${idB}`)
    const dominantFlavors = intersect(flavorsA.data, flavorsB.data)
    const minorFlavors = difference(flavorsA.data, flavorsB.data)
    const result = {
      dominantFlavors,
      minorFlavors,
    }
    return result
  } catch (e) {
    throw new Error(`Couldn't fetch flavors`)
  }
}

const breedStrains = async (a, b) => {
  const child = {
    name: getNewName(a,b),
    race: getNewRace(getRace(a), getRace(b)),
    effects: await getNewEffects(getId(a), getId(b)),
    flavors: await getNewFlavors(getId(a), getId(b))
  }
  console.log(child)
}

breedStrains('Bhang Mr. Nice', 'Grapefruit')
