const ffi = require('ffi')
const ref = require('ref')
const fs = require('fs')
const StructType = require('ref-struct')
const ArcSoftFD = require('./ArcSoftFD.js')
const ArcSoftFR = require('./ArcSoftFR.js')
const ArcSoftBase = require('./ArcSoftBase.js')
const Jimp = require("jimp")
const fse = require('fs-extra')
const base = require('./ArcSoftBase.js')

let APPID = '5Q3UUrYv2T1qAXtsdGFJXaTMjHdgvUpiktzxLhZLcYC1'
let FD_SDKKEY = 'DcHzisteEJPMcDM9ZtPkRGbuvA9FJRUuqvaQNjCBucer'
let FR_SDKKEY = 'DcHzisteEJPMcDM9ZtPkRGc35ZQS8XUwaVtYQ4mCuyT6'

//init Engine
let MAX_FACE_NUM = 50
let FD_WORKBUF_SIZE = 20 * 1024 * 1024
let FR_WORKBUF_SIZE = 40 * 1024 * 1024
const pFDWorkMem = ArcSoftBase.malloc(FD_WORKBUF_SIZE)
const pFRWorkMem = ArcSoftBase.malloc(FR_WORKBUF_SIZE)

const AFR_FSDK_FACEMODEL = StructType({
	pbFeature: base.MHandleType,
	lFeatureSize: base.MInt32
})

const phFDEngine = ref.ref(new Buffer(ArcSoftBase.MIntPtr_t.size))
let ret = ArcSoftFD.AFD_FSDK_InitialFaceEngine(APPID, FD_SDKKEY, pFDWorkMem, FD_WORKBUF_SIZE, phFDEngine, ArcSoftFD.OrientPriority.AFD_FSDK_OPF_0_HIGHER_EXT, 32, MAX_FACE_NUM)
if (ret != 0) {
	ArcSoftBase.free(pFDWorkMem)
	ArcSoftBase.free(pFRWorkMem)
	console.log('AFD_FSDK_InitialFaceEngine ret == ' + ret)
	process.exit()
}
const hFDEngine = ref.deref(phFDEngine)
	//print FD Engine version
const pVersionFD = ArcSoftFD.AFD_FSDK_GetVersion(hFDEngine)
const versionFD = pVersionFD.deref()
console.log('' + versionFD.lCodebase + ' ' + versionFD.lMajor + ' ' + versionFD.lMinor + ' ' + versionFD.lBuild)
console.log(versionFD.Version)
console.log(versionFD.BuildDate)
console.log(versionFD.CopyRight)

const phFREngine = ref.ref(new Buffer(ArcSoftBase.MIntPtr_t.size))
ret = ArcSoftFR.AFR_FSDK_InitialEngine(APPID, FR_SDKKEY, pFRWorkMem, FR_WORKBUF_SIZE, phFREngine)
if (ret != 0) {
	ArcSoftFD.AFD_FSDK_UninitialFaceEngine(hFDEngine)
	ArcSoftBase.free(pFDWorkMem)
	ArcSoftBase.free(pFRWorkMem)
	console.log('AFR_FSDK_InitialEngine ret == ' + ret)
	System.exit(0)
}
const hFREngine = ref.deref(phFREngine)

//print FR Engine version
const pVersionFR = ArcSoftFR.AFR_FSDK_GetVersion(hFREngine)
const versionFR = pVersionFR.deref()
console.log('' + versionFR.lCodebase + ' ' + versionFR.lMajor + ' ' + versionFR.lMinor + ' ' + versionFR.lBuild)
console.log(versionFR.Version)
console.log(versionFR.BuildDate)
console.log(versionFR.CopyRight)

async function getFaces(imgMat) {
	return new Promise(async(resolve, reject) => {
		doFaceDetection(imgMat, async function(err, asvl, faces) {
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

function doFaceDetection(img, faces_callback, width, height, format) {
	if (arguments.length === 2) {
		ArcSoftBase.loadImage(img, function(err, inputImage) {
			if (err) throw err
			ArcSoftFD.process(hFDEngine, inputImage, faces_callback)
		})
	} else if (arguments.length === 5) {
		ArcSoftBase.loadYUVImage(img, width, height, format, (err, inputImage) => {
			if (err) throw err
			ArcSoftFD.process(hFDEngine, inputImage, faces_callback)
		})
	} else {
		throw new Error('wrong number of arguments')
	}
}

const compareBufID = async(faceFeature, id) => {
	const face = await model.face.findOne({
		_id: id
	}, {
		feature: 1
	})
	if (!face) return 0
	const featureM = face.feature
	const faceFeatureM = new AFR_FSDK_FACEMODEL()
	const bufferM = new Buffer(featureM, 'base64')
	faceFeatureM.lFeatureSize = bufferM.length
	faceFeatureM.pbFeature = bufferM
	const source = await ArcSoftFR.compareFaceSimilarity(hFREngine, faceFeature, faceFeatureM)
	return {
		id,
		source
	}
}

exports.matchFile = async(path, faceId) => {
	try {
		const imgMat = await Jimp.read(path)
		const {
			asvl,
			faces
		} = await getFaces(imgMat)
		if (!faces.nFace) {
			log('cant find face: ', path)
			return 0
		}
		const featureP = ArcSoftFR.extractFeature(hFREngine, asvl, faces.info[0])
		const faceP = model.face.findOne({
			_id: faceId
		}, {
			feature: 1
		})
		const [featureBuf, face] = await Promise.all([featureP, faceP])
		if (!featureBuf.lenth || !face) return 0
		const faceFeature = new AFR_FSDK_FACEMODEL()
		faceFeature.lFeatureSize = featureBuf.length
		faceFeature.pbFeature = featureBuf

		const featureM = face.feature
		const faceFeatureM = new AFR_FSDK_FACEMODEL()
		const bufferM = new Buffer(featureM, 'base64')
		faceFeatureM.lFeatureSize = bufferM.length
		faceFeatureM.pbFeature = bufferM
		const source = await ArcSoftFR.compareFaceSimilarity(hFREngine, faceFeature, faceFeatureM)
		return source
	} catch (e) {
		return 0
	}
}

exports.getFeatureBuf = async(path) => {
	try {
		const imgMat = await Jimp.read(path)
		const {
			asvl,
			faces
		} = await getFaces(imgMat)
		if (!faces.nFace) {
			log('cant find face: ', path)
			return null
		}
		return await ArcSoftFR.extractFeature(hFREngine, asvl, faces.info[0])
	} catch (e) {
		return null
	}
}

exports.matchFeatureBuf = async(featureBuf, ids) => {
	const faceFeature = new AFR_FSDK_FACEMODEL()
	faceFeature.lFeatureSize = featureBuf.length
	faceFeature.pbFeature = featureBuf
	const promises = []
	for (let id of ids) {
		const promise = compareBufID(faceFeature, id)
		promises.push(promise)
	}
	return await Promise.all(promises)
}