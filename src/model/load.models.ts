import { BadRequestException } from '@nestjs/common';
import * as tfjs from '@tensorflow/tfjs-node';

// const tfjs = require('@tensorflow/tfjs-node');
// const { nodeFileSystemRouter } = require('@tensorflow/tfjs-node/dist/io/file_system');

async function loadModel() {
    const modelUrl = "https://storage.googleapis.com/aquaculture_mate-bucket/model-machine_learning/tfjs-model/model.json";

    return tfjs.loadLayersModel(modelUrl);
}

export { loadModel}