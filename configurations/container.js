const awilix = require('awilix');
const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.PROXY
});

// Repositories
const UserRepository = require('../repos/UserRepo');
const PaymentRepository = require('../repos/PaymentRepos');
const AuthRepository = require('../repos/AuthRepo');
const PGCutomerRepository = require('../repos/PGCutomerRepo');
const CardRepository = require('../repos/CardRepo');


container.register({
    // Here we are telling Awilix how to resolve a
    // userController: by instantiating a class.

    // Repositories
    userRepository: awilix.asClass(UserRepository).singleton(),
    paymentRepository: awilix.asClass(PaymentRepository).singleton(),
    authRepository: awilix.asClass(AuthRepository).singleton(),
    pGCutomerRepository: awilix.asClass(PGCutomerRepository).singleton(),
    cardRepository: awilix.asClass(CardRepository).singleton(),
});

module.exports = container;  