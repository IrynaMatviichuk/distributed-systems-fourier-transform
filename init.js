db = db.getSiblingDB("fourier");
db.createUser({
  user: "fourier",
  pwd: "fourier",
  roles: [
    {
      role: "readWrite",
      db: "fourier",
    },
  ],
});
