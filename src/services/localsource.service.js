import { items, shopusers, bankaccounts, transactions } from '@/datasource/data.js'
import {v4 as uuidv4} from 'uuid'
import bcrypt from 'bcryptjs';

/* Les fonctions ci-dessous doivent mimer ce que renvoie l'API en fonction des requêtes possibles.

  Dans certains cas, ces fonctions vont avoir des paramètres afin de filtrer les données qui se trouvent dans data.js
  Il est fortement conseillé que ces paramètres soient les mêmes que ceux qu'il faudrait envoyer à l'API.

  IMPORTANT : toutes les requêtes à l'API DOIVENT renvoyer un objet JSON au format {error: ..., status: ..., data: ...}
  Cela implique que toutes les foncitons ci-dessous renvoient un objet selon ce format.
 */

/**
 * Si le login et le mot de passe sont fournis, que le login correspond à un utilisateur existant,
 * shopLogin() renvoie un objet contenant uniquement l'id, le nom, le login, l'email
 * et un identifiant de session sous forme d'un uuid. Sinon, un texte d'erreur est renvoyé.
 * NB: pas de test du mot de passe dans cet exemple.
 * @param data
 * @returns {{error: number, status: number, data: string}|{error: number, status: number, data: {_id: string | *, name: string | *, login: string | *, email: string | *, session}}}
 */
function shopLogin(data) {
    if ((!data.login) || (!data.password))
        return { error: 1, status: 404, data: 'aucun login/pass fourni' };

    // Recherche de l'utilisateur par login
    const user = shopusers.find(e => e.login === data.login);
    if (!user)
        return { error: 1, status: 404, data: 'login/pass incorrect' };

    // Vérification du mot de passe avec bcrypt
    const passwordOk = bcrypt.compareSync(data.password, user.password);
    if (!passwordOk)
        return { error: 1, status: 401, data: 'login/pass incorrect' };

    // Génération d'une session si inexistante
    if (!user.session) {
        user.session = uuidv4();
    }

    // On retourne uniquement les infos nécessaires
    const u = {
        _id: user._id,
        name: user.name,
        login: user.login,
        email: user.email,
        session: user.session
    };

    return { error: 0, status: 200, data: u };
}

/**
 * getAllViruses() renvoie un tableau d'items dont le format est le même que celui stockée en source locale (donc aussi en BdD côté API)
 * @returns {{error: number, data}}
 */
function getAllViruses() {
  return {error: 0, data: items}
}

/**
 * Si un n° est fourni et qu'il correspond à un compte existant, getAccountAmount() renvoie uniquement le solde
 * du compte, sinon un texte d'erreur.
 * @param number
 * @returns {{error: number, status: number, data: string}|{error: number, status: number, data: number | *}}
 */
function getAccountAmount(number) {
    if(number && number !== ''){
        let amount = bankaccounts.find(b => b.number === number);
        if (amount){
            console.log("putain de compte",amount)
            return {error: 0, status: 200, data: amount};
        } else {
            return {error:1,status:404,data:"Numéro de compte inexistant"}
        }

    } else {
        return {error: 1, status: 400, data: "Numéro de compte incorrect" };
    }
}

/**
 * Si un n° est fourni et qu'il correspond à un compte existant, getAccountTransactions() renvoie uniquement le solde
 * du compte, sinon un texte d'erreur.
 * @param number
 * @returns {{error: number, status: number, data: ({_id: string, amount: number, account: string, date: {$date: string}, uuid: string}|{_id: string, amount: number, account: string, date: {$date: string}, uuid: string}|{_id: string, amount: number, account: string, date: {$date: string}, uuid: string})[]}|{error: number, status: number, data: string}}
 */
async function getAccountTransactions(number) {
    if(number && number !== '') {
        let amount = bankaccounts.find(b => b.number === number);
        let transaction = transactions.filter(t => t.account === amount._id)
        console.log(transaction)
        return {error:0,status:200,data:transaction};
    } else {
        return {error:1,status:404,data:"Aucune Solde a été trouvée"};
    }
}

