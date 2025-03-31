const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const { beforeAll, afterAll } = require('@jest/globals');

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

// Закрываем соединение с базой данных после всех тестов
afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
  if (mongod) {
    await mongod.stop();
  }
}); 