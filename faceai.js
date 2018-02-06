var ffi = require('ffi')
var ref = require('ref')
var fs = require('fs')
var ArcSoftFD = require('./ArcSoftFD.js')
var ArcSoftFR = require('./ArcSoftFR.js')
var ArcSoftBase = require('./ArcSoftBase.js')
var Jimp = require("jimp")
const fse = require('fs-extra')

var APPID = '5Q3UUrYv2T1qAXtsdGFJXaTMjHdgvUpiktzxLhZLcYC1'
var FD_SDKKEY = 'DcHzisteEJPMcDM9ZtPkRGbuvA9FJRUuqvaQNjCBucer'
var FR_SDKKEY = 'DcHzisteEJPMcDM9ZtPkRGc35ZQS8XUwaVtYQ4mCuyT6'

//init Engine
var MAX_FACE_NUM = 50
var FD_WORKBUF_SIZE = 20 * 1024 * 1024
var FR_WORKBUF_SIZE = 40 * 1024 * 1024
var pFDWorkMem = ArcSoftBase.malloc(FD_WORKBUF_SIZE)
var pFRWorkMem = ArcSoftBase.malloc(FR_WORKBUF_SIZE)

var phFDEngine = ref.ref(new Buffer(ArcSoftBase.MIntPtr_t.size))
var ret = ArcSoftFD.AFD_FSDK_InitialFaceEngine(APPID, FD_SDKKEY, pFDWorkMem, FD_WORKBUF_SIZE, phFDEngine, ArcSoftFD.OrientPriority.AFD_FSDK_OPF_0_HIGHER_EXT, 32, MAX_FACE_NUM)
if (ret != 0) {
	ArcSoftBase.free(pFDWorkMem)
	ArcSoftBase.free(pFRWorkMem)
	console.log('AFD_FSDK_InitialFaceEngine ret == ' + ret)
	process.exit()
}
var hFDEngine = ref.deref(phFDEngine)
	//print FD Engine version
var pVersionFD = ArcSoftFD.AFD_FSDK_GetVersion(hFDEngine)
var versionFD = pVersionFD.deref()
console.log('' + versionFD.lCodebase + ' ' + versionFD.lMajor + ' ' + versionFD.lMinor + ' ' + versionFD.lBuild)
console.log(versionFD.Version)
console.log(versionFD.BuildDate)
console.log(versionFD.CopyRight)

var phFREngine = ref.ref(new Buffer(ArcSoftBase.MIntPtr_t.size))
ret = ArcSoftFR.AFR_FSDK_InitialEngine(APPID, FR_SDKKEY, pFRWorkMem, FR_WORKBUF_SIZE, phFREngine)
if (ret != 0) {
	ArcSoftFD.AFD_FSDK_UninitialFaceEngine(hFDEngine)
	ArcSoftBase.free(pFDWorkMem)
	ArcSoftBase.free(pFRWorkMem)
	console.log('AFR_FSDK_InitialEngine ret == ' + ret)
	System.exit(0)
}
var hFREngine = ref.deref(phFREngine)

//print FR Engine version
var pVersionFR = ArcSoftFR.AFR_FSDK_GetVersion(hFREngine)
var versionFR = pVersionFR.deref()
console.log('' + versionFR.lCodebase + ' ' + versionFR.lMajor + ' ' + versionFR.lMinor + ' ' + versionFR.lBuild)
console.log(versionFR.Version)
console.log(versionFR.BuildDate)
console.log(versionFR.CopyRight)

const face2m = {}
let scoreLine = 0.667

async function process(src) {
	const obj = {}
	try {
		const {
			asvl,
			faces
		} = await getFaces(src)
		for (let i = 0; i < faces.nFace; i++) {
			const feature = await getFaceFeature(asvl, faces.info[i])
			let key = `${src.replace(/\//g, '-')}_${i}`
			let key_ = await searchFeature(feature)
			if (!key_) {
				face2m[key] = feature
				const img = await Jimp.read(src)
				const img1 = await img.clone()
				const p = await img1.crop(faces.info[i].left, faces.info[i].top, faces.info[i].right - faces.info[i].left, faces.info[i].bottom - faces.info[i].top)
				await fse.ensureDir(`/data/website/faces/`)
				await p.write(`/data/website/faces/${key}.jpg`)
			}
			obj[key] = key_
		}
	} catch (e) {
		console.log(e)
	}
	return obj
}

async function loadFaceToMap(src) {
	let src_ = '/data/website/faces/' + src
	try {
		const {
			asvl,
			faces
		} = await getFaces(src_)
		if (faces.nFace == 0) {
			console.log(src_, 'has no face')
			await model.face.update({name: src.replace('.jpg', '')}, {$set: {disabled: true}})
			return
		}
		const feature = await getFaceFeature(asvl, faces.info[0])
		face2m[src.replace('.jpg', '')] = feature
		console.log('now face number is : ', Object.keys(face2m).length)
	} catch (e) {
		console.log(e)
	}
}

async function getFaces(src) {
	return new Promise(async(resolve, reject) => {
		let exists = await fse.exists(src)
		if (!exists) {
			reject(src, ' not exists ...')
		}
		const image = fs.readFileSync(src)
		var imageRawBuffer = new Buffer(image, 'base64')

		doFaceDetection(imageRawBuffer, async function(err, asvl, faces) {
			if (err) {
				reject(err)
			} else {
				resolve({
					asvl,
					faces
				})
			}
		})
	})
}

async function getFaceFeature(asvl, face) {
	return ArcSoftFR.extractFeature(hFREngine, asvl, face)
}

async function searchFeature(feature) {
	let key = 0
	for (let fk in face2m) {
		let score = ArcSoftFR.compareFaceSimilarity(hFREngine, feature, face2m[fk])
		if (score > scoreLine) {
			key = fk
			break
		}
	}
	return key
}

async function searchSameFace(src) {
	const {
		asvl,
		faces
	} = await getFaces(src)
	const feature = await getFaceFeature(asvl, faces.info[0])
	return searchFeature(feature)
}

function doFaceDetection(filename, faces_callback, width, height, format) {

	if (arguments.length === 2) {
		ArcSoftBase.loadImage(filename, function(err, inputImage) {
			if (err) throw err
			ArcSoftFD.process(hFDEngine, inputImage, faces_callback)
		})
	} else if (arguments.length === 5) {
		ArcSoftBase.loadYUVImage(filename, width, height, format, (err, inputImage) => {
			if (err) throw err
			ArcSoftFD.process(hFDEngine, inputImage, faces_callback)
		})

	} else {
		throw new Error('wrong number of arguments')
	}
}
module.exports = {
	process,
	face2m,
	loadFaceToMap
}