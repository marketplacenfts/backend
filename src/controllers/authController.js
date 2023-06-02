const { Router } = require('express');
const router = Router();
const short = require('short-uuid');
const sequelize = require("sequelize");
const { Op } = require("sequelize");
const User = require("../models").User;
const History = require("../models").nftBuyHistory;
const Like = require("../models").likes;
const Activity = require("../models").activity;
const NFT = require("../models").nft;
const Collection = require("../models").collections;
const Bid = require("../models").bids;
const Auction = require("../models").auctions;
const MarketContracts = require("../models").marketContracts;
const NftCollection = require("../models").nftCollection;
const axios = require('axios');
const IPFS_ENDPOINT = process.env.IPFS_ENDPOINT;
const Moralis = require("moralis/node");

const serverUrl = "https://p53cwolfxhvz.usemoralis.com:2053/server";
const appId = "nfkhMDgFpHSkThk6DCLFl8ADd647QpQSadXmeeuK";
const masterKey = "8xJn76yyOk3xavqouikIJbQr3sIIdWIl8CXlReeB";

function generateUsername(address) {
    const translator = short();
    return translator.new();
}

router.post('/ingreso', async (req, res, next) => {
    try {
        const { publicAddress } = req.body;
        const userData = await User.findAll({ where: { publicAddress }});
        if (userData.length == 0) {
            const username = generateUsername(publicAddress);
            const user = await User.create({
                publicAddress, username, role: "user", status: 'no verificado', nonce: (Math.floor(Math.random()*90000) + 10000),
                avatar: `https://${IPFS_ENDPOINT}/ipfs/QmddxHWdaWNnYYdUp7F7gPbYfG7tNPE8srDYHNbytcRiti`
            }); 
            console.log(user);
            res.status(200).json({auth: true, user});
        } else {
            const user = {
                id: userData[0].id, publicAddress: userData[0].publicAddress, username: userData[0].username, email: userData[0].email,
                role: userData[0].role, nonce: userData[0].nonce, status: userData[0].status, avatar: userData[0].avatar, 
                apellido: userData[0].apellido, nombre: userData[0].nombre, about: userData[0].about
            };
            res.status(200).json({auth: true, user});
        } 
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});
    }
});

router.post('/updateProfile', async (req, res, next) => {
    try {
        const { username, email, fileAvatarUrl, ciudad, id, cedula, fileDNIUrl, status } = req.body;
        const user = await User.update({
            username, email, cedula, avatar: fileAvatarUrl, dni_file: fileDNIUrl, ciudad, status
        }, { where : {
            id: id
        }});
        if (user[0] == 1) {
            const userData = await User.findAll({ where: { id: id }});
            console.log(userData[0])
            res.status(200).json({message: 'user updated', user: userData[0]});
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});
    }
});

router.post('/saveNFTBuy', async (req, res, next) => {
   try {
       const { collection, tokenId, seller, buyer, price, txid } = req.body;
       const history = await History.create({
           collection, tokenId, seller, buyer, price, txid
       });
       res.status(200).json({mesasge: 'created'});
   } catch (error) {
    console.log(error)
    res.status(500).json({message: "Internal Server Error"});
   } 
});

router.post('/getNickByAddress', async (req, res, next) => {
    try {
        const { publicAddress } = req.body;
        let nick = await User.findAll({ 
            attributes: ['username', 'id', 'publicAddress', 'avatar', 'about', 'role', 'status'],
            where: { publicAddress }
        });
        nick = nick[0];
        res.status(200).json({nick});
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});
    }
});

router.post('/getAddressByNick', async (req, res, next) => {
    try {
        const { username } = req.body;
        let address = await User.findAll({ 
            attributes: ['username', 'id', 'publicAddress', 'avatar'],
            where: { username }
        });
        address = address[0];
        res.status(200).json({address});
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});
    }
});



router.post('/getNFTSellHistory', async (req, res, next) => {
    try {
        const { collection, tokenId } = req.body;
        const history = await History.findAll({
            where: { 
                [Op.and]: [{collection}, {tokenId}]
             }
        });
        res.status(200).json({history});
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});
    }
});

router.get('/getUnverifyUsers', async (req, res, next) => {
    try {
        const users = await User.findAll({ 
            attributes: ['id', 'username', 'publicAddress', 'avatar'],
            where: { status: 'en espera' }
         });
        res.status(200).json({users});
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});
    }
});

