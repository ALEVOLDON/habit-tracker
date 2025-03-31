const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;

// Подключаемся к тестовой базе данных перед всеми тестами
beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
});

// Очищаем базу данных после каждого теста
afterEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany();
  }
});

// Отключаемся от базы данных после всех тестов
afterAll(async () => {
  await mongoose.connection.close();
  await mongod.stop();
}); 