import * as tfjs from '@tensorflow/tfjs-node';

async function loadModel() {
    const modelUrl = "https://storage.googleapis.com/aquaculture_mate-bucket/model-machine_learning/tfjs-model/model.json";

    return tfjs.loadLayersModel(modelUrl);
}

export { loadModel}