router.get('/getUserData', async (req, res, next) => {
    try {
        const id = req.query.id;
        console.log(id);
        const user = await User.findAll({
            where: { id }
        });
        res.status(200).json({ user: user[0]});
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});
    } 
});

router.post('/updateUserStatus', async (req, res, next) => {
    try {
        const { id, role } = req.body;
        const user = await User.update({ status: 'verificado', role }, { where: {id} });
        console.log(user);
        res.status(200).json({ message: 'Usuario Verificado' });
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});
    }
});

router.post('/updateUserBio', async (req, res, next) => {
    try {
        const { id, username, avatar, about } = req.body;
        const user = await User.update({ username, avatar, about }, { where: {id} });
        if (user[0] == 1) {
            const userData = await User.findAll({ where: { id: id }});
            console.log(userData[0])
            res.status(200).json({message: 'Bio Actualizada', user: userData[0]});
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});
    }
});

router.post('/updateUserPetroAppData', async (req, res, next) => {
    try {
        const { id, nombre, apellido, email, status } = req.body;
        const user = await User.update({ nombre, apellido, email, status }, { where: {id} });
        if (user[0] == 1) {
            const userData = await User.findAll({ where: { id: id }});
            console.log(userData[0])
            res.status(200).json({message: 'Data Actualizada', user: userData[0]});
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});
    }
});

router.post('/createLike', async (req, res, next) => {
    try {
        const { tokenId, username, collection } = req.body;
        const user = await Like.findAll({
            where: {
                [Op.and]: [{collection}, { tokenId }, { username }]
            }
        });
        console.log(user.length);
        let like = {}
        if (user.length == 0) {
            like = await Like.create({
                collection, tokenId, username
            });
        } else {
            like = false;
        }
        res.status(200).json(like);
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});
    }
});

router.post('/updateNFTLike', async (req, res, next) => {
    try {
        const { collection, tokenId, likes  } = req.body;
        const nftlikes = await NFT.update({ likes }, { where: {
            [Op.and]: [{nftcontract: collection}, { tokenId }]
        }}
        );
        console.log(nftlikes);
        res.status(200).json(nftlikes);
    } catch (error) {
        console.log(error)  
        res.status(500).json({message: "Internal Server Error"});
    }
});

router.get('/getPopularNFTs', async (req, res, next) => {
    try {   
        const popularNFTs = await NFT.findAll({
                order: [
                    ['likes', 'DESC']
                ], limit: 5
        });
        res.status(200).json(popularNFTs);
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});
    }
});

router.post('/tokenLikesCount', async (req, res, next) => {
    try {
        const { collection, tokenId } = req.body;
        console.log(tokenId);
        const count = await Like.findAll({
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('tokenId')), 'likes']
            ], where: {
                [Op.and]: [{collection}, { tokenId }]
            }
        });
        res.status(200).json({ count });
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});
    }
});

router.post('/getTokenLikes', async (req, res, next) => {
    try {
        const { collection, tokenId } = req.body;
        const likes = await Like.findAll({
            attributes: ['username'],
            where: { 
                [Op.and]: [{collection}, { tokenId }]
             }
        });
        res.status(200).json(likes);
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});
    }
});

router.post('/getAvatarByUsername', async (req, res, next) => {
    try {
        const { username } = req.body;
        const avatar = await User.findAll({
            attributes: ['avatar'],
            where: { username }
        });
        res.status(200).json(avatar);
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});
    }
});

router.post('/activity', async (req, res, next) => {
    try {
        const { userId, username, tokenId, action, image, txHash, red, collection } = req.body;
        const activity = await Activity.create({
            userId, username, tokenId, action, image, txHash, red, collection
        });
        console.log(activity);
        res.status(200).json({activity});
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});
    }
}); 

router.post('/getActivityById', async (req, res, next) => {
    try {
        const { userId } = req.body;
        const activity = await Activity.findAll({
            where: { userId }, 
            order: [
                ['createdAt', 'DESC']
            ], limit: 10
        });
        res.status(200).json({activity});
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});
    }
});

router.get('/getActivity', async (req, res, next) => {
    try {
        const activity = await Activity.findAll({
            order: [
                ['createdAt', 'DESC']
            ], limit: 10
        });
        res.status(200).json(activity);
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});
    }
});

router.get('/testApiRarible', async (req, res, next) => {
    try {
        const address = req.query.address;
        const nftCollectiondata = await axios.get(`https://api.rarible.org/v0.1/items/byCollection?collection=ETHEREUM%3A${address}&size=100`);
        nftCollectiondata.data.items.map(async item => {
            await NftCollection.create({
                tokenAddress: address, tokenId: item.tokenId, name: item.meta.name, image: item.meta.content[0].url, red: 1
            })
        });
        res.status(200).json('exito');
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});
    }
});

