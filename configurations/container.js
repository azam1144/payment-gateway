const awilix = require('awilix');
const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.PROXY
});

// Repositories
const UserRepository = require('../repos/UserRepo');
const CardRepository = require('../repos/CardRepo');
const PaymentRepository = require('../repos/PaymentRepos');
const AuthRepository = require('../repos/AuthRepo');


container.register({
    // Here we are telling Awilix how to resolve a
    // userController: by instantiating a class.

    // Repositories
    userRepository: awilix.asClass(UserRepository).singleton(),
    cardRepository: awilix.asClass(CardRepository).singleton(),
    paymentRepository: awilix.asClass(PaymentRepository).singleton(),
    authRepository: awilix.asClass(AuthRepository).singleton(),
});

module.exports = container;  