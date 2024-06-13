import * as tfjs from '@tensorflow/tfjs-node';

async function loadModel() {
    const modelUrl = process.env.MODEL_URL;

    return tfjs.loadLayersModel(modelUrl);
}

export { loadModel}