router.post('/collection', async (req, res, next) => {
    try {
        const { address, name, autor, sold, abi, red, url, image, description, maxSupply, tipo, api, avatar } = req.body;
        const collection = await Collection.create({
            address, abi, name, autor, sold, red, image, description, url, maxSupply, avatar, tipo
        });
        const chain = {
            56: 'bsc',
            1: 'eth',
            137: 'matic',
            80001: 'matic'
        }
        if (tipo == 'externa') {
            if (api == 'rarible') {
                const nftCollectiondata = await axios.get(`https://api.rarible.org/v0.1/items/byCollection?collection=ETHEREUM%3A${address}&size=100`);
                nftCollectiondata.data.items.map(async item => {
                console.log(item.meta.content[0].url);
                await NftCollection.create({
                    tokenAddress: address, tokenId: item.tokenId, name: item.meta.name, image: item.meta.content[0].url, red
                })
            })
            } else if (api == 'moralis') {
                await Moralis.start({ serverUrl, appId, masterKey });
                const options = {
                    address: address,
                    chain: chain[red]
                };
                const nftsRaw = await Moralis.Web3API.token.getAllTokenIds(options);
                nftsRaw.result.map(async item => {
                    if (item.metadata != null) {
                        const image = JSON.parse(item.metadata).image.includes('ipfs.io') ? JSON.parse(item.metadata).image 
                        : JSON.parse(item.metadata).image.includes('ipfs://') ? (`https://ipfs.io/ipfs/${(JSON.parse(item.metadata).image).split('://')[1]}`) 
                        : JSON.parse(item.metadata).image.includes('www') ? JSON.parse(item.metadata).image : JSON.parse(item.metadata).image;
                        console.log(image);
                        await NftCollection.create({
                            tokenAddress: address, tokenId: item.token_id, name: `${item.name} ${item.token_id}`, image, red
                        })
                    }
                });
            }
        }
        res.status(200).json(collection);
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});
    }
}); 

router.post('/searchCollections', async (req, res, next) => {
    try {
        const { param } = req.body;
        totalCollections = await Collection.findAll({
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('id')), 'total']
            ], where: {
                name: {[Op.substring] : param } 
              }
        });
        const collections = await Collection.findAll({
            where: {
                name: {[Op.substring] : param } 
              }
        });
        res.status(200).json({collections, totalCollections});
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});
    }
});

router.post('/nftCollection', async (req, res, next) => {
    try {
        const {  tokenAddress, tokenId, name, image, red } = req.body;
        const nft = await NftCollection.create({
            tokenAddress, tokenId, name, image, red
        });
        console.log(nft);
        res.status(200).json(nft);
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});
    }
});

router.get('/getNFTsByAddressCollection', async (req, res, next) => {
    try {
        const address = req.query.address;
        const nfts = await NFT.findAll({
            where: { nftcontract: address }
        });
        res.status(200).json(nfts);
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});
    }
});

router.get('/getNFTsCollectionByAddressCollection', async (req, res, next) => {
    try {
        const address = req.query.address;
        const nfts = await NftCollection.findAll({
            where: { tokenAddress: address }
        });
        res.status(200).json(nfts);
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});
    }
});

router.post('/updateCollection', async (req, res, next) => {
    try {
        const { status, address } = req.body;
        const collection = await Collection.update( {active: status}, { where: {address} });
        console.log(collection);
        res.status(200).json({message: true});
    } catch (error) {
        console.log(error)  
        res.status(500).json({message: "Internal Server Error"});
    }
});

router.get('/getCollectionByAddress', async (req, res, next) => {
    try {
        const address = req.query.address;
        const collection = await Collection.findAll({
            where: { address }
        });
        res.status(200).json(collection);
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});
    }
});

router.get('/getOursCollections', async (req, res, next) => {
    try {
        const collection = await Collection.findAll({
            where: { tipo: 'propia' }
        });
        res.status(200).json(collection);
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});
    }
});

router.get('/getAbiByAddress', async (req, res, next) => {
    try {
        const address = req.query.address;
        const abi = await Collection.findAll({
            where: { address }
        });
        res.status(200).json(abi);
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});
    }
});

router.get('/getCollections', async (req, res, next) => {
    try {
        const collection = await Collection.findAll();
        res.status(200).json(collection);
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});
    }
});

