const functions = require("firebase-functions")
const axios = require('axios')
const admin = require("firebase-admin")
admin.initializeApp()

exports.addLike = functions.https.onCall(async (req)=>{
    const blog_url = req.blog_url
    if (blog_url === undefined) {
        return {result: 'failed'}
    }
    // アクセス元IPアドレスを取得する
    const response = await axios.get('https://ipinfo.io')
    const writeResult = await admin.firestore().collection('likes').add({url: blog_url, ip:response.data.ip})
    return {result:'success', data: {id: writeResult.id, url: blog_url}}
})

// count like!
exports.getLike = functions.https.onCall(async (req) => {
    const blog_url = req.blog_url
    const duplicate = req.duplicate === undefined ? false : true
    if (blog_url === undefined) {
        return {result: 'failed'}
    }
    if (duplicate) {
        const response = await axios.get('https://ipinfo.io')
        const likes = await admin.firestore().collection('likes').where('url','==',blog_url).where('ip','==',response.data.ip).get()
        const result = likes.size === 0 ? 'success' : 'failed' 
        return {result:result, type:'duplicate check', count: likes.size}
    }
    // ページURLをキーにLIKEが何件送られているかを取得する
    const likes = await admin.firestore().collection('likes').where('url','==',blog_url).get()
    likes.forEach((like)=>{
        console.log(like.id, "=>", like.data())
    })
    return {result:'success', count: likes.size, type:'count like' }
})

// delete like!
exports.removeLike = functions.https.onCall(async (req) => {
    const blog_url = req.blog_url
    const id = req.id
    if (blog_url === undefined) {
        return {result: 'failed'}
    }
    // 既に消えていてもエラーにはならない
    admin.firestore().collection('likes').doc(id).delete().then(()=>{
        return {result:'success'}
    }).catch((error) => {
        return {result:'failed', message:error}
    })  
})
