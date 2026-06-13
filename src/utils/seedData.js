import {
  addDoc,
  collection,
  getDocs,
  limit,
  query,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase/config'

const FOUNDER = {
  name: 'Afzal Sultan Khan',
  dob: '04/09/1981',
  profession: 'Master in Karate and Kickboxing',
  qualifications: [
    '4th Dan Black Belt, Karate Shotokan (All India Karate Federation)',
    '2nd Dan Black Belt, Kickboxing',
    'National Referee in Karate',
    'State Referee in Kickboxing',
  ],
  experience: '27+ years',
  hometown: 'Mumbai',
  bio: 'Afzal Sultan Khan is the founder of Bushido Karate Kickboxing & Sports Academy and a dedicated martial artist with over 27 years of experience. He has trained hundreds of students and represented India at national and state levels as a certified referee.',
  imageUrl: '',
}

export async function seedFirestore() {
  const trainersRef = collection(db, 'trainers')
  const existing = await getDocs(query(trainersRef, limit(1)))

  if (!existing.empty) {
    return {
      seeded: false,
      message: 'Trainers collection already contains data. Seed skipped.',
    }
  }

  const docRef = await addDoc(trainersRef, {
    ...FOUNDER,
    createdAt: serverTimestamp(),
  })

  return {
    seeded: true,
    message: `Founder document added with id ${docRef.id}.`,
  }
}