router.get('/getCollectionsByRed', async (req, res, next) => {
    try {
        const red = req.query.red;
        const collection = await Collection.findAll(
           { where: { red } }
        );
        res.status(200).json(collection);
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});
    }
});

router.post('/marketContracts', async (req, res, next) => {
    try {
        const {  chain, address, abi  } = req.body;
        const market = await MarketContracts.create({
            chain, address, abi
        });
        console.log(market);
        res.status(200).json(market);
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});
    }
}); 

router.get('/getMarketContractByRed', async (req, res, next) => {
    try {
        const chain = req.query.chain;
        const market = await MarketContracts.findAll(
           { where: { chain } }
        );
        res.status(200).json(market);
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});
    }
});

router.post('/auction', async (req, res, next) => {
    try {
        const { auctionId, tokenAddress, tokenId, seller, price, duration, maxBid, userMaxBid, isActive  } = req.body;
        const auction = await Auction.create({
            auctionId, tokenAddress, tokenId, seller, price, duration, maxBid, userMaxBid, isActive
        });
        console.log(auction);
        res.status(200).json({auction});
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});
    }
});

router.post('/updateAuction', async (req, res, next) => {
    try {
        const { auctionId, maxBid, userMaxBid, isActive } = req.body;
        const auction = await Auction.update({ maxBid, userMaxBid, isActive }, { where: {auctionId} });
        console.log(auction);
        res.status(200).json({ message: 'Subasta Actualizada' });
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});
    }
});

router.post('/bids', async (req, res, next) => {
    try {
        const { auctionId, address, tokenId, user, amount } = req.body;
        const bids = await Bid.create({
            auctionId: auctionId.toString(), address, tokenId, user, amount
        });
        console.log(bids);
        res.status(200).json({bids});
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});
    }
}); 

router.get('/getBidsByAuction', async (req, res, next) => {
    try {
        const auctionId = req.query.auction;
        const bids = await Bid.findAll({ 
            where: { auctionId },
            order: [['amount', 'DESC']]
         });
        res.status(200).json(bids);
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});
    }
});

router.post('/isRegistered', async (req, res, next) => {
    try {
        const { publicAddress } = req.body;
        const user = await User.findAll({
            attributes: ['username'],
            where: { publicAddress }
        });
        res.status(200).json(user);
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});
    }
});

router.post('/isVerified', async (req, res, next) => {
    try {
        const { userId } = req.body;
        const user = await User.findAll({
            attributes: ['username', 'avatar'],
            where:{ 
                [Op.and]:
                    [{ id: userId }, {status: 'verificado'}]
            }
        });
        res.status(200).json({verified: user.length, user});
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});
    }
});

router.post('/canTransfer', async (req, res, next) => {
    try {
        const { publicAddress } = req.body;
        const user = await User.findAll({
            attributes: ['username'],
            where:{ 
                [Op.and]:
                    [{ publicAddress }, {status: 'verificado'}]
            }
        });
        res.status(200).json(user);
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});
    }
});

router.post('/isRegisteredUsername', async (req, res, next) => {
    try {
        const { username } = req.body;
        const user = await User.findAll({
            attributes: ['username'],
            where: { username }
        });
        res.status(200).json(user.length);
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});
    }
});

router.post('/isRegisteredEmail', async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findAll({
            attributes: ['email'],
            where: { email }
        });
        res.status(200).json(user.length);
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});
    }
});

router.post('/isRegisteredCedula', async (req, res, next) => {
    try {
        const { cedula } = req.body;
        const user = await User.findAll({
            attributes: ['cedula'],
            where: { cedula }
        });
        res.status(200).json(user.length);
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});
    }
});

router.post('/createNFT', async (req, res, next) => {
    try {
        const {tokenId, nftcontract, seller, owner, name, price, isItem, sold, url, red, nftType, likes} = req.body;
        const nft = await NFT.create({
            tokenId, nftcontract, seller, owner, price, name,
                sold, url, isItem, red, nftType, likes
        });
        res.status(200).json(nft);
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});
    }
});

router.get('/getNFT', async (req, res, next) => {
    try {
        const address = req.query.address;
        const id = req.query.id;
        const isItem = await NFT.findAll({ 
            where: { 
                [Op.and]: [
                    { tokenId: id, nftcontract: address }
                ]
             }
         });
        res.status(200).json(isItem);
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});
    }
});

