const serviceAccount = require("./credentials.json");

const admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const nationalParks = require("./nationalparks.json");

const firestore = admin.firestore();
const collection = firestore.collection("nationalparks");

const addDocs = async () => {
  for (const nationalPark of nationalParks) {
    try {
      const doc = {
        ...nationalPark,
        date_established: admin.firestore.Timestamp.fromDate(
          new Date(nationalPark.date_established)
        ),
        location: new admin.firestore.GeoPoint(
          parseFloat(nationalPark.location.split(",")[0]),
          parseFloat(nationalPark.location.split(",")[1])
        ),
        visitors: parseInt(nationalPark.visitors),
        square_km: parseInt(nationalPark.square_km),
        acres: parseInt(nationalPark.acres),
        world_heritage_site:
          nationalPark.world_heritage_site === "true" ? true : false,
        attributes: {
          testValue: "Mountains",
          testValue1: "Rivers",
          testValue2: "Forests",
        },
      };
      const docRef = await collection.add(doc);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
};

addDocs().then(() => {
  process.exit(0);
});
