const awilix = require('awilix');
const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.PROXY
});

// Repositories
const UserRepository = require('../repos/UserRepo');

container.register({
    // Here we are telling Awilix how to resolve a
    // userController: by instantiating a class.

    // Repositories
    userRepository: awilix.asClass(UserRepository).singleton(),
});

module.exports = container;  