router.get('/getNFTByAddressCollection', async (req, res, next) => {
    try {
        const address = req.query.address;
        const nfts = await NFT.findAll({ 
            where: { nftcontract: address }
         });
        res.status(200).json(nfts);
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});
    }
});

router.post('/updateNFT', async (req, res, next) => {
    try {
        const { tokenId, nftcontract, seller, owner, price, sold, isItem, nftType } = req.body;
        const nft = await NFT.update({ seller, owner, price, sold, isItem, nftType }, { where: 
            { 
                [Op.and]: [
                    { tokenId, nftcontract }
                ]
             }
        });
        console.log(nft);
        res.status(200).json({ message: 'NFT actualizado' });
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});
    }
});

router.post('/updateNFTByTranfer', async (req, res, next) => {
    try {
        const { tokenId, giftAddress } = req.body;
        const nft = await NFT.update({ owner: giftAddress, seller: giftAddress, sold: true }, { where: { tokenId } });
        res.status(200).json(nft);
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"}); 
    }
});

router.post('/updateNFTByBuy', async (req, res, next) => {
    try {
        const { tokenId, wallet } = req.body;
        const nft = await NFT.update({ owner: wallet, seller: wallet, sold: true }, { where: { tokenId } });
        res.status(200).json(nft);
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"}); 
    }
});

router.post('/updateNFTByResell', async (req, res, next) => {
    try {
        const { tokenId, price } = req.body;
        const nft = NFT.update({ sold: false, price }, { where: { tokenId } });
        res.status(200).json(nft);
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"}); 
    }
});

router.post('/updateNFTByCancelSell', async (req, res, next) => {
    try {
        const { nftcontract, tokenId, seller } = req.body;
        const nft = await NFT.update({ seller, sold: true }, { where: 
            { 
                [Op.and]: [
                    { tokenId, nftcontract }
                ]
             }
        });
        res.status(200).json(nft);
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"}); 
    }
});

router.post('/deleteNFT', async (req, res, next) => {
    try {
        const { tokenId } = req.body;
        const nft = await NFT.destroy( { where: { tokenId } });
        res.status(200).json(nft);
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"}); 
    }
});

router.post('/searchItems', async (req, res, next) => {
    try {
        const { param } = req.body;
        totalNFTs = await NFT.findAll({
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('id')), 'total']
            ], where: {
                name: {[Op.substring] : param } 
              }
        });
        const nfts = await NFT.findAll({
            where: {
              name: {[Op.substring] : param } 
            }
        });
        res.status(200).json({nfts, totalNFTs});
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});
    }
});


router.post('/searchUsers', async (req, res, next) => {
    try {
        const { param } = req.body;
        totalUsers = await User.findAll({
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('id')), 'total']
            ], where: {
                username: {[Op.substring] : param } 
              }
        });
        const users = await User.findAll({
            where: {
                username: {[Op.substring] : param } 
              }
        });
        res.status(200).json({users, totalUsers});
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});
    }
});


