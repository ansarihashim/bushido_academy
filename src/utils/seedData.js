import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../firebase/config'

const FOUNDER = {
  name: 'Afzal Sultan Khan',
  dob: '04/09/1981',
  profession: 'Master in Karate and Kickboxing',
  qualifications: [
    '4th Dan Black Belt, Karate Shotokan',
    'All India Karate Federation 2nd Dan Black Belt',
    'Kickboxing 2nd Dan Black Belt',
    'National Referee in Karate and State Referee in Kickboxing',
  ],
  experience: '27+ years',
  hometown: 'Mumbai',
  bio: 'Afzal Sultan Khan is the founder of Bushido Karate Kickboxing & Sports Academy and a dedicated martial artist with over 27 years of experience. He has trained hundreds of students and represented India at national and state levels as a certified referee.',
  imageUrl: '',
}

/**
 * One-time patch: overwrite the `qualifications` field on every existing
 * trainer document with the current FOUNDER.qualifications list, without
 * touching any other field (bio, photo, etc.). Must be run while signed in
 * as an admin (Firestore rules require auth for writes).
 */
export async function updateTrainerQualifications() {
  const trainersRef = collection(db, 'trainers')
  const snap = await getDocs(trainersRef)
  if (snap.empty) {
    return { updated: 0, message: 'No trainer documents found.' }
  }
  await Promise.all(
    snap.docs.map((d) =>
      updateDoc(doc(db, 'trainers', d.id), {
        qualifications: FOUNDER.qualifications,
      })
    )
  )
  return {
    updated: snap.size,
    message: `Updated qualifications on ${snap.size} trainer document(s).`,
  }
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
