// const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();
const { compare, hash } = require('bcryptjs');
const dbName = "users";
const registerCollectionName = "register";
const userCollectionName = "users";
function AddRegister() {}
function Login() {}
function List() {}
function ListReg() {}
function DeleteReg() {}
function ApproveReg() {}
function GetUserById() {}
function DeleteUser() {}
function UpdateUser() {}

module.exports = { AddRegister, Login, List, ListReg, DeleteReg, ApproveReg, DeleteUser, GetUserById, UpdateUser };
