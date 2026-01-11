import LocalSource from "@/services/localsource.service.js";

function getAccountAmountFromLocalSource(number) {
    return LocalSource.getAccountAmount(number);
}

async function getAccountAmount(number) {
    let response = null;
    try {
        // changer la méthode appelée quand cette fonctionnalité l'API est prête
        response = await getAccountAmountFromLocalSource(number)
    }
        // NB: le catch n'aura lieu que pour des requête vers l'API, s'il y a une erreur réseau
    catch (err) {
        response = {error: 1, status: 404, data: 'erreur réseau, impossible de récupéré la solde bancaire'}
    }
    return response
}

function getAllTransactionsFromLocalSource(number) {
    return LocalSource.getAccountTransactions(number);

}

async function getAllTransactions(number) {
    let response = null;
    try {
        response = await getAllTransactionsFromLocalSource(number)
    }
    catch (err) {
        response = {error: 1, status: 404, data: 'erreur réseau, impossible de récupéré les transactions'}
    }
    return response
}

async function getAccountFromLocalSource(data) {
    return LocalSource.getAccount(data)
}


async function getAccount(data) {
    let response = null;
    try {
        response = await getAccountFromLocalSource(data)
    }
    catch (err) {
        response = {error: 1, status: 404, data: 'erreur réseau, impossible de récupéré le compte'}
    }
    return response
}

async function getTransactionsFromLocalSource(data) {
    return LocalSource.getTransactions(data)
}

async function getTransactions(data) {
    let response = null;
    try {
        response = await getTransactionsFromLocalSource(data)
    }
    catch (err) {
        response = {error: 1, status: 404, data: 'erreur réseau, impossible de récupéré le compte'}
    }
    return response
}

async function createPaymentFromLocalSource(data) {
    return LocalSource.createPayment(data)
}

async function createPayment(data) {
    let response = null;
    try {
        response = await createPaymentFromLocalSource(data)
    }
    catch (err) {
        response = {error: 1, status: 404, data: 'erreur réseau, impossible de récupéré le compte'}
    }
    return response
}

async function createWithdrawFromLocalSource(data) {
    return LocalSource.createWithdraw(data)
}

async function createWithdrawService(data) {
    let response = null;
    try {
        response = await createWithdrawFromLocalSource(data)
    }
    catch (err) {
        response = {error: 1, status: 404, data: 'erreur réseau, impossible de récupéré le compte'}
    }
    return response
}

export default {
    getAccountAmount,
    getAllTransactions, createWithdrawService, createPayment, getAccount, getTransactions
}