router.get('/loadNFTs', async (req, res, next) => {
    try {
    const queryString = req.query.page;
    const filter = (req.query.filter == 'undefined') ? 'status' : req.query.filter;
    const param = (req.query.param == 'undefined') ? 0 : req.query.param;
    console.log(filter, param);
    let nfts;
    let totalNFTs;
    console.log('page' + queryString);
    if (filter == 'price') {
        totalNFTs = await NFT.findAll({
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('id')), 'total']
            ], where: { sold: 0 }
        });
        let ordenado = '';
        if (param == 'alto') {
            ordenado = 'desc';
        } else {
            ordenado = 'asc';
        }
        if (queryString == 1) {
            nfts = await NFT.findAll({ where: {sold: 0}, order: [['price', ordenado.toUpperCase()]], offset: 0, limit: 16 });
        } else {
            const offset = (Number(queryString) - 1) * 16;
            console.log(`offset: ${offset}`);
            nfts = await NFT.findAll({ where: {sold: 0}, order: [['price', ordenado.toUpperCase()]], offset: offset, limit: 16 });
        }
     } else if (filter == 'time') {
        totalNFTs = await NFT.findAll({
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('id')), 'total']
            ]
        });
        if (queryString == 1) {
            nfts = await NFT.findAll({ order: [['createdAt', param.toUpperCase()]], offset: 0, limit: 16 });
        } else {
            const offset = (Number(queryString) - 1) * 16;
            console.log(`offset: ${offset}`);
            nfts = await NFT.findAll({ order: [['createdAt', param.toUpperCase()]], offset: offset, limit: 16 });
        }
     } else if (filter == 'status') {
        console.log(`Filter 1: ${filter}, param 1: ${param}`);
        if (param == 'all') {
            totalNFTs = await NFT.findAll({
                attributes: [
                    [sequelize.fn('COUNT', sequelize.col('id')), 'total']
                ]
            });
            if (queryString == 1) {
                nfts = await NFT.findAll({ offset: 0, limit: 16 });
            } else {
                const offset = (Number(queryString) - 1) * 16;
                console.log(`offset: ${offset}`);
                nfts = await NFT.findAll({ offset: offset, limit: 16 });
            }
        } else {
            totalNFTs = await NFT.findAll({
                attributes: [
                    [sequelize.fn('COUNT', sequelize.col('id')), 'total']
                ], where: { sold: param }
            });
            if (queryString == 1) {
                nfts = await NFT.findAll({ where: {sold: param}, offset: 0, limit: 16 });
            } else {
                const offset = (Number(queryString) - 1) * 16;
                console.log(`offset: ${offset}`);
                nfts = await NFT.findAll({ where: {sold: param}, offset: offset, limit: 16 });
            }
        }
    } else if (filter == 'subasta') {
        console.log(`Filter 2: ${filter}, param 2: ${param}`);
        totalNFTs = await NFT.findAll({
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('id')), 'total']
            ], where: { nftType: param }
        });
        if (queryString == 1) {
            nfts = await NFT.findAll({ where: {nftType: param}, offset: 0, limit: 16 });
        } else {
            const offset = (Number(queryString) - 1) * 16;
            console.log(`offset: ${offset}`);
            nfts = await NFT.findAll({ where: {nftType: param}, offset: offset, limit: 16 });
        }
    } else if (!filter) {
        totalNFTs = await NFT.findAll({
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('id')), 'total']
            ]
        });
        if (queryString == 1) {
            nfts = await NFT.findAll({ offset: 0, limit: 16 });
        } else {
            const offset = (Number(queryString) - 1) * 16;
            console.log(`offset: ${offset}`);
            nfts = await NFT.findAll({ offset: offset, limit: 16 });
        }
    }
    console.log(`Total NFTs: ${totalNFTs}`);
    res.status(200).json({nfts, totalNFTs});
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});
    }
});

router.get('/statistics', async (req, res, next) => {
    try {
        const users = await User.findAll(
            {
                attributes: [
                    [sequelize.fn('COUNT', sequelize.col('publicAddress')), 'users']
                ]
            }
        );
        const nfts = await NFT.findAll(
            {
                attributes: [
                    [sequelize.fn('COUNT', sequelize.col('id')), 'nfts']
                ]
            }
        );
        const collections = await Collection.findAll(
            {
                attributes: [
                    [sequelize.fn('COUNT', sequelize.col('id')), 'collections']
                ]
            }
        );
        const txs = await Activity.findAll(
            {
                attributes: [
                    [sequelize.fn('COUNT', sequelize.col('id')), 'txs']
                ] 
            }
        );
        const nftsNotSold = await NFT.findAll(
            {
                attributes: [
                    [sequelize.fn('COUNT', sequelize.col('id')), 'nfts']
                ], where: { sold: 0 }
            }
        );
        const nftsSold = await NFT.findAll(
            {
                attributes: [
                    [sequelize.fn('COUNT', sequelize.col('id')), 'nfts']
                ], where: { sold: 1 }
            }
        );
        const nftsSells = await History.findAll({
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('id')), 'nfts']
            ]
        });
        res.status(200).json({users,nfts,txs,nftsNotSold,nftsSold,nftsSells,collections});
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});
    }
});

router.post('/getUserLikes', async (req, res, next) => {
    try {
        const { username } = req.body;
        const likes = await Like.findAll({
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('username')), 'likes']
            ], where: {
                username
            }
        });
        res.status(200).json(likes);
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});
    }
});

router.get('/getAuction', async (req, res, next) => {
    try {
        const address = req.query.address;
        const id = req.query.id;
        const auction = await Auction.findAll({ 
            where: { 
                [Op.and]: [
                    { tokenId: id, tokenAddress: address, isActive: true }
                ]
             }
         });
        res.status(200).json(auction);
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});
    }
});

router.get('/getNFTByOwner', async (req, res, next) => {
    try {
        const owner = req.query.owner;
        const nfts = await NFT.findAll({ 
            where: { 
                owner
             }
         });
        res.status(200).json(nfts);
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error"});
    }
});

module.exports = router;