async function getBasket(id) {
    let user = shopusers.find(e => e._id === id);
    if (user.basket == null) user.basket = [] // si pas encore de panier (c.a.d. null ou undefined), le créer
    let basket = JSON.parse(JSON.stringify(user.basket)) // clone son panier
    return {error: 0, status: 200, data: basket}
}
async function clearBasket() {
    let user = shopusers.find(e => e._id === data._id)
    if (!user) return { error: 1, status: 404, data: 'Utilisateur non trouvé' }

    user.basket = { items: [] }
    return { error: 0, status: 200, data: user.basket }
}
async function addBasket(data) {
    let user = shopusers.find(e => e._id === data._idUser)
    if (!user) return { error: 1, status: 404, data: 'Utilisateur non trouvé' }

    let item = items.find(v => v._id === data._idItem)
    if (!item) return { error: 1, status: 404, data: 'Article introuvable' }

    // Si pas encore de panier, on le crée
    if (!user.basket) user.basket = []

    // Vérifie le stock
    const amount = data.amount ?? 1
    if (item.stock < amount) {
        return { error: 1, status: 400, data: 'Stock insuffisant' }
    }

    // Vérifie si l’article existe déjà dans le panier
    const existingItem = user.basket.find(v => v._id === item._id)
    if (existingItem) {
        // Incrémente la quantité
        existingItem.amount += amount
    } else {
        // Ajoute un clone de l’article avec la quantité
        user.basket.push({
            ...item,
            amount
        })
    }

    // Diminue le stock de l’article dans la liste globale
    item.stock -= amount

    // Clone du panier pour éviter les références
    let basket = JSON.parse(JSON.stringify(user.basket))

    console.log("🧺 Panier mis à jour :", basket)
    console.log("📦 Stock mis à jour :", item.name, "→", item.stock)

    return { error: 0, status: 200, data: basket }
}

async function deleteBasket(data) {
    console.log(data)
    let user = shopusers.find(e => e._id === data._idUser)
    if (!user) return { error: 1, status: 404, data: 'Utilisateur non trouvé' }

    // Filtrer le panier pour enlever l'élément avec l'ID correspondant
    user.basket = user.basket.filter(v => v._id !== data._idItem)
    console.log("new basket", user.basket)

    return { error: 0, status: 200, data: [...user.basket] } // renvoyer un clone
}
export async function orderBasket({ _id, basket }) {
    let user = shopusers.find(e => e._id === _id);
    if (!user.orders) user.orders = [];

    const items = basket.map(b => {
        const virus = viruses.find(v => v._id === b.item._id);
        return { item: virus, amount: b.amount };
    });

    const total = items.reduce((sum, entry) => {
        let price = entry.item.price;
        // Appliquer les promotions s’il y en a
        entry.item.promotion.forEach(promo => {
            if (entry.amount >= promo.amount)
                price -= promo.discount;
        });
        return sum + price * entry.amount;
    }, 0);

    const newOrder = {
        items,
        date: new Date(),
        total,
        status: "waiting_payment",
        uuid: uuidv4()
    };

    user.orders.push(newOrder);
    return { error: 0, status: 200, data: { uuid: newOrder.uuid } };
}

export async function getOrder({ userId, uuid }) {
    let user = shopusers.find(u => u._id === userId);
    if (!user) return { error: 1, status: 404, data: "Utilisateur introuvable" };

    let order = user.orders.find(o => o.uuid === uuid);
    if (!order) return { error: 1, status: 404, data: "Commande introuvable" };

    // Clone pour éviter de modifier la source directement
    let clone = JSON.parse(JSON.stringify(order));
    return { error: 0, status: 200, data: clone };
}

export async function payOrder({ userId, uuid }) {
    let user = shopusers.find(u => u._id === userId);
    if (!user) return { error: 1, status: 404, data: "Utilisateur introuvable" };

    let order = user.orders.find(o => o.uuid === uuid);
    if (!order) return { error: 1, status: 404, data: "Commande introuvable" };

    order.status = "finalized";

    return { error: 0, status: 200, data: "Commande payée avec succès" };
}

export default{
  shopLogin,
  getAllViruses,
  getAccountAmount,
  getAccountTransactions,
    getBasket,
    clearBasket,
    deleteBasket,
    addBasket,
    orderBasket,
    getOrder,
    payOrder

}